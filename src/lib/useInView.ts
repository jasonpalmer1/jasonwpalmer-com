"use client";

import { useEffect, useRef, useState } from "react";

// Fires once when the element scrolls into view. Drives the count-up
// and skill-bar animations so they only run when visible.
export function useInView<T extends HTMLElement>(rootMargin = "-60px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
