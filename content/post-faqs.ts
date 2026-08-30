export type Faq = {
  question: string;
  answer: string;
};

// Keyed by post slug. Kept separate from the CMS body copy so the FAQPage
// schema always matches exactly what the on-page FAQ section says — if you
// edit the FAQ text in the CMS, update the matching entry here too (see
// CLAUDE.md → Organisation Rules and → AEO/GEO → Structured data integrity).
//
// Before writing any entry here, read CLAUDE.md → AEO / GEO. Criterion 6
// (entity/brand clarity) is the one this file most commonly fails: every
// answer should name the brand explicitly, not "we/us/our".
export const postFaqs: Record<string, Faq[]> = {
  // Matches the placeholder post seeded by scripts/fetch-cms-content.mjs
  // when the CMS is empty — proves the FAQPage JSON-LD render path end to
  // end. Delete this entry alongside the placeholder once real content exists.
  "hello-world": [
    {
      question: "Why does this post exist?",
      answer:
        "To prove the build pipeline actually works before any real content is written — see CLAUDE.md → Development Rules → Test before you respond.",
    },
  ],
};
