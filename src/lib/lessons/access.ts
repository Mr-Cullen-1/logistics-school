import { and, asc, eq, or } from "drizzle-orm";

import { getDatabase } from "@/db";
import { courses, enrollments, lessonProgress, lessons, modules } from "@/db/schema";
import { activeCourseAccess } from "@/lib/courses/access";
import { lessonSequence } from "./sequence";

export async function courseLessonSequence(studentId: string, courseId: string) {
  const db = getDatabase();
  const [intros, ordered] = await Promise.all([
    db.select({ id: lessons.id, title: lessons.title, courseId: modules.courseId, learnDoneAt: lessonProgress.learnDoneAt })
      .from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id))
      .leftJoin(lessonProgress, and(eq(lessonProgress.lessonId, lessons.id), eq(lessonProgress.studentId, studentId)))
      .where(and(eq(lessons.code, "INTRO"), eq(lessons.status, "published"))).orderBy(asc(lessons.id)).limit(1),
    db.select({ id: lessons.id, code: lessons.code, title: lessons.title, moduleId: lessons.moduleId, status: lessons.status, learnDoneAt: lessonProgress.learnDoneAt, practiceDoneAt: lessonProgress.practiceDoneAt })
      .from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id))
      .leftJoin(lessonProgress, and(eq(lessonProgress.lessonId, lessons.id), eq(lessonProgress.studentId, studentId)))
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.order), asc(modules.id), asc(lessons.code), asc(lessons.id)),
  ]);
  const intro = intros[0];
  return { intro, lessons: lessonSequence(ordered.filter(lesson => lesson.code !== "INTRO"), Boolean(intro?.learnDoneAt)) };
}

export async function lessonAccess(studentId: string, lessonId: string) {
  const db = getDatabase();
  const [lesson] = await db.select({ id: lessons.id, code: lessons.code, title: lessons.title, courseId: modules.courseId, courseTitle: courses.title }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).innerJoin(courses, eq(modules.courseId, courses.id)).where(and(eq(lessons.id, lessonId), eq(lessons.status, "published"), or(eq(courses.isPublished, true), eq(lessons.code, "INTRO")))).limit(1);
  if (!lesson?.code) return null;
  if (lesson.code === "INTRO") return { ...lesson, code: lesson.code, unlocked: true };
  const [access] = await db.select({ id: enrollments.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(studentId), eq(courses.id, lesson.courseId))).limit(1);
  if (!access) return null;
  const sequence = await courseLessonSequence(studentId, lesson.courseId);
  return { ...lesson, code: lesson.code, unlocked: sequence.lessons.some(item => item.id === lesson.id && item.unlocked) };
}

export async function accessibleLesson(studentId: string, lessonId: string) {
  const lesson = await lessonAccess(studentId, lessonId);
  return lesson?.unlocked ? lesson : null;
}

export async function nextAccessibleLesson(studentId: string, current: { id: string; code: string; courseId: string }) {
  const db = getDatabase();
  if (current.code === "INTRO") {
    const available = await db.select({ id: lessons.id, code: lessons.code, status: lessons.status, courseId: courses.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).innerJoin(modules, eq(modules.courseId, courses.id)).innerJoin(lessons, eq(lessons.moduleId, modules.id)).where(activeCourseAccess(studentId)).orderBy(asc(courses.order), asc(courses.id), asc(modules.order), asc(modules.id), asc(lessons.code), asc(lessons.id));
    const first = available.find((lesson) => lesson.code !== "INTRO");
    return first?.status === "published" ? `/learn/${first.courseId}/${first.id}` : null;
  }
  const [access] = await db.select({ id: enrollments.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(studentId), eq(courses.id, current.courseId))).limit(1);
  if (!access) return null;
  const ordered = await db.select({ id: lessons.id, code: lessons.code, status: lessons.status }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(eq(modules.courseId, current.courseId)).orderBy(asc(modules.order), asc(modules.id), asc(lessons.code), asc(lessons.id));
  const regular = ordered.filter((lesson) => lesson.code !== "INTRO");
  const currentIndex = regular.findIndex((lesson) => lesson.id === current.id);
  const next = currentIndex >= 0 ? regular[currentIndex + 1] : null;
  return next?.status === "published" ? `/learn/${current.courseId}/${next.id}` : null;
}
