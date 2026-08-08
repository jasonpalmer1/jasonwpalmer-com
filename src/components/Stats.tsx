import { stats } from "@/data/profile";
import Counter from "@/components/Counter";

export default function Stats() {
  const n = stats.length;
  const smCols =
    n <= 2
      ? "sm:grid-cols-2"
      : n === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-4";

  return (
    <section className="border-y border-border bg-surface/40" aria-label="Key stats">
      <div
        className={`mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:divide-y-0 ${smCols}`}
      >
        {stats.map((s) => (
          <div key={s.label} className="px-5 py-6 text-center sm:py-8">
            <div className="font-display text-2xl font-bold text-accent text-glow sm:text-4xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="label mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
