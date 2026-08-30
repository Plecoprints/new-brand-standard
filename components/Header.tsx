import Link from "next/link";
import { site } from "@/content/site";

export default function Header() {
  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/blog" className="hover:text-ink">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
