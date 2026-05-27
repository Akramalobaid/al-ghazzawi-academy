import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, StickyNote } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { marketingBook, getChapterByNum } from "@/content/marketing";
import { NotesEditor } from "@/components/notes-editor";

export function generateStaticParams() {
  return marketingBook.chapters.map((c) => ({ chapter: String(c.num) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/books/marketing/[chapter]/notes">) {
  const { chapter } = await params;
  const ch = getChapterByNum(Number(chapter));
  if (!ch) return { title: "ملاحظات غير موجودة" };
  return {
    title: `ملاحظات: ${ch.title_ar}`,
    description: `ملاحظاتك الشخصية للفصل ${ch.num}`,
  };
}

export default async function ChapterNotesPage({
  params,
}: PageProps<"/books/marketing/[chapter]/notes">) {
  const { chapter } = await params;
  const ch = getChapterByNum(Number(chapter));
  if (!ch) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <nav className="flex items-center gap-2 text-sm text-muted mb-6 flex-wrap">
          <Link href="/books/marketing" className="hover:text-foreground transition-colors">
            التسويق
          </Link>
          <ArrowLeft className="size-3" />
          <Link
            href={`/books/marketing/${ch.num}`}
            className="hover:text-foreground transition-colors"
          >
            الفصل {ch.num}
          </Link>
          <ArrowLeft className="size-3" />
          <span className="text-foreground font-medium">الملاحظات</span>
        </nav>

        <div className="mb-6 flex items-start gap-3">
          <div className="size-11 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center shadow-card shrink-0">
            <StickyNote className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-violet-700 uppercase tracking-wider">
              الفصل {ch.num} · ملاحظات
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-foreground leading-tight">
              {ch.title_ar}
            </h1>
          </div>
        </div>

        <NotesEditor
          bookSlug="marketing"
          chapterNum={ch.num}
          chapterTitle={ch.title_ar}
        />
      </main>
      <Footer />
    </>
  );
}
