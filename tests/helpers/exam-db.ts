import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../../src/db/schema";
import type { Database } from "../../src/lib/exams/db";
import { examFixture } from "./exam-fixture";

export async function examDatabase() {
  const client = new PGlite();
  const pg = drizzle(client, { schema });
  await migrate(pg, { migrationsFolder: "drizzle" });
  const db = pg as unknown as Database;
  return { client, ...await seedExamDatabase(db) };
}

// Shared by the in-memory suite and the isolated native PostgreSQL verifier.
export async function seedExamDatabase(db: Database) {
  const [student, admin] = await db.insert(schema.users).values([
    { phone: "+998900000001", fullName: "Fixture student", passwordHash: "test", mustChangePassword: false, role: "student" },
    { phone: "+998900000002", fullName: "Fixture admin", passwordHash: "test", mustChangePassword: false, role: "super_admin" },
  ]).returning();
  const [course] = await db.insert(schema.courses).values({ title: "Exam fixture", isPublished: true, examPolicy: "enabled" }).returning();
  const sections = await db.insert(schema.modules).values([1,2,3,4].map(n => ({ courseId: course.id, title: `Module ${n}`, order: n }))).returning();
  const rows = await db.insert(schema.lessons).values(sections.flatMap((m, i) => Array.from({ length: 8 }, (_, j) => ({ moduleId: m.id, code: `M${i+1}L0${j+1}`, title: "Lesson", jsxSource: "", compiledJs: "", status: "published" as const })))).returning();
  await db.insert(schema.enrollments).values({ studentId: student.id, courseId: course.id });
  await db.insert(schema.lessonProgress).values(rows.map(l => ({ studentId: student.id, lessonId: l.id, learnDoneAt: new Date(), practiceDoneAt: new Date() })));
  await db.insert(schema.practiceAttempts).values(rows.flatMap(l => Array.from({ length: 10 }, (_, i) => ({ studentId: student.id, lessonId: l.id, seq: i+1, correct: true }))));
  await db.insert(schema.progress).values(rows.map(l => ({ studentId: student.id, lessonId: l.id, completedAt: new Date() })));
  const examRows = await db.insert(schema.exams).values([...sections.map((m,i) => ({ courseId: course.id, moduleId: m.id, kind: "pk" as const, title: `PK${i+1}`, currentVersion: 1 })), { courseId: course.id, moduleId: null, kind: "ik" as const, title: "IK", currentVersion: 1 }]).returning();
  const versions = await db.insert(schema.examVersions).values(examRows.map((e,i) => {
    const def = examFixture(e.kind);
    const mapped = e.kind === "pk" ? JSON.parse(JSON.stringify(def).replaceAll("M1", `M${i+1}`)) : def;
    return { examId: e.id, version: 1, source: "fixture", sha256: "a".repeat(64), definition: mapped, status: "published" as const };
  })).returning();
  return { db, student, admin, course, sections, lessons: rows, exams: examRows, versions };
}
