# Project Overview

A Next.js site optimised for SEO/AEO/GEO. Pages are pre-rendered to static HTML at build time.

This file bakes in lessons earned building a prior brand in this portfolio through to a full-site AI-citation audit. Every non-obvious rule below traces to a real bug that shipped and got fixed — not theoretical best practice. Follow them from the first commit.

---

# Voice — read before writing any content

When writing **any blog post, service page, or customer-facing copy**, read the files in `./references/`:

| File | What it is |
|------|-----------|
| `references/voice.md` | Writing style, sentence rhythm, vocabulary, formatting, anti-patterns |
| `references/humour.md` | How the brand handles humour |
| `references/stats.md` | Canonical real numbers — pricing, response times, jobs, reviews |
| `references/stories.md` | Recurring anecdotes the brand uses |
| `references/opinions.md` | Hot takes and strong opinions backed by numbers |

**Content rules:**

- Never use AI-tell phrases (e.g. "unlock", "leverage", "seamless", "world-class", "in today's fast-paced world"), exclamation marks, or emojis
- Start with the answer; add context after
- Use real numbers from `stats.md`, never round
- One story per post max (from `stories.md`, don't invent new ones)
- One strong opinion per post max (from `opinions.md`, backed by a number)
- Tell people when NOT to hire you — biggest voice tell

Before shipping any writing, re-read `references/voice.md` → "Tells that it's AI-written" and delete anything that matches.

---

# On-page SEO

When generating or editing a blog post, read `on-page-seo.md` at the root. Every item applicable to the page type must be satisfied.

Required for every long-form post:
- FAQ section with FAQPage schema (JSON-LD) — **and the on-page FAQ text and the JSON-LD text must be generated from the same source field.** Never hand-copy the same Q&A into two places (see AEO/GEO → Structured data parity below); it will drift.
- Breadcrumbs + BreadcrumbList schema
- Author byline + Person schema
- Table of contents with anchor links
- 3–5 internal links, 2–3 external links to authoritative sources
- Open Graph + Twitter Card meta
- Length within 20% of SERP top-3 for the target keyword

**Before publishing, run the full AEO/GEO checklist below** — this is a separate pass from the schema/structure checklist above, checking whether the content itself survives being extracted out of context by an AI answer engine.

---

# AEO / GEO

A page can satisfy every item in On-page SEO above and still fail here — these are content-quality failures, not markup failures, and they're invisible to a human reading the page top-to-bottom. Audit every new or materially edited page against all seven before it ships.

1. **Standalone openings** — the first paragraph must fully make sense lifted alone: no pronoun with an antecedent outside the paragraph, no "as mentioned above." *Audit: copy only paragraph one into a blank doc and read it as the whole artifact.*
2. **FAQ self-containment** — every FAQ answer becomes an independently-citable JSON-LD entity with zero surrounding page context. No "as shown above," no "our other plans." *Audit: read each Q&A pair as if it's the only content on the page.*
3. **Fact precision and attributability** — every number/price/stat sits in or beside the sentence naming it, and belongs to the entity the sentence claims. Never anchor a fact to a *different* entity's number with a hedge sentence elsewhere — if the hedge gets stripped on extraction (it will), the wrong number reads as true. State the correct entity's own number directly instead. *Audit: if this sentence were extracted alone, does its number belong to the exact thing the sentence claims?*
4. **One idea per paragraph** — no splitting one point across two paragraphs with something unrelated wedged between them, no two paragraphs both restating the same closing point. *Audit: list each paragraph's single takeaway in order; duplicates or mismatches mean restructure.*
5. **Excerpt / meta-description quality** — the excerpt field typically feeds three consumers at once: `<meta name="description">`, `og:description`, and `llms.txt`. Set the page's `description` and its `openGraph` block **explicitly, together, every time** — Next.js does not deep-merge OG fields from a parent layout, so a page with its own `description` but no `openGraph` block silently inherits the site-wide generic OG description. *Audit: inspect the actual rendered `<meta name="description">` and `<meta property="og:description">` in page source, not just the CMS field.*
6. **Entity/brand clarity — the single most commonly missed criterion.** Any standalone-extractable chunk (FAQ answer, pricing line, checklist item, opening paragraph) must name the brand explicitly, not "we/us/our." A pronoun-only answer is unattributable once extracted with zero surrounding page. **Target: 90%+ of FAQ answers name the brand.** *Audit: pull every FAQ answer into a list with no other context; does each sentence, read alone, identify which company it's about? Count the pass rate.*
7. **Natural question phrasing** — FAQ questions read like a real spoken/typed query, not a stiff keyword-driven heading. *Audit: read each question aloud.*

**Fixing criterion 6 at scale, without creating a new problem**: the naive fix — prepending "BrandName's" to every answer — is itself spammy over-optimization.
- Vary insertion pattern: subject-first ("BrandName's X…"), verb-first ("BrandName handles…"), mid-sentence ("…with BrandName"), noun-modifier ("the BrandName team").
- Never trust a drafting agent's self-report of variety — it will claim it varied regardless of whether it did.
- Verify by script: count what % of answers start with the brand name as the literal first word. Keep that a clear minority (roughly 15–20%, not a hard target — the actual rule is "minority, not majority") even though the brand should appear *somewhere* in ~100% of answers.

**Internal linking**: natural, contextually relevant anchor text, never exact-match stuffing. Hard ceiling of **2–3 uses of any identical exact anchor phrase sitewide** — track this as new links are added. When counting, scope the search to text inside `<a href>` tags only; a naive substring search over full page text over-counts by also matching headings and bold text.

**Cannibalization**: before publishing, check the new page's primary target query against every already-published page's target query. Overlap counts as substantial if the phrases are identical/near-synonyms or a search for the new query would plausibly surface the existing page. Consolidate, differentiate, or don't publish.

**Phrasing collisions across similar pages**: facts/prices/checklists may repeat verbatim — that's correct. Sentence *construction* explaining them must be independently worded per page. When checking a new draft against an existing page, always fetch that page's actual current live text to compare against — never check from memory or a summary, which has already abstracted away the exact phrasing that would reveal a collision.

**`llms.txt`**: auto-generate at build time from the same canonical excerpt field used for meta/OG description (item 5). Never hand-maintain a separate copy — it will drift stale the first time an excerpt is edited.

---

# Technical SEO

Site-wide:
- `app/sitemap.ts` — auto-generated sitemap covering all routes
- `app/robots.ts` — allows all crawlers, points to sitemap; verify it doesn't carry over a staging-environment disallow rule
- Canonical URLs on every page (via `metadata.alternates.canonical`)
- Open Graph images (1200×630) — `/public/og/*.png`
- Image width/height attributes for CLS
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Static pre-rendering — `output: 'export'`
- Mobile viewport — set in `app/layout.tsx`
- Any retired/renamed/merged URL gets a redirect to its replacement, set at time of publish and verified live — this applies directly whenever cannibalization prevention (above) leads to consolidating one page into another

**Structured data integrity**:
- Any JSON-LD must be generated from the exact same content that's actually rendered and visible — one canonical source feeding both, never hand-duplicated into two places.
- **Well-formed JSON-LD is not proof the content is displayed.** It's possible to ship a fully valid FAQ schema block for a section that was never actually wired into the page's UI. After adding or editing any structured data, load the actual rendered page (or fetch and inspect the HTML) and confirm a human would see the same content — validating that the JSON-LD parses is not sufficient.

**Entity-encoding in generated plain text**: any code that strips HTML tags to produce plain text for a different context — an auto-generated TOC from headings, a plain-text excerpt from HTML body — must also decode HTML entities (`&mdash;`, `&amp;`, `&rsquo;`) at that step. If tags are stripped but entities left encoded, and the string then lands in an auto-escaping context (JSX text node), the entity gets encoded a second time and renders literally (`&mdash;` shown as text instead of an em dash) instead of the intended character.

**Image assets**: request compression + max-dimension on the *first* fetch from any external asset API, never as a "resize later" follow-up — that step reliably gets skipped. Check `content-length` via HTTP HEAD both before and after publishing, every time, as a required publish step, not something deferred to a page-speed audit tool catching it after the fact.

---

# Design

Premium, modern, elegant. Subtle animations, proper spacing, clear visual hierarchy. No emoji icons. No generic gradients. One accent colour (pick one and stick to it).

---

# Development Rules

**Rule 1: Always read first** — before any action, read `CLAUDE.md`.

**Rule 2: Define before you build** — no code before spec approval.

**Rule 3: Look before you create** — check existing files before creating new ones.

**Rule 4: Test before you respond** — run `npm run build` before saying "done".

**Rule 5: Verify, don't trust** — treat any agent's self-reported count, status, or "done" claim as a claim to check, not a fact to record. This cuts both ways: a confidently-reported number can be independently re-checked and found wrong, and a task reported as failed/timed-out can turn out, on direct inspection, to have actually completed. For anything countable — occurrence counts, draft/published status, whether a build passed, whether a deploy is live — run the independent check yourself (grep, API call, direct fetch) before treating it as settled.

**Rule 6: Batch large edits, then verify once, in aggregate** — for a fix applied identically across many files, split into batches of roughly 5–10, brief every batch identically (with a correct reference example if one exists), then run one independent cross-batch check after all batches complete, looking specifically for every batch converging on the same repetitive pattern independently — no single batch agent can see what the others produced.

**Core Rule** — do exactly what is asked. Nothing more, nothing less.

---

# Agent Deployment

Default to this for any task beyond a trivial one-file fix — not just when something has already gone wrong. This is how work on this project gets done, not a fallback process.

1. **Name the outcome, not the steps.** State what "done" looks like and how it will be proven (a passing build, a live-fetched page, a specific checklist cleared) before deciding how to get there. A concrete done-bar produces a better result than a step-by-step instruction.
2. **Cast a team, not a soloist.** One agent drafting alone is a contractor; pair a builder with a critic — a drafting agent plus a Reality Checker, Code Reviewer, or the AEO/GEO checklist above — so nothing ships on a single agent's unverified say-so.
3. **Loop until it's tested.** "It compiles" is not done. Exit the loop on evidence: a real build, a live HTTP fetch, a browser check, an adversarial review pass — not an agent's claim that it's finished.
4. **Feed it context.** Point at this file, the relevant existing pages/patterns, and the specific constraints up front. Five minutes of context beats fifty prompts of correction.
5. **Start with one, then scale.** Prove a new pattern on a single page or file before batching it across many (see Rule 6 above for the batch-and-verify pattern once proven).

---

# Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js 15 (App Router)
- **Rendering:** Static Site Generation via `output: 'export'`. `out/` is the deployable.
- **Styling:** Tailwind CSS
- **Content:** Blog posts and services are fetched from Webflow CMS (Data API v2) at build time. Site-wide config (name, nav, taglines) stays in flat TypeScript files in `/content/*.ts`.
- **Deployment:** Vercel

**Webflow CMS:**
- Credentials live in `.env.local` (gitignored) — see `.env.example` for the required variables.
- Fetch collection items in a server-only helper (e.g. `lib/webflow.ts`), called from `generateStaticParams` / server components. Never call it from a client component.
- Default `fetch` caching (no options, or `{ cache: 'force-cache' }`) is correct here — it resolves once at build time.
- **New items are created as drafts by default**, even when the request doesn't explicitly say so, and the site's own fetch layer filters drafts out silently — the API call can succeed and the item still be invisible on the live site. After creating any item, explicitly PATCH it to published, then verify with a fresh fetch using the same query the live site uses (not just confirming the item exists in Webflow's own listing).
- Build-time fetching means the live site is a snapshot: any CMS-only change (new post, edited body, swapped image) needs a fresh deploy to go live, even though Webflow shows it saved immediately. If there's no code change to trigger a rebuild, force one (e.g. `git commit --allow-empty`), and verify the change is actually live with a real HTTP fetch afterward — never assume from a green pipeline or a "saved" state in the CMS.

**SSG constraints — do NOT break these:**
- No `cookies()`, `headers()`, or `searchParams` in server components
- No `fetch(..., { cache: 'no-store' })` or `export const dynamic = 'force-dynamic'`
- No runtime API routes
- Dynamic routes (`[slug]`) must implement `generateStaticParams`
- All data fetched at **build time**, not request time

---

# Running the Project

1. `npm install`
2. `npm run dev` — opens on `http://localhost:3000`
3. To ship: `npm run build` → the `out/` directory is the deployable site

---

# Organisation Rules

- One component per file
- Shared components live in `/components/`
- Site-wide config (non-CMS) lives in `/content/*.ts`
- Webflow CMS fetch helpers live in `/lib/`
- FAQ Q&A text lives in exactly one place per content type (e.g. `/content/post-faqs.ts`), feeding both the visible render and the JSON-LD — never duplicated by hand into the CMS body and a separate schema block
- Don't create new top-level folders without asking

---

# Testing

Before marking any task done:
- `npm run build` completes with no errors
- Every route shows `○ (Static)` in the build log
- **View-source check:** the HTML contains the actual rendered content and any JSON-LD schema — and for any page with FAQ schema, confirm the visible FAQ text and the JSON-LD text actually match (a valid schema block with no matching visible section is a real bug class, not a hypothetical one)
- **Voice check** (for content changes): re-read `references/voice.md` → "Tells that it's AI-written" and delete anything that matches.
- **AEO/GEO check** (for any new/edited page): run the checklist in the AEO/GEO section above — brand-naming pass rate, fact-anchoring, meta/OG parity
- **Image check** (for any new image asset): confirm `content-length` via HEAD request is compressed, not the original full-resolution fetch

Never say "done" if the build is failing, there are console errors, the voice reads as AI, the AEO/GEO checklist hasn't been run on new content, or the feature hasn't been tested in the browser.

---

# Scope

Only build what's requested. If anything is unclear, ask before starting.
