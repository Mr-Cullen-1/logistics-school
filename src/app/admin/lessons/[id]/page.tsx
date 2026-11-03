import { and, asc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { LessonManager } from "@/components/admin/lesson-manager";
import { getDatabase } from "@/db";
import { auditLog, lessonFiles, lessons, modules } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function AdminLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const db = getDatabase();
  const [lesson] = await db.select({ id: lessons.id, code: lessons.code, title: lessons.title, status: lessons.status, courseId: modules.courseId }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(eq(lessons.id, id)).limit(1);
  if (!lesson) notFound();
  const files = await db.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, mechanic: lessonFiles.mechanic, version: lessonFiles.version, status: lessonFiles.status, isCurrent: lessonFiles.isCurrent, sizeBytes: lessonFiles.sizeBytes }).from(lessonFiles).where(eq(lessonFiles.lessonId, id)).orderBy(asc(lessonFiles.seq), asc(lessonFiles.version));
  const previewRows = files.length ? await db.select({ targetId: auditLog.targetId }).from(auditLog).where(and(eq(auditLog.action, "lesson.file_previewed"), inArray(auditLog.targetId, files.map((file) => file.id)))) : [];
  const verified = new Set(previewRows.map((row) => row.targetId));
  return <div className="w-full px-4 py-7 sm:px-8"><Link className="inline-flex min-h-10 items-center rounded-lg border border-gold/50 px-3 text-sm text-gold transition-colors hover:bg-gold/10" href={lesson.code === "INTRO" ? "/admin/intro" : `/admin/courses/${lesson.courseId}`}>← {lesson.code === "INTRO" ? "Introga qaytish" : "Kursga qaytish"}</Link><LessonManager lesson={lesson} files={files.map((file) => ({ ...file, previewed: verified.has(file.id) }))} canEdit={user.role === "super_admin"} /></div>;
}
