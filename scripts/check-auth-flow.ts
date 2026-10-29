import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";

import { config } from "dotenv";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

import { getDatabase, getSqlClient } from "../src/db";
import { loginAttempts, users } from "../src/db/schema";
import { generatePin } from "../src/lib/auth/pin";

config({ quiet: true });

const base = process.env.AUTH_BASE_URL || "http://localhost:3137";
const ip = `test-${randomUUID()}`;
let userId: string | undefined;
let phone: string | undefined;
let blockedPhone: string | undefined;

async function post(path: string, data: object, cookie?: string) {
  return fetch(`${base}${path}`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/json", Origin: base, "x-real-ip": ip, ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(data),
  });
}

async function main() {
  await fetch(`${base}/login`);
  let candidate: string;
  do {
    candidate = `+99899${randomInt(10_000_000).toString().padStart(7, "0")}`;
  } while ((await getDatabase().select({ id: users.id }).from(users).where(eq(users.phone, candidate))).length);
  phone = candidate;
  blockedPhone = `+99898${randomInt(10_000_000).toString().padStart(7, "0")}`;
  const pin = generatePin();
  const [created] = await getDatabase().insert(users).values({ phone, fullName: "Auth Test", passwordHash: await argon2.hash(pin) }).returning({ id: users.id });
  userId = created.id;

  const initial = await post("/api/auth/login", { phone, password: pin });
  assert.equal(initial.status, 200, "PIN login");
  assert.equal((await initial.json()).next, "/change-password");
  const oldCookie = initial.headers.get("set-cookie")?.split(";")[0];
  assert.ok(oldCookie);
  const forced = await fetch(`${base}/learn`, { headers: { Cookie: oldCookie }, redirect: "manual" });
  assert.equal(forced.headers.get("location"), "/change-password", "forced change");

  const newPassword = `TestPassword-${randomUUID()}`;
  const changed = await post("/api/auth/change-password", { password: newPassword, confirmation: newPassword }, oldCookie);
  assert.equal(changed.status, 200, "password change");
  assert.equal((await changed.json()).next, "/learn");
  const newCookie = changed.headers.get("set-cookie")?.split(";")[0];
  assert.ok(newCookie);
  const oldSession = await fetch(`${base}/learn`, { headers: { Cookie: oldCookie }, redirect: "manual" });
  assert.equal(oldSession.headers.get("location"), "/login", "old session revoked");
  const wrongRole = await fetch(`${base}/admin`, { headers: { Cookie: newCookie }, redirect: "manual" });
  assert.equal(wrongRole.headers.get("location"), "/learn", "student cannot enter admin");
  const signedIn = await post("/api/auth/login", { phone, password: newPassword });
  assert.equal(signedIn.status, 200, "new password login");
  await getDatabase().update(users).set({ isActive: false }).where(eq(users.id, userId));
  const disabled = await fetch(`${base}/learn`, { headers: { Cookie: newCookie }, redirect: "manual" });
  assert.equal(disabled.headers.get("location"), "/login", "disabled user logged out");

  for (let i = 0; i < 5; i++) {
    const wrong = await post("/api/auth/login", { phone: blockedPhone, password: "wrong" });
    assert.equal(wrong.status, 401);
  }
  const blocked = await post("/api/auth/login", { phone: blockedPhone, password: "wrong" });
  assert.equal(blocked.status, 429, "5 failures block login");
  console.log("Auth flow: PIN, majburiy almashtirish, sessiya/rol/blok/rate limit OK");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (userId) await getDatabase().delete(users).where(eq(users.id, userId));
  if (phone && blockedPhone) await getDatabase().delete(loginAttempts).where(or(eq(loginAttempts.phone, phone), eq(loginAttempts.phone, blockedPhone), eq(loginAttempts.ip, ip)));
  await getSqlClient().end();
});
