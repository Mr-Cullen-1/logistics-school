CREATE TABLE "course_learning_state" (
	"student_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"cycle" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "course_learning_state_student_id_course_id_pk" PRIMARY KEY("student_id","course_id"),
	CONSTRAINT "course_cycle_positive" CHECK ("course_learning_state"."cycle" > 0)
);
--> statement-breakpoint
CREATE TABLE "exam_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"exam_id" uuid NOT NULL,
	"version_id" uuid NOT NULL,
	"cycle" integer NOT NULL,
	"attempt_no" integer NOT NULL,
	"status" varchar(16) DEFAULT 'in_progress' NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"answer_revision" integer DEFAULT 0 NOT NULL,
	"question_order" jsonb NOT NULL,
	"option_order" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"result" jsonb,
	"pass_percent" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	CONSTRAINT "exam_attempt_status" CHECK ("exam_attempts"."status" in ('in_progress','passed','failed','void')),
	CONSTRAINT "exam_attempt_positive" CHECK ("exam_attempts"."cycle" > 0 and "exam_attempts"."attempt_no" > 0 and "exam_attempts"."answer_revision" >= 0 and "exam_attempts"."pass_percent" between 1 and 100)
);
--> statement-breakpoint
CREATE TABLE "exam_retry_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"exam_id" uuid NOT NULL,
	"cycle" integer NOT NULL,
	"request_id" uuid NOT NULL,
	"granted_by" uuid,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_retry_grants_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "exam_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"source" text NOT NULL,
	"sha256" varchar(64) NOT NULL,
	"definition" jsonb NOT NULL,
	"pass_percent" integer DEFAULT 80 NOT NULL,
	"status" "lesson_status" DEFAULT 'draft' NOT NULL,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	CONSTRAINT "exam_version_threshold" CHECK ("exam_versions"."pass_percent" between 1 and 100)
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"module_id" uuid,
	"kind" varchar(2) NOT NULL,
	"title" text NOT NULL,
	"pass_percent" integer DEFAULT 80 NOT NULL,
	"current_version" integer,
	CONSTRAINT "exam_scope" CHECK (("exams"."kind" = 'pk' and "exams"."module_id" is not null) or ("exams"."kind" = 'ik' and "exams"."module_id" is null)),
	CONSTRAINT "exam_threshold" CHECK ("exams"."pass_percent" between 1 and 100)
);
--> statement-breakpoint
CREATE TABLE "student_achievements" (
	"student_id" uuid NOT NULL,
	"achievement_key" text NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "student_achievements_student_id_achievement_key_pk" PRIMARY KEY("student_id","achievement_key")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "exam_policy" varchar(10) DEFAULT 'disabled' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "exams_id_course_idx" ON "exams" USING btree ("id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_versions_id_exam_idx" ON "exam_versions" USING btree ("id","exam_id");--> statement-breakpoint
CREATE UNIQUE INDEX "modules_id_course_idx" ON "modules" USING btree ("id","course_id");--> statement-breakpoint
ALTER TABLE "course_learning_state" ADD CONSTRAINT "course_learning_state_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_learning_state" ADD CONSTRAINT "course_learning_state_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_course_id_exams_id_course_id_fk" FOREIGN KEY ("exam_id","course_id") REFERENCES "public"."exams"("id","course_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_version_id_exam_id_exam_versions_id_exam_id_fk" FOREIGN KEY ("version_id","exam_id") REFERENCES "public"."exam_versions"("id","exam_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_retry_grants" ADD CONSTRAINT "exam_retry_grants_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_retry_grants" ADD CONSTRAINT "exam_retry_grants_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_retry_grants" ADD CONSTRAINT "exam_retry_grants_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_versions" ADD CONSTRAINT "exam_versions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_versions" ADD CONSTRAINT "exam_versions_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_versions" ADD CONSTRAINT "exam_versions_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_module_id_course_id_modules_id_course_id_fk" FOREIGN KEY ("module_id","course_id") REFERENCES "public"."modules"("id","course_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_achievements" ADD CONSTRAINT "student_achievements_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "exam_attempt_number_idx" ON "exam_attempts" USING btree ("student_id","exam_id","cycle","attempt_no");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_active_course_idx" ON "exam_attempts" USING btree ("student_id","course_id","cycle") WHERE "exam_attempts"."status" = 'in_progress';--> statement-breakpoint
CREATE INDEX "exam_attempt_student_course_idx" ON "exam_attempts" USING btree ("student_id","course_id","cycle");--> statement-breakpoint
CREATE INDEX "exam_retry_student_idx" ON "exam_retry_grants" USING btree ("student_id","exam_id","cycle");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_versions_number_idx" ON "exam_versions" USING btree ("exam_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "exams_pk_module_idx" ON "exams" USING btree ("module_id") WHERE "exams"."kind" = 'pk';--> statement-breakpoint
CREATE UNIQUE INDEX "exams_ik_course_idx" ON "exams" USING btree ("course_id") WHERE "exams"."kind" = 'ik';--> statement-breakpoint
INSERT INTO student_achievements(student_id, achievement_key, earned_at)
SELECT student_id, 'lesson:' || lesson_id::text, completed_at FROM progress WHERE completed_at IS NOT NULL ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO student_achievements(student_id, achievement_key)
SELECT s.student_id, 'badge:' || b.n::text FROM (SELECT student_id, count(*) AS total FROM student_achievements WHERE achievement_key LIKE 'lesson:%' GROUP BY student_id) s
CROSS JOIN (VALUES (1), (5), (10)) b(n) WHERE s.total >= b.n ON CONFLICT DO NOTHING;
