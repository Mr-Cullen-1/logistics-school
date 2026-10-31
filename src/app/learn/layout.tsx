import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { LearnIcon } from "@/components/learn/learn-icon";
import { LearnNavigation } from "@/components/learn/learn-navigation";
import { requireReadyUser } from "@/lib/auth/current-user";
import styles from "./learn.module.css";

export default async function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const initials = user.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return <div className={styles.shell}>
    <aside className={styles.sidebar} aria-label="O‘quvchi navigatsiyasi">
      <Link href="/learn" className={styles.brand}><Image src="/coliseum-logo-horizontal-light.svg" alt="Coliseum Logistics School" width={218} height={53} style={{ height: "auto" }} priority /></Link>
      <LearnNavigation />
      <div className={styles.helpCard}>
        <div className={styles.helpImage} />
        <div className={styles.helpBody}><h2>Yordam kerakmi?</h2><p>Savollaringiz bo‘lsa, qo‘llab-quvvatlash jamoasiga murojaat qiling.</p><span aria-disabled="true">Qo‘llab-quvvatlash · Tez orada</span></div>
      </div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.searchDisabled} aria-disabled="true"><LearnIcon name="search" size={20} /><span>Darslar, mavzular va resurslarni qidirish...</span><small>Tez orada</small></div>
        <div className={styles.topActions}>
          <span className={styles.noticeDisabled} aria-label="Bildirishnomalar tez orada" aria-disabled="true"><LearnIcon name="bell" size={21} /></span>
          <div className={styles.profile}><span className={styles.avatar} aria-hidden="true">{initials}</span><span><strong>{user.fullName}</strong><small>O‘quvchi</small></span></div>
          <div className={styles.logout}><LogoutButton /></div>
        </div>
      </header>
      <main id="learn-content" className={styles.mainScroll} tabIndex={-1}>{children}</main>
    </div>
  </div>;
}
