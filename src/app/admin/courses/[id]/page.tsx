import { asc, eq, inArray, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ModuleManager } from "@/components/admin/module-manager";
import { ExamManager } from "@/components/admin/exam-manager";
import { courseExamAdmin } from "@/lib/exams/admin";
import { getDatabase } from "@/db";
import { courses, lessons, modules } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function AdminCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [course] = await getDatabase().select({ id: courses.id, title: courses.title, description: courses.description, level: courses.level, isPublished: courses.isPublished }).from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();
  const sections = await getDatabase().select({ id: modules.id, title: modules.title, order: modules.order }).from(modules).where(eq(modules.courseId, id)).orderBy(asc(modules.order), asc(modules.id));
  const lessonRows = sections.length ? await getDatabase().select({ id: lessons.id, moduleId: lessons.moduleId, code: lessons.code, title: lessons.title, status: lessons.status }).from(lessons).where(inArray(lessons.moduleId, sections.map((section) => section.id))).orderBy(sql`case when ${lessons.code} = 'INTRO' then 0 else 1 end`, asc(lessons.code), asc(lessons.id)) : [];
  const [settings] = await getDatabase().select({policy:courses.examPolicy}).from(courses).where(eq(courses.id,id));
  const examRows = user.role === "super_admin" ? await courseExamAdmin(id) : [];
  return <><ModuleManager course={course} modules={sections} lessons={lessonRows} canEdit={user.role === "super_admin" && settings.policy === "disabled"} />{user.role === "super_admin" && <ExamManager courseId={id} policy={settings.policy} modules={sections.filter(m=>lessonRows.some(l=>l.moduleId===m.id&&l.code!=="INTRO"))} exams={examRows}/>}</>;
}
