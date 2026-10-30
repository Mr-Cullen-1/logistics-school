import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";

import argon2 from "argon2";
import { config } from "dotenv";
import { and, inArray } from "drizzle-orm";

import { getDatabase, getSqlClient } from "../src/db";
import { auditLog, courses, users } from "../src/db/schema";
import { SESSION_COOKIE, signSession } from "../src/lib/auth/session";

config({ quiet: true });
const base = process.env.AUTH_BASE_URL || "http://localhost:3137";
const ids: string[] = [];
const courseIds: string[] = [];

async function request(path: string, method: string, cookie?: string, body?: object) {
  return fetch(`${base}${path}`, {
    method,
    redirect: "manual",
    headers: { Origin: base, ...(cookie ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function testUser(role: "super_admin" | "admin" | "student") {
  const phone = `+99897${randomInt(10_000_000).toString().padStart(7, "0")}`;
  const [user] = await getDatabase().insert(users).values({ role, fullName: `Course Test ${role}`, phone, passwordHash: await argon2.hash(randomUUID()), mustChangePassword: false }).returning({ id: users.id });
  ids.push(user.id);
  return { id: user.id, cookie: `${SESSION_COOKIE}=${await signSession(user.id, 1)}` };
}

async function main() {
  await fetch(`${base}/login`);
  const owner = await testUser("super_admin");
  const admin = await testUser("admin");
  const student = await testUser("student");
  const otherStudent = await testUser("student");

  assert.equal((await request("/api/admin/courses", "POST", undefined, { title: "Forbidden" })).status, 401);
  assert.equal((await request("/api/admin/courses", "POST", admin.cookie, { title: "Forbidden" })).status, 403);
  const created = await request("/api/admin/courses", "POST", owner.cookie, { title: "Test English A1", description: "Temporary course", level: "A1" });
  assert.equal(created.status, 201, "super admin creates course");
  const first = (await created.json()).course;
  courseIds.push(first.id);
  const secondResponse = await request("/api/admin/courses", "POST", owner.cookie, { title: "Test English A2", level: "A2" });
  assert.equal(secondResponse.status, 201);
  const second = (await secondResponse.json()).course;
  courseIds.push(second.id);
  assert.equal((await request(`/api/admin/courses/${second.id}/move`, "POST", owner.cookie, { direction: "up" })).status, 200, "course order changes");
  const ordered = await getDatabase().select({ id: courses.id }).from(courses).where(inArray(courses.id, courseIds)).orderBy(courses.order);
  assert.equal(ordered[0].id, second.id);

  const moduleOne = await request(`/api/admin/courses/${first.id}/modules`, "POST", owner.cookie, { title: "Module One" });
  assert.equal(moduleOne.status, 201, "module created");
  const m1 = (await moduleOne.json()).module;
  const moduleTwo = await request(`/api/admin/courses/${first.id}/modules`, "POST", owner.cookie, { title: "Module Two" });
  assert.equal(moduleTwo.status, 201);
  const m2 = (await moduleTwo.json()).module;
  assert.equal((await request(`/api/admin/modules/${m2.id}/move`, "POST", owner.cookie, { direction: "up" })).status, 200, "module order changes");
  assert.equal((await request(`/api/admin/modules/${m1.id}`, "PATCH", owner.cookie, { title: "Module Renamed" })).status, 200);
  assert.equal((await request(`/api/admin/modules/${m1.id}`, "PATCH", admin.cookie, { title: "Forbidden" })).status, 403);

  const published = await request(`/api/admin/courses/${first.id}`, "PATCH", owner.cookie, { title: "Test English A1", description: "Temporary course", level: "A1", isPublished: true });
  assert.equal(published.status, 200, "course published");
  assert.equal((await request(`/learn/${first.id}`, "GET", student.cookie)).status, 404, "no access via URL");
  assert.equal((await request(`/learn/${first.id}`, "GET", otherStudent.cookie)).status, 404, "other student no access");

  const expiresOn = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const granted = await request(`/api/admin/students/${student.id}/access`, "PUT", admin.cookie, { courseId: first.id, expiresOn });
  assert.equal(granted.status, 200, "admin grants access");
  assert.equal((await request(`/learn/${first.id}`, "GET", student.cookie)).status, 200, "granted student can open course");
  assert.equal((await request(`/learn/${first.id}`, "GET", otherStudent.cookie)).status, 404, "access is per student");

  const yesterday = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  assert.equal((await request(`/api/admin/students/${student.id}/access`, "PUT", admin.cookie, { courseId: first.id, expiresOn: yesterday })).status, 200);
  assert.equal((await request(`/learn/${first.id}`, "GET", student.cookie)).status, 404, "expired access denied");
  assert.equal((await request(`/api/admin/students/${student.id}/access`, "PUT", admin.cookie, { courseId: first.id, expiresOn: null })).status, 200);
  assert.equal((await request(`/learn/${first.id}`, "GET", student.cookie)).status, 200, "access reactivated");
  assert.equal((await request(`/api/admin/students/${student.id}/access/${first.id}`, "DELETE", admin.cookie)).status, 200);
  assert.equal((await request(`/learn/${first.id}`, "GET", student.cookie)).status, 404, "revoked access denied");

  const actions = await getDatabase().select({ action: auditLog.action }).from(auditLog).where(and(inArray(auditLog.actorId, [owner.id, admin.id]), inArray(auditLog.targetId, courseIds)));
  assert.ok(actions.some((row) => row.action === "course.created"));
  assert.ok(actions.some((row) => row.action === "access.granted"));
  assert.ok(actions.some((row) => row.action === "access.revoked"));

  assert.equal((await request(`/api/admin/modules/${m1.id}`, "DELETE", owner.cookie)).status, 200);
  assert.equal((await request(`/api/admin/modules/${m2.id}`, "DELETE", owner.cookie)).status, 200);
  assert.equal((await request(`/api/admin/courses/${second.id}`, "DELETE", owner.cookie)).status, 200);
  assert.equal((await request(`/api/admin/courses/${first.id}`, "DELETE", owner.cookie)).status, 200);
  console.log("Courses flow: roles, CRUD, order, grant, expiry, revoke, URL denial, audit OK");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (ids.length) await getDatabase().delete(auditLog).where(inArray(auditLog.actorId, ids));
  if (courseIds.length) await getDatabase().delete(courses).where(inArray(courses.id, courseIds));
  if (ids.length) await getDatabase().delete(users).where(inArray(users.id, ids));
  await getSqlClient().end();
});
