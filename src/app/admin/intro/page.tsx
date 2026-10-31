import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { IntroManager } from "@/components/admin/intro-manager";
import { getDatabase } from "@/db";
import { courses, lessons, modules } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function IntroPage() {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const db = getDatabase();
  const [[intro], sections] = await Promise.all([
    db.select({ id: lessons.id, title: lessons.title, status: lessons.status }).from(lessons).where(eq(lessons.code, "INTRO")).limit(1),
    db.select({ id: modules.id, moduleTitle: modules.title, courseTitle: courses.title }).from(modules).innerJoin(courses, eq(modules.courseId, courses.id)).orderBy(asc(courses.order), asc(modules.order)),
  ]);
  return <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
    <Link href="/admin" className="text-sm text-gold hover:underline">← Boshqaruv paneli</Link>
    <IntroManager intro={intro || null} sections={sections} canEdit={user.role === "super_admin"} />
  </div>;
}
