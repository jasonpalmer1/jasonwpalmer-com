"use client";

import { useCallback, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
};

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [i, setI] = useState(0);

  const n = images.length;
  const next = useCallback(() => setI((v) => (v + 1) % n), [n]);
  const prev = useCallback(() => setI((v) => (v - 1 + n) % n), [n]);

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
        className="w-full cursor-pointer overflow-hidden rounded-lg border border-border"
        style={{ aspectRatio: "16 / 10", maxHeight: 260 }}
        onClick={next}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[i].src}
          alt={images[i].alt}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity active:opacity-80"
        />
      </div>

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
