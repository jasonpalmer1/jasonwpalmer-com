import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Tools from "@/components/Tools";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Lore from "@/components/Lore";
import Contact from "@/components/Contact";
import { profile, game } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Tools />
        <Skills />
        <Resume />
        <Lore />
        <Contact />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="pulse-dot" /> SYS.ONLINE · © {profile.name}
          </span>
          <span className="tracking-widest">
            {game.callsign} // {profile.domain} // BUILT WITH NEXT.JS × CLOUDFLARE
          </span>
        </div>
        <p className="pb-6 text-center font-mono text-[0.6rem] tracking-widest text-muted/40">
          psst — try ↑ ↑ ↓ ↓ ← → ← → B A
        </p>
      </footer>
    </>
  );
}
