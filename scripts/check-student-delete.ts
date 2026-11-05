import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import { config } from "dotenv";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

import { DELETE } from "../src/app/api/admin/students/[id]/route";
import { getDatabase, getSqlClient } from "../src/db";
import { auditLog, courses, enrollments, lessonProgress, lessons, loginAttempts, modules, practiceAttempts, progress, studentProfiles, users } from "../src/db/schema";
import { currentUser } from "../src/lib/auth/current-user";
import { SESSION_COOKIE, signSession } from "../src/lib/auth/session";

config({ quiet: true });
const adminId = randomUUID(), studentId = randomUUID(), courseId = randomUUID(), moduleId = randomUUID(), lessonId = randomUUID();
const phone = () => `+998${randomInt(100_000_000, 999_999_999)}`;
const studentPhone = phone();
const origin = "http://localhost:3137";

async function remove(id: string, token?: string, source = origin) {
  return DELETE(new NextRequest(`${origin}/api/admin/students/${id}`, {
    method: "DELETE", headers: { Origin: source, ...(token ? { Cookie: `${SESSION_COOKIE}=${token}` } : {}) },
  }), { params: Promise.resolve({ id }) });
}

async function main() {
  const db = getDatabase();
  // All mutations are restricted to generated fixtures, never existing students.
  await db.transaction(async tx => {
    await tx.insert(users).values([
      { id: adminId, role: "admin", fullName: "Temporary deletion test admin", phone: phone(), passwordHash: randomUUID(), mustChangePassword: false },
      { id: studentId, role: "student", fullName: "Temporary deletion test student", phone: studentPhone, passwordHash: randomUUID(), mustChangePassword: false },
    ]);
    await tx.insert(courses).values({ id: courseId, title: "Temporary deletion test", isPublished: false });
    await tx.insert(modules).values({ id: moduleId, courseId, title: "Temporary deletion test" });
    await tx.insert(lessons).values({ id: lessonId, moduleId, title: "Temporary deletion test", jsxSource: "", compiledJs: "" });
    await tx.insert(studentProfiles).values({ studentId, locale: "uz" });
    await tx.insert(enrollments).values({ studentId, courseId, grantedBy: adminId });
    await tx.insert(lessonProgress).values({ studentId, lessonId, learnDoneAt: new Date(), practiceDoneAt: new Date() });
    await tx.insert(practiceAttempts).values({ studentId, lessonId, seq: 1, correct: true });
    await tx.insert(progress).values({ studentId, lessonId, completedAt: new Date() });
    await tx.insert(loginAttempts).values({ phone: studentPhone, ip: "deletion-test", success: true });
    await tx.insert(auditLog).values([
      { actorId: adminId, action: "student.created", targetType: "user", targetId: studentId },
      { actorId: adminId, action: "access.granted", targetType: "course", targetId: courseId, meta: { studentId } },
    ]);
  });
  const adminToken = await signSession(adminId, 1), studentToken = await signSession(studentId, 1);
  assert.equal((await remove(studentId)).status, 401);
  assert.equal((await remove(studentId, studentToken)).status, 403);
  assert.equal((await remove(studentId, adminToken, "https://untrusted.example")).status, 403);
  assert.equal((await remove(adminId, adminToken)).status, 404, "admin accounts cannot be deleted through student endpoint");
  assert.equal((await remove("invalid", adminToken)).status, 404);
  assert.ok(await currentUser(studentToken), "denied operations leave student intact");
  const response = await remove(studentId, adminToken);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { deleted: true });
  assert.equal(await currentUser(studentToken), null, "old session no longer authenticates");
  assert.equal((await db.select().from(users).where(eq(users.id, studentId))).length, 0);
  for (const table of [studentProfiles, enrollments, lessonProgress, practiceAttempts, progress]) {
    assert.equal((await db.select({ studentId: table.studentId }).from(table).where(eq(table.studentId, studentId))).length, 0, "dependent data cascaded");
  }
  assert.equal((await db.select().from(loginAttempts).where(eq(loginAttempts.phone, studentPhone))).length, 0);
  const audit = await db.select().from(auditLog).where(eq(auditLog.targetId, studentId));
  assert.equal(audit.length, 1);
  assert.equal(audit[0].action, "student.deleted");
  assert.equal(audit[0].meta, null);
  assert.equal((await db.select().from(auditLog).where(eq(auditLog.targetId, courseId))).length, 0);
  assert.equal((await remove(studentId, adminToken)).status, 404, "repeat deletion is harmless");
  assert.ok(await currentUser(adminToken), "admin retained");
  assert.equal((await db.select().from(courses).where(eq(courses.id, courseId))).length, 1, "shared course retained");
  console.log("Student deletion: auth, role, origin, cascades, session revocation, audit and repeat delete passed.");
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  const db = getDatabase();
  await db.delete(auditLog).where(inArray(auditLog.targetId, [studentId, courseId]));
  await db.delete(loginAttempts).where(and(eq(loginAttempts.phone, studentPhone), eq(loginAttempts.ip, "deletion-test")));
  await db.delete(courses).where(eq(courses.id, courseId));
  await db.delete(users).where(inArray(users.id, [studentId, adminId]));
  await getSqlClient().end();
});
