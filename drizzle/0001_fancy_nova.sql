CREATE TABLE "student_profiles" (
	"student_id" uuid PRIMARY KEY NOT NULL,
	"avatar_data" text,
	"locale" varchar(2) DEFAULT 'uz' NOT NULL,
	"goal_title" varchar(160),
	"goal_date" date
);
--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_profiles" ENABLE ROW LEVEL SECURITY;
