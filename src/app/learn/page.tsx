import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { getDatabase } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { activeCourseAccess } from "@/lib/courses/access";
import { requireReadyUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export default async function LearnPage() {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const available = await getDatabase().select({
    id: courses.id,
    title: courses.title,
    description: courses.description,
    level: courses.level,
    expiresAt: enrollments.expiresAt,
  }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(activeCourseAccess(user.id)).orderBy(asc(courses.order), asc(courses.title));
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between gap-4"><h1 className="text-3xl font-bold">O‘quv platformasi</h1><LogoutButton /></div>
      <h2 className="mb-5 text-xl font-semibold">{user.fullName} uchun kurslar</h2>
      {available.length ? <div className="grid gap-4 sm:grid-cols-2">{available.map((course) => (
        <Card key={course.id} title={course.title} description={course.description || "Ingliz tili kursi"}>
          <div className="flex items-center justify-between gap-3 text-sm text-steel">
            <span>{course.level || "Daraja belgilanmagan"}</span>
            {course.expiresAt && <span>{course.expiresAt.toLocaleDateString("uz-UZ")} gacha</span>}
          </div>
          <Link href={`/learn/${course.id}`} className="mt-5 inline-flex min-h-11 items-center rounded-[8px] border border-gold bg-gold px-5 text-sm font-semibold text-charcoal hover:bg-[#E2BF90]">Kursni ochish</Link>
        </Card>
      ))}</div> : <Card title="Hozircha kurs ochilmagan" description="Administrator sizga kurs uchun dostup berganida u shu yerda paydo bo‘ladi." />}
    </main>
  );
}
