export function examEligibility(input: { policy: "disabled" | "enabled" | "paused"; hasAccess: boolean; prerequisitesDone: boolean; passed: boolean; active: boolean; used: number; grants: number; kind: "pk" | "ik" }) {
  const remaining = Math.max(0, 2 + (input.kind === "ik" ? input.grants : 0) - input.used);
  const state = !input.hasAccess ? "no_access" : input.policy === "disabled" ? "disabled" : input.passed ? "passed" : !input.prerequisitesDone ? "locked" : input.active ? "in_progress" : input.policy === "paused" ? "paused" : remaining > 0 ? "ready" : input.kind === "ik" ? "awaiting_admin" : "exhausted";
  return { state, remaining, canStart: state === "ready", canResume: state === "in_progress" } as const;
}
