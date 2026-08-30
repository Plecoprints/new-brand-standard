import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getPosts, getServices } from "@/lib/webflow";

// Auto-generated at build time from the same canonical content lists used
// to build the site — see CLAUDE.md → Technical SEO → sitewide requirements
// and → AEO/GEO → Classic search discovery.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([getPosts(), getServices()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: new Date() },
    { url: `${site.url}/blog`, lastModified: new Date() },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes, ...serviceRoutes];
}
