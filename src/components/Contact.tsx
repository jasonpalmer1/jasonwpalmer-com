import { profile, socials } from "@/data/profile";

export default function Contact() {
  return (
    <section id="uplink" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="hud mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-12">
          <p className="label">// establish uplink</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-glow">
            CONTACT
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Building something, hiring, or want to talk shop? Open a channel.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-7 inline-block rounded-md border border-accent bg-accent/10 px-6 py-3 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background"
          >
            [ {profile.email} ]
          </a>
          <div className="mt-7 flex justify-center gap-5 font-mono text-xs text-muted">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="tracking-widest transition-colors hover:text-accent"
              >
                {s.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
