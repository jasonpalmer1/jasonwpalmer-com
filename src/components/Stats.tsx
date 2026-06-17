import { stats } from "@/data/profile";
import Counter from "@/components/Counter";

export default function Stats() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
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
