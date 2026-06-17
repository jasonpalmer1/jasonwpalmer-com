import { experience, education, credentials } from "@/data/profile";

export default function Resume() {
  return (
    <section id="log" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="label">// mission history</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
          CAMPAIGN LOG
        </h2>

        <ol className="mt-10 space-y-4">
          {experience.map((item, i) => {
            const active = /present/i.test(item.period);
            const id = String(experience.length - i).padStart(2, "0");
            return (
              <li key={i} className="hud rounded-xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-accent">
                    MSN-{id}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest ${
                      active
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-border bg-surface text-muted"
                    }`}
                  >
                    {active ? "● ACTIVE" : "✓ COMPLETE"}
                  </span>
                  <span className="ml-auto font-mono text-[0.65rem] text-muted">
                    {item.period}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {item.role}
                  </h3>
                  <span className="text-muted">@</span>
                  <span className="text-sm text-accent-2">{item.org}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Achievements */}
        <div className="mt-12">
          <p className="label">// achievements unlocked</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {credentials.map((c, i) => (
              <div key={`c-${i}`} className="hud flex gap-3 rounded-xl p-5">
                <span className="text-2xl" aria-hidden>
                  🏆
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-gold">
                    {c.name}
                  </h3>
                  {c.detail && (
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {c.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {education.map((e, i) => (
              <div key={`e-${i}`} className="hud flex gap-3 rounded-xl p-5">
                <span className="text-2xl" aria-hidden>
                  🎖️
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-accent-2">
                    {e.degree}
                    <span className="ml-2 font-mono text-[0.65rem] text-muted">
                      {e.year}
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-foreground/80">{e.school}</p>
                  {e.detail && (
                    <p className="mt-1 text-xs text-muted">{e.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
