import { asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ModuleManager } from "@/components/admin/module-manager";
import { getDatabase } from "@/db";
import { courses, modules } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function AdminCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [course] = await getDatabase().select({ id: courses.id, title: courses.title, description: courses.description, level: courses.level, isPublished: courses.isPublished }).from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();
  const sections = await getDatabase().select({ id: modules.id, title: modules.title, order: modules.order }).from(modules).where(eq(modules.courseId, id)).orderBy(asc(modules.order), asc(modules.id));
  return <ModuleManager course={course} modules={sections} canEdit={user.role === "super_admin"} />;
}
