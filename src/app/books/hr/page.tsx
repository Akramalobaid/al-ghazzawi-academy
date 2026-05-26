import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Construction, FileText, Layers } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "إدارة الموارد البشرية",
  description: "كتاب إدارة الموارد البشرية - أكاديمية الغزاوي",
};

export default function HRBookPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
          <ArrowLeft className="size-3" />
          <Link href="/books" className="hover:text-foreground transition-colors">الكتب</Link>
          <ArrowLeft className="size-3" />
          <span className="text-foreground font-medium">إدارة الموارد البشرية</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-700 via-royal-600 to-cyan-600 p-8 sm:p-12 text-white shadow-card">
          <div className="absolute top-0 end-0 size-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 start-0 size-48 bg-cyan-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <BookOpen className="size-3" />
              الكتاب الأول · MBA
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
              إدارة الموارد البشرية
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-medium text-white/80" dir="ltr">
              Human Resource Management
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <div className="text-2xl font-black">14</div>
                <div className="text-xs text-white/70 font-medium">فصل</div>
              </div>
              <div>
                <div className="text-2xl font-black">210</div>
                <div className="text-xs text-white/70 font-medium">سؤال</div>
              </div>
              <div>
                <div className="text-2xl font-black">210</div>
                <div className="text-xs text-white/70 font-medium">بطاقة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder notice */}
        <div className="mt-10 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Construction className="size-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-900">المحتوى قيد النقل</h2>
              <p className="mt-1.5 text-sm text-amber-800/90 leading-relaxed">
                المحتوى الكامل لهذا الكتاب موجود في النموذج الأولي وسيتم نقله إلى هذه المنصة في الجلسة القادمة.
                ستحصل على: ملخصات بـ3 مستويات لكل فصل، 30 سؤالاً تدريبياً، و30 فلاش كارد.
              </p>
            </div>
          </div>
        </div>

        {/* What's coming */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "الملخصات",
              desc: "ثلاثة مستويات: مكثف، عادي، مفصّل",
            },
            {
              icon: Layers,
              title: "الأسئلة",
              desc: "30 سؤالاً متدرجاً لكل فصل",
            },
            {
              icon: BookOpen,
              title: "الفلاش كاردز",
              desc: "بطاقات للمصطلحات الأساسية",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <Icon className="size-5 text-royal-700" />
              <h3 className="mt-3 font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-cyan-600 transition-colors"
          >
            <ArrowRight className="size-4" />
            رجوع للكتب
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
