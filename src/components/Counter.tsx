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
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className,
}: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
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
  }, [inView, value, durationMs]);

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
