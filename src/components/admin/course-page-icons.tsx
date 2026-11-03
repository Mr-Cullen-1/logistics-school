import type { ReactNode } from "react";

type IconName = "plus" | "modules" | "edit" | "up" | "down" | "trash" | "play" | "file" | "back";

export function CoursePageIcon({ name, size = 17 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    plus: <path d="M12 4v16M4 12h16" />,
    modules: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    edit: <><path d="m15 5 4 4M4 20l4.5-.9L20 7.6a2.8 2.8 0 0 0-4-4L4.5 15.1 4 20Z" /></>,
    up: <path d="m5 10 7-7 7 7M12 3v18" />,
    down: <path d="m5 14 7 7 7-7M12 21V3" />,
    trash: <><path d="M4 7h16M10 4h4m-8 3 .8 13h10.4L18 7M10 11v6m4-6v6" /></>,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4V8Z" /></>,
    file: <><path d="M6 3h9l4 4v14H6V3Zm9 0v5h4M9 13h7m-7 4h7" /></>,
    back: <path d="M10 5 3 12l7 7M3 12h18" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
