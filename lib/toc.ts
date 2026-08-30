export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

// Webflow's body HTML uses HTML entities (&mdash; etc.) that the browser
// decodes automatically when the heading is rendered via
// dangerouslySetInnerHTML, but the TOC entry text below is rendered as
// plain JSX text, so React escapes it a second time and the raw entity
// string shows up literally unless it's decoded here first.
// See CLAUDE.md → Technical SEO → Entity-encoding in generated plain text.
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  lsquo: "'",
  rsquo: "'",
  ldquo: '"',
  rdquo: '"',
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const codePoint =
        code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Injects an id="" into every h2/h3 in the HTML and returns a matching TOC list.
// Rich-text CMS exports don't add heading ids, so anchors need this pass.
export function withHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();

  const withIds = html.replace(
    /<h([23])(\s[^>]*)?>(.*?)<\/h[23]>/gi,
    (match, level: string, attrs: string | undefined, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, "").trim());
      let id = slugify(text) || `section-${toc.length + 1}`;

      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      toc.push({ id, text, level: Number(level) as 2 | 3 });
      return `<h${level} id="${id}"${attrs ?? ""}>${inner}</h${level}>`;
    },
  );

  return { html: withIds, toc };
}
