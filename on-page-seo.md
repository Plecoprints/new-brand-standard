# On-page SEO checklist

Read this whenever generating or editing a blog post — see `CLAUDE.md` → On-page SEO. Every item applicable to the page type must be satisfied before publish.

## Every long-form post

- [ ] FAQ section with FAQPage schema (JSON-LD), generated from the same `content/post-faqs.ts` entry rendered on-page — not hand-duplicated
- [ ] Breadcrumbs + BreadcrumbList schema (`components/Breadcrumbs.tsx`)
- [ ] Author byline + Person schema
- [ ] Table of contents with anchor links (`lib/toc.ts`)
- [ ] 3–5 internal links, contextually relevant, respecting the 2–3-use anchor-phrase ceiling (see `CLAUDE.md` → AEO/GEO → Internal linking)
- [ ] 2–3 external links to authoritative sources
- [ ] Open Graph + Twitter Card meta, set explicitly on the page (see `CLAUDE.md` → AEO/GEO criterion 5)
- [ ] Length within 20% of SERP top-3 for the target keyword

## Then, separately: the AEO/GEO checklist

The above is a structure/markup checklist. It says nothing about whether the *content itself* survives being extracted out of context by an AI answer engine. Run the full 7-criterion AEO/GEO checklist in `CLAUDE.md` before publishing — it is a separate, required pass, not covered by the items above.
