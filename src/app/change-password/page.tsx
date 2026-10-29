import { redirect } from "next/navigation";

import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { Card } from "@/components/ui/card";
import { destinationFor, requireUser } from "@/lib/auth/current-user";

export default async function ChangePasswordPage() {
  const user = await requireUser();
  if (!user.mustChangePassword) redirect(destinationFor(user));
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md" title="Yangi parol yarating" description="Birinchi kirish uchun berilgan PINni almashtirish majburiy.">
        <ChangePasswordForm />
      </Card>
    </main>
  );
}
