import { asc, and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { Card } from "@/components/ui/card";
import { getDatabase } from "@/db";
import { courses, enrollments, modules } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const { courseId } = await params;
  if (!z.uuid().safeParse(courseId).success) notFound();
  const [course] = await getDatabase().select({
    id: courses.id,
    title: courses.title,
    description: courses.description,
    level: courses.level,
  }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(user.id), eq(courses.id, courseId))).limit(1);
  if (!course) notFound();
  const sections = await getDatabase().select({ id: modules.id, title: modules.title }).from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.order), asc(modules.id));

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <Link href="/learn" className="text-sm text-gold hover:underline">← Mening kurslarim</Link>
      <div className="mt-7 mb-8"><p className="text-sm font-semibold text-gold">{course.level || "Ingliz tili"}</p><h1 className="mt-2 text-3xl font-bold">{course.title}</h1>{course.description && <p className="mt-3 text-steel">{course.description}</p>}</div>
      <h2 className="mb-4 text-xl font-semibold">Modullar</h2>
      {sections.length ? <div className="space-y-3">{sections.map((section, index) => <Card key={section.id} title={`${index + 1}. ${section.title}`} description="Darslar keyingi bosqichda qo‘shiladi." />)}</div> : <Card title="Modullar hali qo‘shilmagan" description="Kurs mazmuni tayyorlanmoqda." />}
    </main>
  );
}
