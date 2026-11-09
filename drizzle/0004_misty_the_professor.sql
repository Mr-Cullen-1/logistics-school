ALTER TABLE "course_learning_state" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exam_attempts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exam_retry_grants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exam_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "student_achievements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- These tables are accessed through the authenticated Next server using its
-- database owner connection, never directly through the Supabase Data API.
REVOKE ALL ON TABLE public.course_learning_state, public.exam_attempts,
  public.exam_retry_grants, public.exam_versions, public.exams,
  public.student_achievements FROM PUBLIC;--> statement-breakpoint
DO $$
DECLARE api_role text;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    -- Local PostgreSQL/PGlite fixtures need not have Supabase's API roles.
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON TABLE public.course_learning_state,
        public.exam_attempts, public.exam_retry_grants, public.exam_versions,
        public.exams, public.student_achievements FROM %I', api_role);
    END IF;
  END LOOP;
END $$;
