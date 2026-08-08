import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Tools from "@/components/Tools";
import Platforms from "@/components/Platforms";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Lore from "@/components/Lore";
import Contact from "@/components/Contact";
import SubscribeBlock from "@/components/SubscribeBlock";
import SiteFooter from "@/components/SiteFooter";
import BootSequence from "@/components/BootSequence";
import { profile } from "@/data/profile";
import { tools } from "@/data/tools";

export default function Home() {
  return (
    <>
      {/* buildCount only — never import tools[] into the client BootSequence */}
      <BootSequence name={profile.name} buildCount={tools.length} />
      <Nav />
      <main id="main" className="flex-1">
        <Hero />
        <Stats />
        <Tools />
        <Platforms />
        <Skills />
        <Resume />
        <Lore />
        <Contact />
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SubscribeBlock />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
