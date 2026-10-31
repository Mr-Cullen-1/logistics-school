"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { lessonFrameDocument } from "@/lib/lessons/frame";

type Props = {
  compiledJs: string;
  kind: "learn" | "practice";
  lang?: "uz" | "ru" | "en";
  studentName: string;
  mode?: "review";
  checkSignal?: number;
  onReady?: (ready: boolean) => void;
  onSubmit?: (payload: unknown) => void;
  onFinished?: (payload: unknown) => void;
  onMounted?: () => void;
  onError?: (message: string) => void;
};

export function LessonFrame({ compiledJs, kind, lang, studentName, mode, checkSignal = 0, onReady, onSubmit, onFinished, onMounted, onError }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const nonce = useRef("");
  const mountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const origin = useSyncExternalStore(() => () => {}, () => window.location.origin, () => "");
  const documentHtml = origin ? lessonFrameDocument(origin) : "";
  const [height, setHeight] = useState(520);
  const [error, setError] = useState("");

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.nonce !== nonce.current) return;
      if (event.data.type === "ready") onReady?.(event.data.payload === true);
      if (event.data.type === "submit") onSubmit?.(event.data.payload);
      if (event.data.type === "finished") onFinished?.(event.data.payload);
      if (event.data.type === "mounted") { if (mountTimer.current) clearTimeout(mountTimer.current); mountTimer.current = null; onMounted?.(); }
      if (event.data.type === "height" && Number.isFinite(event.data.payload)) setHeight(Math.max(280, Math.min(3200, Number(event.data.payload))));
      if (event.data.type === "error") { if (mountTimer.current) clearTimeout(mountTimer.current); mountTimer.current = null; const detail = String(event.data.payload || "Dars ochilmadi"); setError(detail); onError?.(detail); }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [onReady, onSubmit, onFinished, onMounted, onError]);

  useEffect(() => () => { if (mountTimer.current) clearTimeout(mountTimer.current); }, []);

  useEffect(() => {
    if (checkSignal > 0) frame.current?.contentWindow?.postMessage({ type: "check", nonce: nonce.current }, "*");
  }, [checkSignal]);

  function initialize() {
    nonce.current ||= crypto.randomUUID();
    setError("");
    if (mountTimer.current) clearTimeout(mountTimer.current);
    mountTimer.current = setTimeout(() => { setError("Dars previewi 8 soniyada ochilmadi"); onError?.("Dars previewi 8 soniyada ochilmadi"); }, 8000);
    frame.current?.contentWindow?.postMessage({ type: "init", nonce: nonce.current, compiledJs, kind, props: { lang, studentName, mode } }, "*");
  }

  return <div><iframe ref={frame} title={kind === "learn" ? "Learn darsi" : "Practice topshirig‘i"} sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={documentHtml} onLoad={initialize} style={{ width: "100%", height, border: 0, borderRadius: 12, background: "#0d1114" }} />{error && <p role="alert" className="mt-2 text-sm text-alert">{error}</p>}</div>;
}
