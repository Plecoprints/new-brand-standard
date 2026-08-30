import Link from "next/link";
import { site } from "@/content/site";

type Crumb = { label: string; href: string };

// Renders visible breadcrumbs + matching BreadcrumbList JSON-LD from the
// same list — one source feeding both, per CLAUDE.md → Technical SEO →
// Structured data integrity.
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { label: "Home", href: "/" },
      ...items,
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6 text-sm text-muted sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <Link href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
