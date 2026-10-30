import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { getDatabase } from "@/db";
import { auditLog, courses } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { courseInput } from "@/lib/courses/validation";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const parsed = courseInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Kurs ma'lumotlarini tekshiring" }, { status: 400 });

  const [last] = await getDatabase().select({ order: courses.order }).from(courses).orderBy(desc(courses.order)).limit(1);
  const course = await getDatabase().transaction(async (tx) => {
    const [created] = await tx.insert(courses).values({ ...parsed.data, order: (last?.order ?? 0) + 1 }).returning({ id: courses.id, title: courses.title });
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "course.created", targetType: "course", targetId: created.id });
    return created;
  });
  return NextResponse.json({ course }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
