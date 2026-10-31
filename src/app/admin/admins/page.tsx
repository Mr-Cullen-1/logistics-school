import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminManager } from "@/components/admin/admin-manager";
import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function AdminsPage() {
  const user = await requireReadyUser();
  if (user.role !== "super_admin") redirect("/admin");
  const rows = await getDatabase().select({
    id: users.id,
    fullName: users.fullName,
    phone: users.phone,
    isActive: users.isActive,
    mustChangePassword: users.mustChangePassword,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt), desc(users.id));

  return <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
    <Link href="/admin" className="text-sm text-gold hover:underline">← Boshqaruv paneli</Link>
    <div className="mt-6 mb-8"><h1 className="text-3xl font-bold tracking-tight">Adminlar</h1><p className="mt-2 text-sm text-steel">Adminlarga o‘quvchilar va kurs dostuplarini boshqarish huquqini bering.</p></div>
    <AdminManager admins={rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }))} />
  </div>;
}
