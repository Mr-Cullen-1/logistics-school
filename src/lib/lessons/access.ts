import { and, eq, or } from "drizzle-orm";

import { getDatabase } from "@/db";
import { courses, enrollments, lessons, modules } from "@/db/schema";
import { activeCourseAccess } from "@/lib/courses/access";

export async function accessibleLesson(studentId: string, lessonId: string) {
  const db = getDatabase();
  const [lesson] = await db.select({ id: lessons.id, code: lessons.code, title: lessons.title, courseId: modules.courseId, courseTitle: courses.title }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).innerJoin(courses, eq(modules.courseId, courses.id)).where(and(eq(lessons.id, lessonId), eq(lessons.status, "published"), or(eq(courses.isPublished, true), eq(lessons.code, "INTRO")))).limit(1);
  if (!lesson?.code) return null;
  if (lesson.code === "INTRO") return { ...lesson, code: lesson.code };
  const [access] = await db.select({ id: enrollments.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(studentId), eq(courses.id, lesson.courseId))).limit(1);
  return access ? { ...lesson, code: lesson.code } : null;
}
