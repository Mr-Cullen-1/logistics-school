import Image from "next/image";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { currentUser, destinationFor } from "@/lib/auth/current-user";

export default async function LoginPage() {
  const user = await currentUser();
  if (user) redirect(destinationFor(user));
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Image src="/coliseum-logo-horizontal-light.svg" alt="Coliseum Logistics School" width={260} height={64} priority className="mx-auto" />
        <Card title="Platformaga kirish" description="Administrator bergan PIN yoki o'zingiz tanlagan parol bilan kiring.">
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
