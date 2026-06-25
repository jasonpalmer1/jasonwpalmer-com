import Subscribe from "./Subscribe";

// Heading + the live Subscribe form, as one reusable CTA. Dropped at the bottom
// of the homepage and every blog page so a visitor can always get notified of
// new dispatches without hunting for it.
export default function SubscribeBlock() {
  return (
    <div className="text-center">
      <p className="label">// dispatch log</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-gradient">
        GET EVERY DISPATCH
      </h2>
      <p className="mx-auto mt-2 max-w-md font-mono text-sm text-muted">
        A new build log lands in your inbox each time I ship something. No spam,
        unsubscribe anytime.
      </p>
      <div className="mt-6">
        <Subscribe />
      </div>
    </div>
  );
}
