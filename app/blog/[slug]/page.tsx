import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postFaqs } from "@/content/post-faqs";
import { site } from "@/content/site";
import { withHeadingIds } from "@/lib/toc";
import { getPostBySlug, getPosts } from "@/lib/webflow";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  // Set canonically here, together — see CLAUDE.md → AEO/GEO criterion 5.
  // Next.js does not deep-merge Open Graph fields from the parent layout,
  // so a page with its own `description` but no `openGraph` block would
  // silently inherit the site-wide generic OG description instead.
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.featuredImage ? [{ url: post.featuredImage.url, width: 1200, height: 675 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { html, toc } = withHeadingIds(post.body);
  const faqs = postFaqs[post.slug] ?? [];

  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
  };

  // Generated from the same `faqs` array rendered on-page below — one
  // source of truth, per CLAUDE.md → Technical SEO → Structured data
  // integrity. Never write FAQ text separately for the schema vs. the page.
  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }]} />

      <article className="mx-auto max-w-[48rem] px-6 py-xl sm:px-10 sm:py-2xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{post.category}</p>
          <h1 className="mt-sm text-3xl font-bold tracking-tight text-ink sm:text-4xl">{post.title}</h1>
          <p className="mt-md text-lg leading-relaxed text-muted">{post.excerpt}</p>
          <p className="mt-md text-sm text-muted">
            <span className="font-medium text-ink">{site.author.name}</span>
          </p>
        </header>

        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element -- static export, CMS-hosted asset
          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            width={1200}
            height={675}
            className="mt-lg aspect-video w-full rounded-card border border-rule object-cover"
          />
        )}

        {toc.length > 0 && (
          <nav aria-label="Table of contents" className="mt-xl rounded-card border border-rule bg-paper-2 p-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
            <ul className="mt-sm space-y-2">
              {toc.map((entry) => (
                <li key={entry.id} className={entry.level === 3 ? "ml-4" : ""}>
                  <a href={`#${entry.id}`} className="text-sm text-muted hover:text-accent">
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="prose-post mt-xl" dangerouslySetInnerHTML={{ __html: html }} />

        {faqs.length > 0 && (
          <div className="mt-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Frequently asked questions</h2>
            <div className="prose-post mt-md">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
