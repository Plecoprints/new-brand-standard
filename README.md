# New Brand Standard

Starting scaffold for a new brand's website: Next.js 15 (App Router, static export), Tailwind CSS, and a headless CMS content pipeline, wired up with every AEO/GEO and technical lesson from a prior project's full build-out baked in from day one.

**Start here: read `CLAUDE.md`.** It's the operating manual for this repo — voice, on-page SEO, the 7-criterion AEO/GEO framework, technical constraints, and the agent-deployment approach for any non-trivial task. Every non-obvious rule in it traces to a real bug that shipped and got fixed on a prior project, not theoretical best practice.

## Before you start

1. Rename the brand: `content/site.ts`
2. Pick the real accent color: `app/globals.css` → `--color-accent`
3. Fill in `references/voice.md`, `humour.md`, `stats.md`, `stories.md`, `opinions.md` — real brand voice and real numbers, not placeholders
4. Set up the CMS: copy `.env.example` to `.env.local`, fill in real Webflow credentials, then prove the draft/publish flow end-to-end once deliberately (see `CLAUDE.md` → Tech Stack → Webflow CMS) before trusting it on real content
5. Read `CLAUDE.md` → AEO / GEO in full before the first piece of content ships — it's a required pass, not optional polish

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # fetches CMS content, then builds — out/ is the deployable site
```

## Notes on this scaffold

- **Placeholder post**: `scripts/fetch-cms-content.mjs` seeds one placeholder post (`/blog/hello-world`) when the CMS returns zero real posts — a dynamic route with `generateStaticParams()` resolving to zero paths fails the entire `output: export` build, and a fresh repo starts with an empty CMS. The seed proves the FAQ schema / TOC / breadcrumbs pipeline renders correctly before any real content exists. Delete the `PLACEHOLDER_POST` constant and its matching `content/post-faqs.ts` entry once the first real post is published.
- **Dependency versions**: pinned to a patched Next.js release (a critical RCE affects `next@15.5.2` and earlier — see `npm audit`). One remaining high-severity advisory (PostCSS, bundled transitively inside Next's own build tooling) only resolves on a Next 16 major upgrade — a deliberate call to leave for later rather than force an unplanned breaking change into a starter scaffold. Re-run `npm audit` before launch.
