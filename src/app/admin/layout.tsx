import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminIcon } from "@/components/admin/admin-icon";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminSearch } from "@/components/admin/admin-search";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireReadyUser } from "@/lib/auth/current-user";
import styles from "./dashboard.module.css";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireReadyUser();
  if (user.role === "student") redirect("/learn");
  const initials = user.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return <div className={styles.shell}>
    <aside className={styles.sidebar} aria-label="Admin navigatsiyasi">
      <Link href="/admin" className={styles.brand}><Image src="/brand/coliseum-logo-horizontal-brand.png" alt="Coliseum Logistics" width={1010} height={600} sizes="(max-width: 760px) 175px, 210px" priority /></Link>
      <AdminNavigation isSuperAdmin={user.role === "super_admin"} />
      <div className={styles.sidebarNote}><span className={styles.noteIcon}><AdminIcon name="courses" size={23} /></span><strong>O‘quv platformasi</strong><p>O‘quvchilar va kurslarni bir joydan boshqaring.</p><Link href="/admin/students">O‘quvchilarni ko‘rish <AdminIcon name="arrow" size={17} /></Link></div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <AdminSearch />
        <div className={styles.profile}><span className={styles.avatar} aria-hidden="true">{initials}</span><span><strong>{user.fullName}</strong><small>{user.role === "super_admin" ? "Super admin" : "Admin"}</small></span><div className={styles.logout}><LogoutButton /></div></div>
      </header>
      <main id="admin-content" className={styles.mainScroll} tabIndex={-1}>{children}</main>
    </div>
  </div>;
}
