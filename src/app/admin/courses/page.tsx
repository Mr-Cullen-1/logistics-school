import { asc } from "drizzle-orm";

import { CourseManager } from "@/components/admin/course-manager";
import { getDatabase } from "@/db";
import { courses } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const rows = await getDatabase().select().from(courses).orderBy(asc(courses.order), asc(courses.id));
  return <CourseManager courses={rows} canEdit={user.role === "super_admin"} />;
}
