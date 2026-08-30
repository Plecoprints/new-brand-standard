import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { site } from "@/content/site";
import { getPosts } from "@/lib/webflow";

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles from ${site.name}.`,
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div>
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <div className="mx-auto max-w-7xl px-6 py-xl sm:px-10">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Blog</h1>
        {posts.length === 0 ? (
          <p className="mt-md text-muted">
            No posts yet. Content is fetched from the CMS at build time — see CLAUDE.md → Tech
            Stack → Webflow CMS.
          </p>
        ) : (
          <ul className="mt-lg grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="rounded-card border border-rule bg-paper-2 p-lg">
                <Link href={`/blog/${post.slug}`} className="font-semibold text-ink hover:text-accent">
                  {post.title}
                </Link>
                <p className="mt-2xs text-sm text-muted">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
