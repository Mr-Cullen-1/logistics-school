import { and, asc, eq, or } from "drizzle-orm";

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

export async function nextAccessibleLesson(studentId: string, current: { id: string; code: string; courseId: string }) {
  const db = getDatabase();
  if (current.code === "INTRO") {
    const available = await db.select({ id: lessons.id, code: lessons.code, courseId: courses.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).innerJoin(modules, eq(modules.courseId, courses.id)).innerJoin(lessons, eq(lessons.moduleId, modules.id)).where(and(activeCourseAccess(studentId), eq(lessons.status, "published"))).orderBy(asc(courses.order), asc(courses.id), asc(modules.order), asc(modules.id), asc(lessons.order), asc(lessons.id));
    const first = available.find((lesson) => lesson.code !== "INTRO");
    return first ? `/learn/${first.courseId}/${first.id}` : null;
  }
  const [access] = await db.select({ id: enrollments.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(studentId), eq(courses.id, current.courseId))).limit(1);
  if (!access) return null;
  const ordered = await db.select({ id: lessons.id, code: lessons.code }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(and(eq(modules.courseId, current.courseId), eq(lessons.status, "published"))).orderBy(asc(modules.order), asc(modules.id), asc(lessons.order), asc(lessons.id));
  const regular = ordered.filter((lesson) => lesson.code !== "INTRO");
  const currentIndex = regular.findIndex((lesson) => lesson.id === current.id);
  const next = currentIndex >= 0 ? regular[currentIndex + 1] : null;
  return next ? `/learn/${current.courseId}/${next.id}` : null;
}
