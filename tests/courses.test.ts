import assert from "node:assert/strict";
import { test } from "node:test";

import { expirationAt } from "../src/lib/courses/validation";

test("dostup muddati Toshkent kunining oxirida tugaydi", () => {
  assert.equal(expirationAt("2026-10-30")?.toISOString(), "2026-10-30T18:59:59.999Z");
  assert.equal(expirationAt("2028-02-29")?.toISOString(), "2028-02-29T18:59:59.999Z");
  assert.equal(expirationAt(null), null);
});

test("noto'g'ri sanalar rad etiladi", () => {
  assert.equal(expirationAt("2026-02-29"), undefined);
  assert.equal(expirationAt("2026-13-01"), undefined);
  assert.equal(expirationAt("30-10-2026"), undefined);
});
