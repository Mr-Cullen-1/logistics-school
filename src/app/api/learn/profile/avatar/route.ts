import { NextRequest, NextResponse } from "next/server";

import { getDatabase } from "@/db";
import { studentProfiles } from "@/db/schema";
import { currentUser } from "@/lib/auth/current-user";
import { sameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE } from "@/lib/auth/session";

const maxBytes = 120_000;

export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
    const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
    if (!user || user.role !== "student" || user.mustChangePassword) return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 401 });
    if (Number(request.headers.get("content-length")) > 160_000) return NextResponse.json({ error: "Rasm hajmi katta" }, { status: 413 });
    const form = await request.formData().catch(() => null);
    const file = form?.get("avatar");
    if (!(file instanceof File) || file.type !== "image/jpeg" || file.size > maxBytes || file.size < 100) return NextResponse.json({ error: "JPG rasm kerak (120 KB gacha)" }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return NextResponse.json({ error: "Rasm formati noto‘g‘ri" }, { status: 400 });
    const avatarData = `data:image/jpeg;base64,${bytes.toString("base64")}`;
    await getDatabase().insert(studentProfiles).values({ studentId: user.id, avatarData }).onConflictDoUpdate({ target: studentProfiles.studentId, set: { avatarData } });
    return NextResponse.json({ ok: true, avatarData });
  } catch (error) {
    console.error("Avatar upload error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Rasmni saqlab bo‘lmadi" }, { status: 500 });
  }
}
