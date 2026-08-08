import { tools } from "@/data/tools";
import ToolsInventory from "./ToolsInventory";

export default function Tools() {
  return (
    <section id="builds" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="label">{"// inventory"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
              BUILDS
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {tools.length} UNLOCKED
          </span>
        </div>
        <ToolsInventory items={tools} />
      </div>
    </section>
  );
}
