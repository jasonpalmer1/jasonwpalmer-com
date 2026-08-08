import { skills } from "@/data/profile";
import SkillRow from "./SkillRow";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="label">{"// loadout"}</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
          SKILL TREE
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skills.map((g) => (
            <SkillRow key={g.category} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}
