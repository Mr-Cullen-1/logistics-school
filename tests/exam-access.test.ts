import assert from "node:assert/strict";
import { test } from "node:test";
import { examEligibility } from "../src/lib/exams/policy";

test("PK requires all lesson/practice completions and previous PK passes", () => {
  const base = { policy: "enabled" as const, hasAccess: true, prerequisitesDone: true, passed: false, active: false, used: 0, grants: 0, kind: "pk" as const };
  assert.equal(examEligibility(base).canStart, true);
  assert.equal(examEligibility({ ...base, prerequisitesDone: false }).canStart, false);
  assert.equal(examEligibility({ ...base, hasAccess: false }).canStart, false);
  assert.equal(examEligibility({ ...base, policy: "paused" }).canStart, false);
  assert.equal(examEligibility({ ...base, active: true, policy: "paused", used: 1 }).canResume, true);
});
test("attempt budgets are independent of version; only IK accepts extra grants", () => {
  const base = { policy: "enabled" as const, hasAccess: true, prerequisitesDone: true, passed: false, active: false, used: 2, grants: 0, kind: "ik" as const };
  assert.equal(examEligibility(base).state, "awaiting_admin");
  assert.equal(examEligibility({ ...base, grants: 1 }).canStart, true);
  assert.equal(examEligibility({ ...base, kind: "pk", grants: 9 }).canStart, false);
  assert.equal(examEligibility({ ...base, grants: 1, passed: true }).canStart, false);
});
