import { useEffect, useRef } from "react";
import { Rive } from "@rive-app/canvas-single";

import routeBytes from "./assets/m1l01-route.riv";

/** Bundled by the trusted iframe runtime; lesson uploads cannot fetch assets. */
export function RiveRoute({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bytes = routeBytes.slice();
    const rive = new Rive({
      canvas: canvas.current,
      buffer: bytes.buffer,
      stateMachine: "Route",
      autoplay: !reducedMotion,
      enableRiveAssetCDN: false,
    });
    return () => rive.cleanup();
  }, []);

  return <canvas className={className} ref={canvas} width={440} height={180} aria-label="Dallasdan Atlantaga yuk yo‘li animatsiyasi" role="img" />;
}
