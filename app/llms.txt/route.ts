import { site } from "@/content/site";
import { getPosts, getServices } from "@/lib/webflow";

// Auto-generated at build time from the same canonical excerpt field that
// feeds meta description and og:description — never a hand-maintained
// duplicate. See CLAUDE.md → AEO/GEO → llms.txt.
export const dynamic = "force-static";

export async function GET() {
  const [posts, services] = await Promise.all([getPosts(), getServices()]);

  const lines: string[] = [
    `# ${site.name}`,
    "",
    site.description,
    "",
    "## Blog",
    "",
    ...posts.map((post) => `- [${post.title}](${site.url}/blog/${post.slug}): ${post.excerpt}`),
    "",
    "## Services",
    "",
    ...services.map(
      (service) => `- [${service.title}](${site.url}/services/${service.slug}): ${service.excerpt}`,
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
