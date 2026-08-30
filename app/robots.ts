import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// See CLAUDE.md → AEO/GEO → Classic search discovery: verify this doesn't
// carry over a staging-environment disallow rule before launch.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
