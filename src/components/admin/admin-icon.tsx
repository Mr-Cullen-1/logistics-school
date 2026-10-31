import type { ReactNode } from "react";

export type AdminIconName = "dashboard" | "students" | "courses" | "activity" | "growth" | "search" | "arrow" | "book" | "access";

export function AdminIcon({ name, size = 20 }: { name: AdminIconName; size?: number }) {
  const paths: Record<AdminIconName, ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    students: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m2 9h2v-2a6 6 0 0 0-4-5.7" /></>,
    courses: <><path d="m3 7 9-4 9 4-9 4-9-4Zm3 2v7c4 3 8 3 12 0V9M21 7v9" /></>,
    activity: <><path d="M3 12h4l3-7 4 14 3-7h4" /></>,
    growth: <><path d="M3 20V4m0 16h18M7 16l4-5 3 2 6-7m-4 0h4v4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 13A2.5 2.5 0 0 1 6.5 16H20" /></>,
    access: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
