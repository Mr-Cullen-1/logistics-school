import { redirect } from "next/navigation";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { requireReadyUser } from "@/lib/auth/current-user";

export default async function AdminPage() {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between gap-4"><h1 className="text-3xl font-bold">Boshqaruv paneli</h1><LogoutButton /></div>
      <Card title={`Xush kelibsiz, ${user.fullName}`} description="O‘quvchilar akkauntlarini boshqarishingiz mumkin.">
        <Link href="/admin/students" className="inline-flex min-h-11 items-center rounded-[8px] border border-gold bg-gold px-5 text-sm font-semibold text-charcoal hover:bg-[#E2BF90]">O‘quvchilarga o‘tish</Link>
      </Card>
    </main>
  );
}
