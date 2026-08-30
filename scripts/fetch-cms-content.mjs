// Fetches raw Webflow CMS items at build time and caches them to
// .webflow-cache/*.json for lib/webflow.ts to read. Runs before `next build`
// (see package.json → "build" script) so all content is resolved once,
// at build time, never at request time — see CLAUDE.md → SSG constraints.
//
// If Webflow env vars aren't set (e.g. a fresh clone before the CMS is
// configured), this writes empty caches instead of failing the build.

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, "..", ".webflow-cache");

const TOKEN = process.env.WEBFLOW_API_TOKEN;
const POSTS_COLLECTION_ID = process.env.WEBFLOW_POSTS_COLLECTION_ID;
const SERVICES_COLLECTION_ID = process.env.WEBFLOW_SERVICES_COLLECTION_ID;

async function fetchAll(collectionId) {
  if (!TOKEN || !collectionId) return [];

  const items = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } },
    );
    if (!res.ok) {
      throw new Error(`Webflow fetch failed (${res.status}) for collection ${collectionId}`);
    }
    const data = await res.json();
    items.push(...data.items);
    if (items.length >= data.pagination.total) break;
    offset += limit;
  }

  // Never trust the API without an explicit check — draft items must be
  // excluded here, at the single point content enters the build, not
  // scattered across every page component. See CLAUDE.md → Webflow CMS.
  return items.filter((item) => !item.isDraft && !item.isArchived);
}

// With `output: "export"`, a dynamic route ([slug]) whose generateStaticParams
// resolves to zero paths fails the entire build — Next.js can't distinguish
// "generateStaticParams is missing" from "generateStaticParams returned
// nothing" (see app/blog/[slug]/page.tsx). A brand-new repo starts with an
// empty or unconfigured CMS, so `npm run build` would fail on day one
// without this. Seed exactly one real-shaped placeholder post so the
// pipeline — CMS fetch, TOC, FAQ schema, breadcrumbs — is provably working
// end to end. Delete this seed the moment the first real post exists;
// it's the demo/proof, not real content.
const PLACEHOLDER_POST = {
  id: "placeholder-post",
  isDraft: false,
  isArchived: false,
  fieldData: {
    slug: "hello-world",
    name: "Hello World — Replace This Post",
    excerpt:
      "This is a seeded placeholder proving the CMS pipeline works end to end. Delete it once the first real post is published — see CLAUDE.md.",
    date: new Date().toISOString(),
    category: "Placeholder",
    "body-3":
      "<p>This post was auto-seeded because no CMS content exists yet — see scripts/fetch-cms-content.mjs. It exists so <code>npm run build</code> succeeds on a fresh clone and so this page's FAQ schema, table of contents, and breadcrumbs can be checked against real rendered output before any real content is written.</p><h2>What to do next</h2><p>Set the WEBFLOW_* variables in .env.local, publish a real post in the CMS, then delete the PLACEHOLDER_POST constant in scripts/fetch-cms-content.mjs and the matching content/post-faqs.ts entry.</p><h2>Frequently asked questions</h2><h3>Why does this post exist?</h3><p>To prove the build pipeline actually works before any real content is written — see CLAUDE.md &rarr; Development Rules &rarr; Test before you respond.</p>",
    "featured-image-2": null,
  },
};

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });

  const [fetchedPosts, services] = await Promise.all([
    fetchAll(POSTS_COLLECTION_ID),
    fetchAll(SERVICES_COLLECTION_ID),
  ]);

  const posts = fetchedPosts.length > 0 ? fetchedPosts : [PLACEHOLDER_POST];
  if (fetchedPosts.length === 0) {
    console.warn(
      "No posts found in the CMS (or WEBFLOW_* env vars unset) — seeding one placeholder post so the build succeeds. See scripts/fetch-cms-content.mjs.",
    );
  }

  await writeFile(path.join(CACHE_DIR, "posts.json"), JSON.stringify(posts, null, 2));
  await writeFile(path.join(CACHE_DIR, "services.json"), JSON.stringify(services, null, 2));

  console.log(`Cached ${posts.length} item(s) for posts.`);
  console.log(`Cached ${services.length} item(s) for services.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
