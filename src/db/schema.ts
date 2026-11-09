import {
  check,
  foreignKey,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { ExamDefinition, ExamAnswer, AttemptResult } from "../lib/exams/types";

export const userRole = pgEnum("user_role", ["super_admin", "admin", "student"]);
export const lessonStatus = pgEnum("lesson_status", ["draft", "published"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: userRole("role").notNull().default("student"),
  phone: varchar("phone", { length: 13 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  mustChangePassword: boolean("must_change_password").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  sessionVersion: integer("session_version").notNull().default(1),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const studentProfiles = pgTable("student_profiles", {
  studentId: uuid("student_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  avatarData: text("avatar_data"),
  locale: varchar("locale", { length: 2 }).notNull().default("uz"),
  goalTitle: varchar("goal_title", { length: 160 }),
  goalDate: date("goal_date"),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  level: varchar("level", { length: 2 }),
  coverUrl: text("cover_url"),
  isPublished: boolean("is_published").notNull().default(false),
  examPolicy: varchar("exam_policy", { length: 10 }).$type<"disabled" | "enabled" | "paused">().notNull().default("disabled"),
  order: integer("order").notNull().default(0),
});

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    order: integer("order").notNull().default(0),
  },
  (table) => [index("modules_course_id_idx").on(table.courseId), uniqueIndex("modules_id_course_idx").on(table.id, table.courseId)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    code: varchar("code", { length: 12 }),
    order: integer("order").notNull().default(0),
    jsxSource: text("jsx_source").notNull(),
    compiledJs: text("compiled_js").notNull(),
    version: integer("version").notNull().default(1),
    status: lessonStatus("status").notNull().default("draft"),
    durationMin: integer("duration_min"),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("lessons_module_id_idx").on(table.moduleId), uniqueIndex("lessons_module_code_idx").on(table.moduleId, table.code)],
);

export const lessonFiles = pgTable("lesson_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 8 }).notNull(),
  seq: integer("seq").notNull(),
  mechanic: varchar("mechanic", { length: 24 }),
  source: text("source").notNull(),
  compiledJs: text("compiled_js").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  sha256: varchar("sha256", { length: 64 }).notNull(),
  version: integer("version").notNull(),
  status: lessonStatus("status").notNull().default("draft"),
  isCurrent: boolean("is_current").notNull().default(false),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("lesson_files_slot_version_idx").on(table.lessonId, table.kind, table.seq, table.version),
  index("lesson_files_lesson_idx").on(table.lessonId),
]);

export const lessonProgress = pgTable("lesson_progress", {
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  learnDoneAt: timestamp("learn_done_at", { withTimezone: true }),
  learnPayload: jsonb("learn_payload"),
  practiceDoneAt: timestamp("practice_done_at", { withTimezone: true }),
}, (table) => [primaryKey({ columns: [table.studentId, table.lessonId] })]);

export const practiceAttempts = pgTable("practice_attempts", {
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  seq: integer("seq").notNull(),
  attempts: integer("attempts").notNull().default(0),
  correct: boolean("correct").notNull().default(false),
  firstTryCorrect: boolean("first_try_correct").notNull().default(false),
  durationMs: integer("duration_ms").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.studentId, table.lessonId, table.seq] })]);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    grantedBy: uuid("granted_by").references(() => users.id, { onDelete: "set null" }),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    uniqueIndex("enrollments_student_course_idx").on(table.studentId, table.courseId),
    index("enrollments_course_id_idx").on(table.courseId),
  ],
);

export const progress = pgTable(
  "progress",
  {
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastOpenedAt: timestamp("last_opened_at", { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.lessonId] })],
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: varchar("phone", { length: 13 }).notNull(),
    ip: text("ip").notNull(),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("login_attempts_phone_created_idx").on(table.phone, table.createdAt),
    index("login_attempts_ip_created_idx").on(table.ip, table.createdAt),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: uuid("target_id"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_log_actor_created_idx").on(table.actorId, table.createdAt)],
);

export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "restrict" }),
  moduleId: uuid("module_id"),
  kind: varchar("kind", { length: 2 }).$type<"pk" | "ik">().notNull(),
  title: text("title").notNull(),
  passPercent: integer("pass_percent").notNull().default(80),
  currentVersion: integer("current_version"),
}, t => [
  uniqueIndex("exams_pk_module_idx").on(t.moduleId).where(sql`${t.kind} = 'pk'`),
  uniqueIndex("exams_ik_course_idx").on(t.courseId).where(sql`${t.kind} = 'ik'`),
  uniqueIndex("exams_id_course_idx").on(t.id, t.courseId),
  foreignKey({ columns: [t.moduleId, t.courseId], foreignColumns: [modules.id, modules.courseId] }).onDelete("restrict"),
  check("exam_scope", sql`(${t.kind} = 'pk' and ${t.moduleId} is not null) or (${t.kind} = 'ik' and ${t.moduleId} is null)`),
  check("exam_threshold", sql`${t.passPercent} between 1 and 100`),
]).enableRLS();

export const examVersions = pgTable("exam_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "restrict" }),
  version: integer("version").notNull(), source: text("source").notNull(), sha256: varchar("sha256", { length: 64 }).notNull(),
  definition: jsonb("definition").$type<ExamDefinition>().notNull(),
  passPercent: integer("pass_percent").notNull().default(80),
  status: lessonStatus("status").notNull().default("draft"),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
}, t => [uniqueIndex("exam_versions_number_idx").on(t.examId, t.version), uniqueIndex("exam_versions_id_exam_idx").on(t.id, t.examId), check("exam_version_threshold", sql`${t.passPercent} between 1 and 100`)]).enableRLS();

export const courseLearningState = pgTable("course_learning_state", {
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  cycle: integer("cycle").notNull().default(1),
}, t => [primaryKey({ columns: [t.studentId, t.courseId] }), check("course_cycle_positive", sql`${t.cycle} > 0`)]).enableRLS();

export const examAttempts = pgTable("exam_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").notNull(), examId: uuid("exam_id").notNull(), versionId: uuid("version_id").notNull(),
  cycle: integer("cycle").notNull(), attemptNo: integer("attempt_no").notNull(),
  status: varchar("status", { length: 16 }).$type<"in_progress" | "passed" | "failed" | "void">().notNull().default("in_progress"),
  answers: jsonb("answers").$type<ExamAnswer[]>().notNull().default([]), answerRevision: integer("answer_revision").notNull().default(0),
  questionOrder: jsonb("question_order").$type<string[]>().notNull(),
  optionOrder: jsonb("option_order").$type<Record<string, string[]>>().notNull().default({}),
  result: jsonb("result").$type<AttemptResult>(),
  passPercent: integer("pass_percent").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
}, t => [
  foreignKey({ columns: [t.examId, t.courseId], foreignColumns: [exams.id, exams.courseId] }).onDelete("restrict"),
  foreignKey({ columns: [t.versionId, t.examId], foreignColumns: [examVersions.id, examVersions.examId] }).onDelete("restrict"),
  uniqueIndex("exam_attempt_number_idx").on(t.studentId, t.examId, t.cycle, t.attemptNo),
  uniqueIndex("exam_active_course_idx").on(t.studentId, t.courseId, t.cycle).where(sql`${t.status} = 'in_progress'`),
  index("exam_attempt_student_course_idx").on(t.studentId, t.courseId, t.cycle),
  check("exam_attempt_status", sql`${t.status} in ('in_progress','passed','failed','void')`),
  check("exam_attempt_positive", sql`${t.cycle} > 0 and ${t.attemptNo} > 0 and ${t.answerRevision} >= 0 and ${t.passPercent} between 1 and 100`),
]).enableRLS();

export const examRetryGrants = pgTable("exam_retry_grants", {
  id: uuid("id").defaultRandom().primaryKey(), studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "restrict" }), cycle: integer("cycle").notNull(),
  requestId: uuid("request_id").notNull().unique(), grantedBy: uuid("granted_by").references(() => users.id, { onDelete: "set null" }),
  reason: text("reason").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, t => [index("exam_retry_student_idx").on(t.studentId, t.examId, t.cycle)]).enableRLS();

export const studentAchievements = pgTable("student_achievements", {
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementKey: text("achievement_key").notNull(), earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(), metadata: jsonb("metadata"),
}, t => [primaryKey({ columns: [t.studentId, t.achievementKey] })]).enableRLS();
