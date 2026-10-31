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
const ip = `admin-flow-${randomUUID()}`;
let ownerId: string | undefined;
let otherAdminId: string | undefined;
let createdId: string | undefined;
let newPhone: string | undefined;

async function freePhone(prefix: string) {
  let phone: string;
  do {
    phone = `+998${prefix}${randomInt(10_000_000).toString().padStart(7, "0")}`;
  } while ((await getDatabase().select({ id: users.id }).from(users).where(eq(users.phone, phone))).length);
  return phone;
}

async function request(path: string, method: string, cookie?: string, body?: object) {
  return fetch(`${base}${path}`, {
    method,
    redirect: "manual",
    headers: { Origin: base, "x-real-ip": ip, ...(cookie ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function main() {
  await fetch(`${base}/login`);
  const [owner] = await getDatabase().insert(users).values({ role: "super_admin", fullName: "Temporary Admin Flow Owner", phone: await freePhone("97"), passwordHash: await argon2.hash(randomUUID()), mustChangePassword: false }).returning({ id: users.id });
  ownerId = owner.id;
  const [otherAdmin] = await getDatabase().insert(users).values({ role: "admin", fullName: "Temporary Existing Admin", phone: await freePhone("96"), passwordHash: await argon2.hash(randomUUID()), mustChangePassword: false }).returning({ id: users.id });
  otherAdminId = otherAdmin.id;
  const ownerCookie = `${SESSION_COOKIE}=${await signSession(owner.id, 1)}`;
  const adminCookie = `${SESSION_COOKIE}=${await signSession(otherAdmin.id, 1)}`;
  newPhone = await freePhone("95");
  const data = { fullName: "Temporary New Admin", phone: newPhone };

  assert.equal((await request("/api/admin/admins", "POST", undefined, data)).status, 401, "anonymous denied");
  assert.equal((await request("/api/admin/admins", "POST", adminCookie, data)).status, 403, "admin cannot create admin");
  assert.equal((await request("/api/admin/admins", "POST", ownerCookie, { ...data, phone: "bad" })).status, 400, "invalid phone rejected");

  const created = await request("/api/admin/admins", "POST", ownerCookie, data);
  assert.equal(created.status, 201, "super admin creates admin");
  const body = await created.json();
  const adminId: string = body.admin.id;
  createdId = adminId;
  assert.match(body.pin, /^\d{6}$/);
  const [row] = await getDatabase().select({ role: users.role, mustChangePassword: users.mustChangePassword, passwordHash: users.passwordHash }).from(users).where(eq(users.id, adminId)).limit(1);
  assert.equal(row.role, "admin");
  assert.equal(row.mustChangePassword, true);
  assert.equal(await argon2.verify(row.passwordHash, body.pin), true);
  assert.equal((await request("/api/admin/admins", "POST", ownerCookie, data)).status, 409, "duplicate phone rejected");

  const ownerPage = await request("/admin/admins", "GET", ownerCookie);
  assert.equal(ownerPage.status, 200, "super admin directory loads");
  assert.match(await ownerPage.text(), /Temporary New Admin/);
  const deniedPage = await request("/admin/admins", "GET", adminCookie);
  assert.equal(deniedPage.headers.get("location"), "/admin", "admin directory denied");

  const login = await request("/api/auth/login", "POST", undefined, { phone: newPhone, password: body.pin });
  assert.equal(login.status, 200, "PIN login succeeds");
  assert.equal((await login.json()).next, "/change-password");
  const firstCookie = login.headers.get("set-cookie")?.split(";")[0];
  assert.ok(firstCookie);
  assert.equal((await request("/admin", "GET", firstCookie)).headers.get("location"), "/change-password", "password change enforced");

  const password = `AdminPassword-${randomUUID()}`;
  const changed = await request("/api/auth/change-password", "POST", firstCookie, { password, confirmation: password });
  assert.equal(changed.status, 200, "admin changes password");
  assert.equal((await changed.json()).next, "/admin");
  const readyCookie = changed.headers.get("set-cookie")?.split(";")[0];
  assert.ok(readyCookie);
  assert.equal((await request("/admin", "GET", firstCookie)).headers.get("location"), "/login", "old session revoked");
  assert.equal((await request("/api/auth/login", "POST", undefined, { phone: newPhone, password: body.pin })).status, 401, "old PIN rejected");
  assert.equal((await request("/admin", "GET", readyCookie)).status, 200, "admin dashboard opens");
  assert.equal((await request("/api/admin/admins", "POST", readyCookie, { fullName: "Forbidden", phone: await freePhone("94") })).status, 403, "new admin cannot create another admin");

  const [audit] = await getDatabase().select({ action: auditLog.action }).from(auditLog).where(eq(auditLog.targetId, adminId)).limit(1);
  assert.equal(audit.action, "admin.created");
  console.log("Admin flow: super-admin gate, one-time PIN, mandatory password change, role, duplicate and audit OK");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (!createdId && newPhone) {
    const [leftover] = await getDatabase().select({ id: users.id }).from(users).where(eq(users.phone, newPhone)).limit(1);
    createdId = leftover?.id;
  }
  if (createdId) await getDatabase().delete(auditLog).where(eq(auditLog.targetId, createdId));
  if (createdId) await getDatabase().delete(users).where(eq(users.id, createdId));
  if (otherAdminId) await getDatabase().delete(users).where(eq(users.id, otherAdminId));
  if (ownerId) await getDatabase().delete(users).where(eq(users.id, ownerId));
  if (newPhone) await getDatabase().delete(loginAttempts).where(or(eq(loginAttempts.phone, newPhone), eq(loginAttempts.ip, ip)));
  await getSqlClient().end();
});
