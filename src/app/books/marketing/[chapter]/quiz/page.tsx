import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { marketingBook, getChapterByNum } from "@/content/marketing";
import { QuizRunner } from "@/components/quiz-runner";

export function generateStaticParams() {
  return marketingBook.chapters.map((c) => ({ chapter: String(c.num) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/books/marketing/[chapter]/quiz">) {
  const { chapter } = await params;
  const ch = getChapterByNum(Number(chapter));
  if (!ch) return { title: "كويز غير موجود" };
  return {
    title: `كويز: ${ch.title_ar}`,
    description: `${ch.quiz.length} سؤال اختيار من متعدد للفصل ${ch.num}`,
  };
}

export default async function QuizPage({
  params,
}: PageProps<"/books/marketing/[chapter]/quiz">) {
  const { chapter } = await params;
  const ch = getChapterByNum(Number(chapter));
  if (!ch) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
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
          <span className="text-foreground font-medium">الكويز</span>
        </nav>

        <div className="mb-6 flex items-start gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex items-center justify-center shadow-soft shrink-0">
            <Layers className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
              الفصل {ch.num} · كويز
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-foreground leading-tight">
              {ch.title_ar}
            </h1>
          </div>
        </div>

        <QuizRunner
          questions={ch.quiz}
          chapterNum={ch.num}
          hasNext={ch.num < marketingBook.chapters.length}
          hasPrev={ch.num > 1}
        />
      </main>
      <Footer />
    </>
  );
}
