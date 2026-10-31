import type { ReactNode } from "react";

export type LearnIconName = "dashboard" | "courses" | "lessons" | "assignments" | "exams" | "certificates" | "progress" | "messages" | "schedule" | "resources" | "community" | "search" | "bell" | "arrow" | "play" | "check" | "target";

export function LearnIcon({ name, size = 20 }: { name: LearnIconName; size?: number }) {
  const paths: Record<LearnIconName, ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    courses: <><path d="m3 7 9-4 9 4-9 4-9-4Zm3 2v7c4 3 8 3 12 0V9M21 7v9" /></>,
    lessons: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 13A2.5 2.5 0 0 1 6.5 16H20" /></>,
    assignments: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M9 12l2 2 4-4" /></>,
    exams: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    certificates: <><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M8 17v4l4-2 4 2v-4M8 8h8m-8 4h5" /></>,
    progress: <><path d="M3 20V4m0 16h18M7 16l4-5 3 2 6-7m-4 0h4v4" /></>,
    messages: <><path d="M4 4h16v13H9l-5 4V4Z" /><path d="M8 9h8m-8 4h5" /></>,
    schedule: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18M8 14h3m3 0h2" /></>,
    resources: <><path d="M5 3h10l4 4v14H5V3Zm10 0v5h4M8 12h8m-8 4h8" /></>,
    community: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m2 9h2v-2a6 6 0 0 0-4-5.7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    check: <path d="m4 12 5 5L20 6" />,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
