import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";

import { config } from "dotenv";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

import { getDatabase, getSqlClient } from "../src/db";
import { auditLog, loginAttempts, users } from "../src/db/schema";
import { signSession, SESSION_COOKIE } from "../src/lib/auth/session";

config({ quiet: true });

const base = process.env.AUTH_BASE_URL || "http://localhost:3137";
const ip = `student-test-${randomUUID()}`;
let adminId: string | undefined;
let studentId: string | undefined;
let studentPhone: string | undefined;

async function request(path: string, method: string, cookie?: string, body?: object) {
  return fetch(`${base}${path}`, {
    method,
    redirect: "manual",
    headers: { Origin: base, "x-real-ip": ip, ...(cookie ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function freePhone(prefix: string) {
  let phone: string;
  do {
    phone = `+998${prefix}${randomInt(10_000_000).toString().padStart(7, "0")}`;
  } while ((await getDatabase().select({ id: users.id }).from(users).where(eq(users.phone, phone))).length);
  return phone;
}

async function main() {
  await fetch(`${base}/login`);
  const adminPhone = await freePhone("97");
  studentPhone = await freePhone("98");
  const [admin] = await getDatabase().insert(users).values({ role: "admin", fullName: "Temporary Test Admin", phone: adminPhone, passwordHash: await argon2.hash(randomUUID()), mustChangePassword: false }).returning({ id: users.id });
  adminId = admin.id;
  const adminCookie = `${SESSION_COOKIE}=${await signSession(admin.id, 1)}`;

  const unauthenticated = await request("/api/admin/students", "POST", undefined, { fullName: "Test", phone: studentPhone });
  assert.equal(unauthenticated.status, 401, "anonymous create denied");

  const created = await request("/api/admin/students", "POST", adminCookie, { fullName: "Temporary Test Student", phone: studentPhone });
  assert.equal(created.status, 201, "admin creates student");
  const creation = await created.json();
  studentId = creation.student.id;
  assert.match(creation.pin, /^\d{6}$/);
  const duplicate = await request("/api/admin/students", "POST", adminCookie, { fullName: "Duplicate", phone: studentPhone });
  assert.equal(duplicate.status, 409, "duplicate phone rejected");

  const login = await request("/api/auth/login", "POST", undefined, { phone: studentPhone, password: creation.pin });
  assert.equal(login.status, 200, "student logs in with PIN");
  assert.equal((await login.json()).next, "/change-password");
  const studentCookie = login.headers.get("set-cookie")?.split(";")[0];
  assert.ok(studentCookie);
  const studentMutation = await request("/api/admin/students", "POST", studentCookie, { fullName: "Forbidden", phone: await freePhone("99") });
  assert.equal(studentMutation.status, 403, "student cannot create student");
  const resetAdmin = await request(`/api/admin/students/${adminId}/reset-pin`, "POST", adminCookie);
  assert.equal(resetAdmin.status, 404, "student endpoint cannot reset admin PIN");

  const directory = await request("/admin/students?search=Temporary%20Test%20Student", "GET", adminCookie);
  assert.equal(directory.status, 200, "admin directory loads");
  assert.match(await directory.text(), /Temporary Test Student/);

  const blocked = await request(`/api/admin/students/${studentId}/status`, "PATCH", adminCookie, { isActive: false });
  assert.equal(blocked.status, 200, "admin blocks student");
  const revoked = await request("/change-password", "GET", studentCookie);
  assert.match(revoked.headers.get("location") || "", /\/login$/, "blocked session revoked");
  const blockedLogin = await request("/api/auth/login", "POST", undefined, { phone: studentPhone, password: creation.pin });
  assert.equal(blockedLogin.status, 401, "blocked student cannot login");

  const unblocked = await request(`/api/admin/students/${studentId}/status`, "PATCH", adminCookie, { isActive: true });
  assert.equal(unblocked.status, 200, "admin unblocks student");
  const reset = await request(`/api/admin/students/${studentId}/reset-pin`, "POST", adminCookie);
  assert.equal(reset.status, 200, "admin resets PIN");
  const resetBody = await reset.json();
  assert.match(resetBody.pin, /^\d{6}$/);
  const oldPin = await request("/api/auth/login", "POST", undefined, { phone: studentPhone, password: creation.pin });
  assert.equal(oldPin.status, 401, "old PIN rejected");
  const newPin = await request("/api/auth/login", "POST", undefined, { phone: studentPhone, password: resetBody.pin });
  assert.equal(newPin.status, 200, "new PIN accepted");

  assert.ok(studentId);
  const audit = await getDatabase().select({ action: auditLog.action }).from(auditLog).where(eq(auditLog.targetId, studentId));
  assert.deepEqual(new Set(audit.map((item) => item.action)), new Set(["student.created", "student.blocked", "student.unblocked", "student.pin_reset"]));
  console.log("Student admin flow: create, search, login, role, block, reset, audit OK");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (!studentId && studentPhone) {
    const [leftover] = await getDatabase().select({ id: users.id }).from(users).where(eq(users.phone, studentPhone)).limit(1);
    studentId = leftover?.id;
  }
  if (studentId) await getDatabase().delete(auditLog).where(eq(auditLog.targetId, studentId));
  if (studentId) await getDatabase().delete(users).where(eq(users.id, studentId));
  if (adminId) await getDatabase().delete(users).where(eq(users.id, adminId));
  if (studentPhone) await getDatabase().delete(loginAttempts).where(or(eq(loginAttempts.phone, studentPhone), eq(loginAttempts.ip, ip)));
  await getSqlClient().end();
});
