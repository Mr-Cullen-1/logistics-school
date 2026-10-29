import { redirect } from "next/navigation";

import { requireReadyUser } from "@/lib/auth/current-user";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  return children;
}
