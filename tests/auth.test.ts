import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizePhone } from "../src/lib/auth/phone";
import { passwordProblem } from "../src/lib/auth/password-policy";
import { generatePin } from "../src/lib/auth/pin";

test("telefon raqami yagona +998 formatga keladi", () => {
  assert.equal(normalizePhone("90 123 45 67"), "+998901234567");
  assert.equal(normalizePhone("+998 (90) 123-45-67"), "+998901234567");
  assert.equal(normalizePhone("998901234567"), "+998901234567");
  assert.equal(normalizePhone("123456789"), null);
  assert.equal(normalizePhone("+99890123456a"), null);
});

test("PIN 6 xonali bo'ladi", () => {
  for (let i = 0; i < 50; i++) assert.match(generatePin(), /^\d{6}$/);
});

test("parol siyosati qisqa, PIN va telefon raqamini rad etadi", () => {
  assert.ok(passwordProblem("short", "+998901234567", "123456"));
  assert.ok(passwordProblem("123456", "+998901234567", "123456"));
  assert.ok(passwordProblem("+998901234567", "+998901234567", "123456"));
  assert.equal(passwordProblem("MyNewPass2026!", "+998901234567", "123456"), null);
});
