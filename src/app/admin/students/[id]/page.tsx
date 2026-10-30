import { and, asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { AccessManager } from "@/components/admin/access-manager";
import { getDatabase } from "@/db";
import { courses, enrollments, users } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function StudentAccessPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [student] = await getDatabase().select({ id: users.id, fullName: users.fullName, phone: users.phone }).from(users).where(and(eq(users.id, id), eq(users.role, "student"))).limit(1);
  if (!student) notFound();
  const [allCourses, grants] = await Promise.all([
    getDatabase().select({ id: courses.id, title: courses.title, isPublished: courses.isPublished }).from(courses).orderBy(asc(courses.order), asc(courses.id)),
    getDatabase().select({ courseId: enrollments.courseId, title: courses.title, isPublished: courses.isPublished, isActive: enrollments.isActive, expiresAt: enrollments.expiresAt }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(eq(enrollments.studentId, id)).orderBy(asc(courses.order), asc(courses.id)),
  ]);
  const access = grants.map((row) => ({ ...row, expiresAt: row.expiresAt?.toISOString() ?? null }));
  return <AccessManager student={student} courses={allCourses} grants={access} asOf={new Date().toISOString()} />;
}
