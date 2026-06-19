import { socials } from "@/data/profile";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="uplink" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="hud mx-auto max-w-2xl rounded-2xl p-8 sm:p-12">
          <p className="label text-center">// establish uplink</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-glow">
            CONTACT
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted">
            Building something or want to talk shop? Open a channel.
          </p>

          <ContactForm />

          <div className="mt-8 flex justify-center gap-5 font-mono text-xs text-muted">
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
