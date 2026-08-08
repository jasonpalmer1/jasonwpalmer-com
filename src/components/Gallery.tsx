"use client";

import { useCallback, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
};

// Most build screenshots are phone portraits (~780×1520). Default to that so
// the first paint isn't a landscape letterbox; onLoad snaps to the real ratio.
const DEFAULT_RATIO = "9 / 16";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [i, setI] = useState(0);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

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
          key={images[i].src}
          src={images[i].src}
          alt={images[i].alt}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            if (w > 0 && h > 0) setRatio(`${w} / ${h}`);
          }}
          className="h-full w-full object-contain transition-opacity active:opacity-80"
        />
      </div>

      <p className="absolute h-px w-px overflow-hidden whitespace-nowrap" aria-live="polite">
        Screenshot {i + 1} of {n}: {images[i].alt}
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
                aria-current={idx === i}
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
