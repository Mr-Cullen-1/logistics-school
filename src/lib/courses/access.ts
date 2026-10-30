import { and, eq, gt, isNull, lte, or } from "drizzle-orm";

import { courses, enrollments } from "@/db/schema";

export function activeCourseAccess(studentId: string, now = new Date()) {
  return and(
    eq(enrollments.studentId, studentId),
    eq(enrollments.isActive, true),
    lte(enrollments.startsAt, now),
    or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now)),
    eq(courses.isPublished, true),
  );
}
