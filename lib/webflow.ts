import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Server-only Webflow CMS reader. Never import this from a client component
// (see CLAUDE.md → Tech Stack → Webflow CMS). Reads from the build-time
// cache written by scripts/fetch-cms-content.mjs — draft/archived items are
// already excluded there, at the single point content enters the build.

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  body: string;
  featuredImage: { url: string; alt: string } | null;
};

export type Service = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  featuredImage: { url: string; alt: string } | null;
};

type WebflowItem = {
  id: string;
  fieldData: Record<string, unknown>;
};

async function readCache(file: string): Promise<WebflowItem[]> {
  try {
    const raw = await readFile(path.join(process.cwd(), ".webflow-cache", file), "utf-8");
    return JSON.parse(raw) as WebflowItem[];
  } catch {
    // No cache yet (fresh clone, CMS not configured) — build with zero
    // content rather than failing. Real content requires WEBFLOW_* env
    // vars and `npm run fetch:cms` (runs automatically before `next build`).
    return [];
  }
}

function toImage(field: unknown): { url: string; alt: string } | null {
  if (!field || typeof field !== "object") return null;
  const img = field as { url?: string; alt?: string };
  if (!img.url) return null;
  return { url: img.url, alt: img.alt ?? "" };
}

function toPost(item: WebflowItem): Post {
  const f = item.fieldData;
  return {
    slug: String(f.slug ?? ""),
    title: String(f.name ?? ""),
    excerpt: String(f.excerpt ?? ""),
    date: String(f.date ?? ""),
    category: String(f.category ?? ""),
    body: String(f["body-3"] ?? f.body ?? ""),
    featuredImage: toImage(f["featured-image-2"] ?? f["featured-image"]),
  };
}

function toService(item: WebflowItem): Service {
  const f = item.fieldData;
  return {
    slug: String(f.slug ?? ""),
    title: String(f.name ?? ""),
    excerpt: String(f.excerpt ?? ""),
    category: String(f.category ?? ""),
    body: String(f.body ?? ""),
    featuredImage: toImage(f["featured-image"]),
  };
}

export async function getPosts(): Promise<Post[]> {
  const items = await readCache("posts.json");
  return items.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  const items = await readCache("services.json");
  return items.map(toService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}
