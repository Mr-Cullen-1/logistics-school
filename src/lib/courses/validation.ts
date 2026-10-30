import { z } from "zod";

export const courseInput = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().default(""),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]).nullable().optional().default(null),
});

export const courseEditInput = courseInput.extend({ isPublished: z.boolean() });
export const moduleInput = z.object({ title: z.string().trim().min(2).max(120) });
export const moveInput = z.object({ direction: z.enum(["up", "down"]) });

export function expirationAt(expiresOn: string | null): Date | null | undefined {
  if (expiresOn === null) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expiresOn)) return undefined;
  const [year, month, day] = expiresOn.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 18, 59, 59, 999));
  const validDay = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) === expiresOn;
  return validDay ? date : undefined;
}
