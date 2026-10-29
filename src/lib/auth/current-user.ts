import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { SESSION_COOKIE, verifySession } from "./session";

export async function currentUser(token?: string) {
  const raw = token ?? (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySession(raw);
  if (!session) return null;
  const [user] = await getDatabase().select({
    id: users.id,
    role: users.role,
    phone: users.phone,
    fullName: users.fullName,
    mustChangePassword: users.mustChangePassword,
    isActive: users.isActive,
    sessionVersion: users.sessionVersion,
  }).from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user?.isActive || user.sessionVersion !== session.version) return null;
  return user;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireReadyUser() {
  const user = await requireUser();
  if (user.mustChangePassword) redirect("/change-password");
  return user;
}

export function destinationFor(user: { role: string; mustChangePassword: boolean }) {
  return user.mustChangePassword ? "/change-password" : user.role === "student" ? "/learn" : "/admin";
}
