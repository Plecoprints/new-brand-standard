import { site } from "@/content/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-2xl sm:px-10">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{site.name}</h1>
      <p className="mt-md max-w-[38rem] text-base leading-relaxed text-muted">
        {site.description}
      </p>
      <p className="mt-lg max-w-[38rem] text-sm leading-relaxed text-muted">
        Replace this homepage. Before writing real copy, read <code>CLAUDE.md</code> —
        specifically the Voice and AEO / GEO sections.
      </p>
    </div>
  );
}
