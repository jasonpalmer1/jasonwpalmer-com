"use client";

import { useCallback, useState } from "react";
import type { GalleryImage } from "@/data/tools";

export type { GalleryImage };

// Most build screenshots are phone portraits (~780×1520).
const DEFAULT_W = 780;
const DEFAULT_H = 1520;

function ratioFor(img: GalleryImage | undefined, measured: string | null): string {
  if (measured) return measured;
  if (img?.width && img?.height) return `${img.width} / ${img.height}`;
  return `${DEFAULT_W} / ${DEFAULT_H}`;
}

export default function Gallery({
  images,
  priority = false,
}: {
  images: GalleryImage[];
  /** Only true if this gallery can be LCP (homepage galleries stay lazy). */
  priority?: boolean;
}) {
  const [i, setI] = useState(0);
  // Natural size from onLoad — keyed by src so slide changes use data dims first.
  const [measured, setMeasured] = useState<Record<string, string>>({});

  const n = images.length;
  const next = useCallback(() => {
    if (n <= 1) return;
    setI((v) => (v + 1) % n);
  }, [n]);
  const prev = useCallback(() => {
    if (n <= 1) return;
    setI((v) => (v - 1 + n) % n);
  }, [n]);

  if (n === 0) return null;

  const current = images[i];
  const ratio = ratioFor(current, measured[current.src] ?? null);

  return (
    <div
      className="group/gallery relative select-none"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Screenshot gallery"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div
        className={`w-full overflow-hidden rounded-lg border border-border ${
          n > 1 ? "cursor-pointer" : ""
        }`}
        style={{ aspectRatio: ratio, maxHeight: 420 }}
        onClick={n > 1 ? next : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={current.width ?? DEFAULT_W}
          height={current.height ?? DEFAULT_H}
          loading={priority && i === 0 ? "eager" : "lazy"}
          decoding="async"
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            if (w > 0 && h > 0) {
              const nextRatio = `${w} / ${h}`;
              setMeasured((prev) =>
                prev[current.src] === nextRatio
                  ? prev
                  : { ...prev, [current.src]: nextRatio },
              );
            }
          }}
          className="h-full w-full object-contain transition-opacity active:opacity-80"
        />
      </div>

      <p className="absolute h-px w-px overflow-hidden whitespace-nowrap" aria-live="polite">
        Screenshot {i + 1} of {n}: {current.alt}
      </p>

      {n > 1 && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 top-2 rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted backdrop-blur-sm"
          >
            [ {i + 1}/{n} ]
          </span>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous screenshot"
            className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-sm text-foreground opacity-70 backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next screenshot"
            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-sm text-foreground opacity-70 backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            ›
          </button>

          <div className="mt-2 flex justify-center gap-1.5">
            {images.map((img, idx) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Go to screenshot ${idx + 1} of ${n}`}
                aria-current={idx === i ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-4 bg-accent" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
