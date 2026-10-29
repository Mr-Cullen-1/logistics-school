import { and, count, eq, gte, or } from "drizzle-orm";

import { getDatabase } from "@/db";
import { loginAttempts } from "@/db/schema";

const windowMs = 15 * 60 * 1000;
const maxFailures = 5;

export async function tooManyFailures(phone: string, ip: string) {
  const [result] = await getDatabase().select({ total: count() }).from(loginAttempts).where(and(
    eq(loginAttempts.success, false),
    gte(loginAttempts.createdAt, new Date(Date.now() - windowMs)),
    or(eq(loginAttempts.phone, phone), eq(loginAttempts.ip, ip)),
  ));
  return result.total >= maxFailures;
}

export async function recordLoginAttempt(phone: string, ip: string, success: boolean) {
  await getDatabase().insert(loginAttempts).values({ phone, ip, success });
}
