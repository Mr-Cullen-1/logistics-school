import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { requireReadyUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export default async function LearnPage() {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between gap-4"><h1 className="text-3xl font-bold">O‘quv platformasi</h1><LogoutButton /></div>
      <Card title={`Xush kelibsiz, ${user.fullName}`} description="Kurslar keyingi bosqichda shu yerda paydo bo‘ladi." />
    </main>
  );
}
