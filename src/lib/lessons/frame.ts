export function lessonFrameDocument(platformOrigin: string): string {
  const origin = new URL(platformOrigin).origin;
  if (!/^https?:\/\//.test(origin)) throw new Error("Noto‘g‘ri platforma manzili");
  const csp = [
    "default-src 'none'",
    `script-src ${origin} blob: 'wasm-unsafe-eval'`,
    "style-src 'unsafe-inline'",
    `img-src ${origin} data: blob:`,
    "media-src 'none'",
    "connect-src 'none'",
    `font-src ${origin}`,
    "object-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
  ].join("; ");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>@font-face{font-family:Geist;src:url('${origin}/fonts/Geist-Variable.woff2') format('woff2');font-weight:100 900;font-display:swap}@font-face{font-family:Geist Mono;src:url('${origin}/fonts/GeistMono-Variable.woff2') format('woff2');font-weight:100 900;font-display:swap}html,body{margin:0;min-height:100%;font-family:Geist,system-ui,sans-serif;background:#0d1114;color:#f5f0e8}body{--font-sans:Geist,system-ui,sans-serif;--font-mono:'Geist Mono',monospace}#root{min-height:240px}</style></head><body><div id="root"></div><script src="${origin}/lesson-runtime.js"></script></body></html>`;
}
