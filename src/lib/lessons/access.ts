import { and, asc, eq, or } from "drizzle-orm";

import { getDatabase } from "@/db";
import { courses, enrollments, lessonProgress, lessons, modules } from "@/db/schema";
import { activeCourseAccess } from "@/lib/courses/access";
import { lessonSequence } from "./sequence";
import { courseExamContext } from "@/lib/exams/access";
import type { Reader } from "@/lib/exams/db";

export async function courseLessonSequence(studentId: string, courseId: string, db: Reader = getDatabase()) {
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
  const sequence = lessonSequence(ordered.filter(lesson => lesson.code !== "INTRO"), Boolean(intro?.learnDoneAt));
  const [course] = await db.select({ policy: courses.examPolicy }).from(courses).where(eq(courses.id, courseId));
  if (!course || course.policy === "disabled") return { intro, lessons: sequence.map(l => ({ ...l, reviewOnly: false })) };
  const ctx = await courseExamContext(studentId, courseId, db);
  const allowed = new Map<string, boolean>();
  let previousPassed = true;
  for (const m of ctx.sections) {
    allowed.set(m.id, previousPassed);
    previousPassed = previousPassed && ctx.exams.some(e => e.moduleId === m.id && ctx.passed.has(e.id));
  }
  return { intro, lessons: sequence.map(l => {
    const gate = allowed.get(l.moduleId) === true;
    return { ...l, unlocked: l.unlocked && (gate || l.completed), reviewOnly: l.completed && !gate };
  }) };
}

export async function lessonAccess(studentId: string, lessonId: string, db: Reader = getDatabase()) {
  const [lesson] = await db.select({ id: lessons.id, code: lessons.code, title: lessons.title, courseId: modules.courseId, courseTitle: courses.title }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).innerJoin(courses, eq(modules.courseId, courses.id)).where(and(eq(lessons.id, lessonId), eq(lessons.status, "published"), or(eq(courses.isPublished, true), eq(lessons.code, "INTRO")))).limit(1);
  if (!lesson?.code) return null;
  if (lesson.code === "INTRO") return { ...lesson, code: lesson.code, unlocked: true, reviewOnly: false };
  const [access] = await db.select({ id: enrollments.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(studentId), eq(courses.id, lesson.courseId))).limit(1);
  if (!access) return null;
  const sequence = await courseLessonSequence(studentId, lesson.courseId, db);
  const item = sequence.lessons.find(item => item.id === lesson.id);
  return { ...lesson, code: lesson.code, unlocked: !!item?.unlocked, reviewOnly: !!item?.reviewOnly };
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
  const [course] = await db.select({ policy: courses.examPolicy }).from(courses).where(eq(courses.id, current.courseId));
  if (course && course.policy !== "disabled" && /^M[1-4]L08$/.test(current.code)) {
    const ctx = await courseExamContext(studentId, current.courseId, db);
    const moduleId = ctx.lessons.find(l => l.id === current.id)?.moduleId;
    const pk = ctx.exams.find(e => e.kind === "pk" && e.moduleId === moduleId);
    if (pk && !ctx.passed.has(pk.id)) return `/learn/exams/${pk.id}`;
    if (!next) { const ik = ctx.exams.find(e => e.kind === "ik"); return ik ? `/learn/exams/${ik.id}` : null; }
  }
  return next?.status === "published" ? `/learn/${current.courseId}/${next.id}` : null;
}
