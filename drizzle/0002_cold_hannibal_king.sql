CREATE TABLE "lesson_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"seq" integer NOT NULL,
	"mechanic" varchar(24),
	"source" text NOT NULL,
	"compiled_js" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"sha256" varchar(64) NOT NULL,
	"version" integer NOT NULL,
	"status" "lesson_status" DEFAULT 'draft' NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"student_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"learn_done_at" timestamp with time zone,
	"learn_payload" jsonb,
	"practice_done_at" timestamp with time zone,
	CONSTRAINT "lesson_progress_student_id_lesson_id_pk" PRIMARY KEY("student_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "practice_attempts" (
	"student_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"seq" integer NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"correct" boolean DEFAULT false NOT NULL,
	"first_try_correct" boolean DEFAULT false NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_attempts_student_id_lesson_id_seq_pk" PRIMARY KEY("student_id","lesson_id","seq")
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "code" varchar(12);--> statement-breakpoint
ALTER TABLE "lesson_files" ADD CONSTRAINT "lesson_files_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_files" ADD CONSTRAINT "lesson_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_files_slot_version_idx" ON "lesson_files" USING btree ("lesson_id","kind","seq","version");--> statement-breakpoint
CREATE INDEX "lesson_files_lesson_idx" ON "lesson_files" USING btree ("lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lessons_module_code_idx" ON "lessons" USING btree ("module_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_files_current_slot_idx" ON "lesson_files" ("lesson_id","kind","seq") WHERE "is_current" = true;--> statement-breakpoint
ALTER TABLE "lesson_files" ADD CONSTRAINT "lesson_files_kind_seq_check" CHECK (("kind" = 'learn' AND "seq" = 0) OR ("kind" = 'practice' AND "seq" BETWEEN 1 AND 10));--> statement-breakpoint
INSERT INTO "lesson_files" ("lesson_id","kind","seq","source","compiled_js","size_bytes","sha256","version","status","is_current","uploaded_by","uploaded_at")
SELECT "id", 'learn', 0, "jsx_source", "compiled_js", octet_length("jsx_source"), encode(sha256(convert_to("jsx_source", 'UTF8')), 'hex'), "version", "status", "status" = 'published', "updated_by", "updated_at"
FROM "lessons" WHERE "jsx_source" <> '';--> statement-breakpoint
INSERT INTO "lesson_progress" ("student_id","lesson_id","learn_done_at")
SELECT "student_id","lesson_id","completed_at" FROM "progress" WHERE "completed_at" IS NOT NULL
ON CONFLICT ("student_id","lesson_id") DO NOTHING;--> statement-breakpoint
ALTER TABLE "lesson_files" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lesson_progress" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "practice_attempts" ENABLE ROW LEVEL SECURITY;
