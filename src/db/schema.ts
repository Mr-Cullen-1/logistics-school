import {
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
  (table) => [index("modules_course_id_idx").on(table.courseId)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    order: integer("order").notNull().default(0),
    jsxSource: text("jsx_source").notNull(),
    compiledJs: text("compiled_js").notNull(),
    version: integer("version").notNull().default(1),
    status: lessonStatus("status").notNull().default("draft"),
    durationMin: integer("duration_min"),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("lessons_module_id_idx").on(table.moduleId)],
);

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
