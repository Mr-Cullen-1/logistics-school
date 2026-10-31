import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { currentUser, destinationFor } from "@/lib/auth/current-user";
import styles from "./login.module.css";

export default async function LoginPage() {
  const user = await currentUser();
  if (user) redirect(destinationFor(user));
  return (
    <main className={styles.stage}>
      <div className={styles.ambient} aria-hidden="true">
        <svg className={styles.waves} viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="login-wave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#B8814A" stopOpacity="0" />
              <stop offset=".24" stopColor="#D4AF7C" stopOpacity=".7" />
              <stop offset=".58" stopColor="#F4F1E8" stopOpacity=".35" />
              <stop offset="1" stopColor="#B8814A" stopOpacity="0" />
            </linearGradient>
            <filter id="login-wave-glow" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          <g fill="none" stroke="url(#login-wave)" strokeLinecap="round">
            <path d="M-80 492 C170 370 245 585 460 520 S800 322 1028 423 S1275 570 1520 365" strokeWidth="29" opacity=".28" filter="url(#login-wave-glow)" />
            <path d="M-80 492 C170 370 245 585 460 520 S800 322 1028 423 S1275 570 1520 365" strokeWidth="2" opacity=".8" />
            <path d="M-80 598 C185 445 272 706 500 572 S832 418 1065 536 S1327 579 1520 488" strokeWidth="38" opacity=".18" filter="url(#login-wave-glow)" />
            <path d="M-80 598 C185 445 272 706 500 572 S832 418 1065 536 S1327 579 1520 488" strokeWidth="1.5" opacity=".68" />
            <path d="M-50 690 C220 800 330 530 548 650 S885 760 1090 615 S1340 610 1490 740" strokeWidth="2" opacity=".38" />
          </g>
        </svg>
        <span className={`${styles.orb} ${styles.orbOne}`} />
        <span className={`${styles.orb} ${styles.orbTwo}`} />
        <span className={`${styles.orb} ${styles.orbThree}`} />
        <span className={`${styles.orb} ${styles.orbFour}`} />
        <span className={`${styles.orb} ${styles.orbFive}`} />
      </div>
      <section className={styles.panel} aria-labelledby="login-title">
        <Image src="/coliseum-logo-horizontal-light.svg" alt="Coliseum Logistics School" width={260} height={63} priority className={styles.logo} style={{ height: "auto" }} />
        <div className={styles.heading}>
          <h1 id="login-title">Platformaga kirish</h1>
          <p>Administrator bergan PIN yoki o&apos;zingiz tanlagan parol bilan kiring.</p>
        </div>
        <div className={styles.formWrap}>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
