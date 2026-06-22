"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/useInView";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
};

// Counts up from 0 to `value` once it scrolls into view.
// Fallback: if IntersectionObserver hasn't fired after 2 s (e.g. element
// already in viewport on load or observer blocked), starts the animation
// anyway so values never stay stuck at zero.
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className,
}: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  // `started` is true once we should animate — either because inView fired
  // or because the 2-second fallback timer expired.
  const [started, setStarted] = useState(false);

  // Fallback timer: guarantee animation starts even if inView never fires.
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Start as soon as inView or the fallback fires (whichever comes first).
  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / durationMs, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, durationMs]);

  // Integers stay clean; decimals show one place.
  const display = Number.isInteger(value)
    ? Math.round(n).toLocaleString()
    : n.toFixed(1);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
