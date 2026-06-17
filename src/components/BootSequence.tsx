"use client";

import { useEffect, useState } from "react";

const LINES = (name: string) => [
  "> initializing operator terminal v2.7 …",
  "> establishing secure uplink … OK",
  `> loading profile: ${name.toUpperCase().replace(/\s+/g, "_")} …`,
  "> decrypting credentials … OK",
  "> mounting builds [3] … OK",
  "> ACCESS GRANTED",
];

export default function BootSequence({ name }: { name: string }) {
  const lines = LINES(name);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Start as not-mounted so SSR markup matches; decide after mount.
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("booted") === "1") return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (shown >= lines.length) {
      const t = setTimeout(() => setDone(true), 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 120 : 230);
    return () => clearTimeout(t);
  }, [active, shown, lines.length]);

  useEffect(() => {
    if (!done) return;
    sessionStorage.setItem("booted", "1");
    const t = setTimeout(() => setHidden(true), 650);
    return () => clearTimeout(t);
  }, [done]);

  const skip = () => {
    sessionStorage.setItem("booted", "1");
    setDone(true);
    setShown(lines.length);
  };

  if (!active || hidden) return null;

  return (
    <div
      onClick={skip}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        done ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-lg px-8 font-mono text-sm">
        {lines.slice(0, shown).map((l, i) => {
          const granted = l.includes("ACCESS GRANTED");
          return (
            <p
              key={i}
              className={granted ? "mt-2 text-accent text-glow" : "text-muted"}
            >
              {l}
            </p>
          );
        })}
        {shown < lines.length && (
          <span className="text-accent blink">█</span>
        )}
        <p className="mt-8 text-[0.65rem] tracking-widest text-muted/60">
          [ click to skip ]
        </p>
      </div>
    </div>
  );
}
