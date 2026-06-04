import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, FileText, Layers, Sparkles } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  BookProgressSummary,
  ChapterProgress,
} from "@/components/chapter-progress";
import { ActivityLockBadge } from "@/components/activity-lock-badge";
import { getBook, bookSlugs, bookOrdinalLabel } from "@/lib/books";

export function generateStaticParams() {
  return bookSlugs().map((book) => ({ book }));
}

export async function generateMetadata({ params }: PageProps<"/books/[book]">) {
  const { book } = await params;
  const b = getBook(book);
  if (!b) return { title: "كتاب غير موجود" };
  const totalQuestions = b.chapters.reduce((s, c) => s + c.quiz.length, 0);
  const totalFlashcards = b.chapters.reduce((s, c) => s + c.flashcards.length, 0);
  return {
    title: b.title_ar,
    description: `كتاب ${b.title_ar} - ${b.chapters.length} فصل، ${totalQuestions} سؤال، ${totalFlashcards} فلاش كارد`,
  };
}

export default async function BookPage({ params }: PageProps<"/books/[book]">) {
  const { book } = await params;
  const b = getBook(book);
  if (!b) notFound();

  const totalQuestions = b.chapters.reduce((s, c) => s + c.quiz.length, 0);
  const totalFlashcards = b.chapters.reduce((s, c) => s + c.flashcards.length, 0);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            الرئيسية
          </Link>
          <ArrowLeft className="size-3" />
          <Link href="/books" className="hover:text-foreground transition-colors">
            الكتب
          </Link>
          <ArrowLeft className="size-3" />
          <span className="text-foreground font-medium">{b.title_ar}</span>
        </nav>

        <div className="rise-in border-b border-border/60 pb-10">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-amber-600">
            <span className="h-px w-8 bg-amber-500/60" />
            {bookOrdinalLabel(book)} · MBA
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-foreground">
            {b.title_ar}
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-muted font-mono" dir="ltr">
            {b.title_en}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <div className="text-2xl font-black text-foreground tabular-nums">
                {b.chapters.length}
              </div>
              <div className="text-xs text-muted font-mono">فصلاً</div>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground tabular-nums">
                {totalQuestions}
              </div>
              <div className="text-xs text-muted font-mono">سؤالاً</div>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground tabular-nums">
                {totalFlashcards}
              </div>
              <div className="text-xs text-muted font-mono">بطاقة</div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/books/${book}/read`}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <BookOpen className="size-4" />
              اقرأ الكتاب الأصلي
            </Link>
            <Link
              href="#chapters"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground hover:border-foreground/40 transition-colors"
            >
              <Layers className="size-4" />
              تصفّح الفصول
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <BookProgressSummary
            bookSlug={book}
            totalChapters={b.chapters.length}
          />
        </div>

        <div id="chapters" className="mt-10 flex items-center justify-between mb-6 scroll-mt-20">
          <div>
            <h2 className="text-2xl font-black text-foreground">الفصول</h2>
            <p className="mt-1 text-sm text-muted">اختر فصلاً لبدء الدراسة</p>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 rounded-full px-3 py-1 ring-1 ring-cyan-200">
            <Sparkles className="size-3" />
            {b.chapters.length} فصل متاح
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {b.chapters.map((ch) => (
            <Link
              key={ch.slug}
              href={`/books/${book}/${ch.num}`}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-soft hover:shadow-card hover:border-cyan-300/60 transition-all"
            >
              <ActivityLockBadge bookSlug={book} chapterNum={ch.num} />
              <div className="flex items-start gap-4">
                <div className="size-12 shrink-0 rounded-xl border border-border bg-background font-mono text-lg font-black flex items-center justify-center text-amber-600">
                  {String(ch.num).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground leading-snug group-hover:text-royal-700 transition-colors">
                    {ch.title_ar}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted font-medium truncate" dir="ltr">
                    {ch.title_en}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-muted font-medium">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="size-3" />
                      ملخص
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Layers className="size-3" />
                      {ch.quiz.length} سؤال
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {ch.flashcards.length} كارد
                    </span>
                  </div>
                  <ChapterProgress bookSlug={book} chapterNum={ch.num} />
                </div>
                <ArrowLeft className="size-4 text-muted group-hover:text-royal-700 group-hover:-translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="size-4 rotate-180" />
            رجوع للكتب
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
