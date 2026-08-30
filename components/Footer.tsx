import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted sm:px-10">
        &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
