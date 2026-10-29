import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, users } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";
import { generatePin } from "@/lib/auth/pin";
import { normalizePhone } from "@/lib/auth/phone";
import { sameOrigin } from "@/lib/auth/request";

const input = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().max(40),
});

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await adminAccess(request);
  if (access.error) return access.error;

  const parsed = input.safeParse(await request.json().catch(() => null));
  const phone = parsed.success ? normalizePhone(parsed.data.phone) : null;
  if (!parsed.success || !phone) {
    return NextResponse.json({ error: "Ism va +998 telefon raqamini tekshiring" }, { status: 400 });
  }

  const pin = generatePin();
  const passwordHash = await argon2.hash(pin);
  const student = await getDatabase().transaction(async (tx) => {
    const [created] = await tx.insert(users).values({
      role: "student",
      fullName: parsed.data.fullName,
      phone,
      passwordHash,
      mustChangePassword: true,
    }).onConflictDoNothing({ target: users.phone }).returning({
      id: users.id,
      fullName: users.fullName,
      phone: users.phone,
    });
    if (!created) return null;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "student.created", targetType: "user", targetId: created.id });
    return created;
  });
  if (!student) return NextResponse.json({ error: "Bu telefon raqami allaqachon mavjud" }, { status: 409 });
  return NextResponse.json({ student, pin }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
