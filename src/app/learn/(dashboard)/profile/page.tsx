import { count, eq, isNotNull, and } from "drizzle-orm";

import { ProfileSettings } from "@/components/learn/profile-settings";
import { getDatabase } from "@/db";
import { progress, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import type { LearnLocale } from "@/lib/learn/translations";

export default async function ProfilePage() {
  const user = await requireReadyUser();
  const [[profile], [completed]] = await Promise.all([
    getDatabase().select({ avatarData: studentProfiles.avatarData, locale: studentProfiles.locale, goalTitle: studentProfiles.goalTitle, goalDate: studentProfiles.goalDate }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1),
    getDatabase().select({ total: count() }).from(progress).where(and(eq(progress.studentId, user.id), isNotNull(progress.completedAt))),
  ]);
  const locale = (profile?.locale === "ru" || profile?.locale === "en" ? profile.locale : "uz") as LearnLocale;
  return <ProfileSettings fullName={user.fullName} phone={user.phone} avatarData={profile?.avatarData || null} locale={locale} goalTitle={profile?.goalTitle || ""} goalDate={profile?.goalDate || ""} completedLessons={completed.total} />;
}
