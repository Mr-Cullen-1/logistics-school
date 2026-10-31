import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { studentProfiles } from "@/db/schema";
import { currentUser } from "@/lib/auth/current-user";
import { sameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE } from "@/lib/auth/session";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("locale"), locale: z.enum(["uz", "ru", "en"]) }),
  z.object({ action: z.literal("goal"), goalTitle: z.string().trim().max(160), goalDate: z.string().nullable() }),
]);

function validDate(value: string | null) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
  if (!user || user.role !== "student" || user.mustChangePassword) return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ma’lumot noto‘g‘ri" }, { status: 400 });

  const values = parsed.data.action === "locale"
    ? { locale: parsed.data.locale }
    : { goalTitle: parsed.data.goalTitle || null, goalDate: parsed.data.goalTitle ? parsed.data.goalDate : null };
  if (parsed.data.action === "goal" && !validDate(parsed.data.goalDate)) return NextResponse.json({ error: "Sana noto‘g‘ri" }, { status: 400 });

  await getDatabase().insert(studentProfiles).values({ studentId: user.id, ...values }).onConflictDoUpdate({ target: studentProfiles.studentId, set: values });
  return NextResponse.json({ ok: true });
}
