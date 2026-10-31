import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot, type Root } from "react-dom/client";

import * as kit from "./kit";

type Message = { type: string; nonce: string; compiledJs?: string; kind?: "learn" | "practice"; props?: Record<string, unknown> };
type LessonProps = Record<string, unknown>;

class RenderBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { send("error", error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

function MountSignal({ children }: { children: React.ReactNode }) {
  React.useEffect(() => { send("mounted"); }, []);
  return children;
}

let activeNonce = "";
let check: (() => void) | null = null;
let root: Root | null = null;

function send(type: string, payload?: unknown) {
  window.parent.postMessage({ type, nonce: activeNonce, payload }, "*");
}

window.addEventListener("error", (event) => {
  if (activeNonce) send("error", event.message || "Dars kodi xato bilan to‘xtadi");
});
window.addEventListener("unhandledrejection", (event) => {
  if (activeNonce) send("error", event.reason instanceof Error ? event.reason.message : "Dars kodi xato bilan to‘xtadi");
});

export const modules: Record<string, unknown> = { react: React, "react-dom": ReactDOM, "@coliseum/kit": kit };

export function mount(Component: React.ComponentType<LessonProps>, kind: "learn" | "practice", props: LessonProps) {
  if (!Component) { send("error", "Default export topilmadi"); return; }
  const bridge = kind === "learn" ? {
    onFinished: (payload: unknown) => send("finished", payload),
  } : {
    onReady: (value: boolean) => send("ready", !!value),
    registerCheck: (callback: () => void) => { check = callback; },
    onSubmit: (payload: unknown) => send("submit", payload),
    playCorrect: () => {},
    playWrong: () => {},
  };
  root ??= createRoot(document.getElementById("root")!);
  root.render(React.createElement(RenderBoundary, null, React.createElement(MountSignal, null, React.createElement(Component, { ...props, ...bridge }))));
  const observer = new ResizeObserver(() => send("height", document.documentElement.scrollHeight));
  observer.observe(document.body);
  send("height", document.documentElement.scrollHeight);
}

window.addEventListener("message", (event: MessageEvent<Message>) => {
  if (event.source !== window.parent || !event.data || typeof event.data !== "object") return;
  if (event.data.type === "check") {
    if (event.data.nonce === activeNonce) check?.();
    return;
  }
  if (event.data.type !== "init" || !event.data.nonce || !event.data.compiledJs || !event.data.kind) return;
  activeNonce = event.data.nonce;
  check = null;
  const lessonModule = { exports: {} as { default?: React.ComponentType<LessonProps> } };
  Object.assign(window, { module: lessonModule, exports: lessonModule.exports, require: (name: string) => {
    if (!(name in modules)) throw new Error(`Importga ruxsat yo‘q: ${name}`);
    return modules[name];
  } });
  const script = document.createElement("script");
  const blob = new Blob([event.data.compiledJs, `\n;window.ColiseumRuntime.mount(window.module.exports.default, ${JSON.stringify(event.data.kind)}, ${JSON.stringify(event.data.props || {})});`], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  script.src = url;
  script.onload = () => URL.revokeObjectURL(url);
  script.onerror = () => { URL.revokeObjectURL(url); send("error", "Dars kodi ishga tushmadi"); };
  document.body.append(script);
});
