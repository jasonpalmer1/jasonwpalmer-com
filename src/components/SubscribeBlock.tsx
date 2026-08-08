import Subscribe from "./Subscribe";

// The single, self-contained subscribe CTA: one header + copy + the form, in a
// HUD card. Used at the bottom of the homepage and every blog page so a visitor
// can always get notified of new dispatches without hunting for it.
export default function SubscribeBlock() {
  return (
    <div
      id="subscribe"
      className="hud mx-auto max-w-xl scroll-mt-20 rounded-2xl p-6 text-center sm:p-8"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="pulse-dot" />
        <p className="label">{"// dispatch log"}</p>
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-gradient">
        GET EVERY DISPATCH
      </h2>
      <p className="mx-auto mt-2 max-w-md font-mono text-sm text-muted">
        A new build log in your inbox each time I ship something. No spam —
        unsubscribe anytime.
      </p>
      <div className="mt-6">
        <Subscribe />
      </div>
      <p className="mt-4 font-mono text-[0.65rem] tracking-widest text-muted/70">
        or follow via{" "}
        <a href="/rss.xml" className="text-accent/80 transition-colors hover:text-accent">
          RSS
        </a>
      </p>
    </div>
  );
}
