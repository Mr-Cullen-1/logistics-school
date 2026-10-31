import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { StudentManager } from "@/components/admin/student-manager";
import { requireReadyUser } from "@/lib/auth/current-user";

const pageSize = 20;

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const admin = await requireReadyUser();
  if (admin.role === "student") redirect("/learn");
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim().slice(0, 80) : "";
  const rawPage = Number(params.page);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 10_000) : 1;
  const filter = and(
    eq(users.role, "student"),
    search ? or(ilike(users.fullName, `%${search}%`), ilike(users.phone, `%${search}%`)) : undefined,
  );
  const [rows, [totalRow]] = await Promise.all([
    getDatabase().select({
      id: users.id,
      fullName: users.fullName,
      phone: users.phone,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
      createdAt: users.createdAt,
    }).from(users).where(filter).orderBy(desc(users.createdAt), desc(users.id)).limit(pageSize).offset((page - 1) * pageSize),
    getDatabase().select({ total: count() }).from(users).where(filter),
  ]);

  const students = rows.map((student) => ({ ...student, createdAt: student.createdAt.toISOString() }));
  const pages = Math.max(1, Math.ceil(totalRow.total / pageSize));
  const pageUrl = (number: number) => `/admin/students?${new URLSearchParams({ ...(search ? { search } : {}), page: String(number) })}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-sm text-gold hover:underline">← Boshqaruv paneli</Link>
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">O‘quvchilar</h1>
        <p className="mt-2 text-sm text-steel">Akkaunt yarating, kirishni boshqaring va kerak bo‘lsa yangi PIN bering.</p>
      </div>
      <StudentManager students={students} search={search} total={totalRow.total} />
      {pages > 1 && (
        <nav aria-label="Sahifalar" className="mt-6 flex items-center justify-between gap-4 text-sm">
          {page > 1 ? <Link href={pageUrl(page - 1)} className="text-gold hover:underline">← Oldingi</Link> : <span />}
          <span className="text-steel">{page} / {pages}</span>
          {page < pages ? <Link href={pageUrl(page + 1)} className="text-gold hover:underline">Keyingi →</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
