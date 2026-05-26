import Link from "next/link";
import { Logo } from "./logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/books" className="text-muted hover:text-foreground transition-colors">
            الكتب
          </Link>
          <Link href="/#features" className="text-muted hover:text-foreground transition-colors">
            الميزات
          </Link>
          <Link href="/about" className="text-muted hover:text-foreground transition-colors">
            عن المنصة
          </Link>
        </nav>

        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          ابدأ التعلم
        </Link>
      </div>
    </header>
  );
}
