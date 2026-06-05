import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Cog,
  Cpu,
  FlaskConical,
  MessageCircle,
  Scale,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { LogoMark } from "@/components/logo";
import { TodayBanner } from "@/components/today-banner";
import { BOOKS, SPECIALIZATIONS, whatsappLink } from "@/lib/site";

const SPEC_ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  stethoscope: Stethoscope,
  cog: Cog,
  scale: Scale,
  cpu: Cpu,
  flask: FlaskConical,
};

const FEATURES = [
  {
    n: "٠١",
    title: "كتب أصلية كاملة",
    desc: "اقرأ الكتب الكاملة بصيغة PDF داخل المنصة — بلا تحميل أو خروج.",
  },
  {
    n: "٠٢",
    title: "ملخصات بثلاثة مستويات",
    desc: "مكثّف للمراجعة السريعة، عادي للفهم، ومفصّل للإتقان العميق.",
  },
  {
    n: "٠٣",
    title: "أسئلة متدرّجة",
    desc: "أكثر من ٣٠ سؤالاً لكل فصل على ثلاث درجات صعوبة، مع الشرح.",
  },
  {
    n: "٠٤",
    title: "بطاقات بتكرار متباعد",
    desc: "مصطلحات عربية وإنجليزية بخوارزمية SM-2 لترسيخ الحفظ.",
  },
  {
    n: "٠٥",
    title: "مراجعة ذكية وتتبّع",
    desc: "لوحة تقدّم، خطة دراسة، وشارات — تعرف أين أنت بالضبط.",
  },
  {
    n: "٠٦",
    title: "تعمل بلا إنترنت",
    desc: "ثبّتها كتطبيق (PWA) وادرس في أي وقتٍ ومكان.",
  },
];

const STATS = [
  { k: "كتب أصلية", v: "3" },
  { k: "فصلاً دراسياً", v: "40+" },
  { k: "سؤال تدريبي", v: "1000+" },
  { k: "بطاقة ذكية", v: "1000+" },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <TodayBanner />

        {/* HERO — editorial, asymmetric */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute -start-40 -top-28 opacity-[0.09]">
            <LogoMark className="size-[640px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 gradient-radial-hero" />
          <div className="pointer-events-none absolute top-0 end-8 size-[26rem] rounded-full bg-amber-200/25 blur-3xl -translate-y-1/3" />

          <div className="relative rise-in mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-20 sm:pt-28 sm:pb-24">
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-amber-600">
              <span className="h-px w-10 bg-cyan-500/50" />
              تخصصات جامعية · بالعربية
            </div>

            <h1 className="mt-8 max-w-4xl text-[2.75rem] leading-[1.05] sm:text-7xl sm:leading-[1.03] font-black tracking-tight text-foreground">
              أتقِن <span className="text-cyan-500">تخصصك</span> بعقلٍ عربي،
              <br />
              <span className="text-muted">بأدواتٍ لا تجدها في مكانٍ آخر.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg sm:text-xl text-muted leading-relaxed">
              كتب أصلية كاملة، ملخصات بثلاثة مستويات، وآلاف الأسئلة والبطاقات
              الذكية — في منصةٍ واحدةٍ تعمل حتى بلا إنترنت. نبدأ بإدارة الأعمال،
              ونتوسّع نحو كل التخصصات الجامعية.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/books/hr/1"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background h-12 px-7 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                جرّب الفصل المجاني
                <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={whatsappLink(
                  "السلام عليكم، أرغب بالحصول على كود تفعيل لأكاديمية الغزاوي.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border h-12 px-7 text-sm font-bold text-foreground hover:border-foreground/40 transition-colors"
              >
                <MessageCircle className="size-4" />
                احصل على كود
              </a>
            </div>

            {/* stats — ruled grid, not centered cards */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70">
              {STATS.map((s) => (
                <div key={s.k} className="bg-background px-5 py-6">
                  <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums">
                    {s.v}
                  </div>
                  <div className="mt-1.5 text-xs text-muted font-mono">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES — editorial numbered list */}
        <section id="features" className="py-20 sm:py-28 border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-lg leading-tight">
                كل ما تحتاجه لإتقان تخصصك — في مكانٍ واحد.
              </h2>
              <p className="text-xs text-muted font-mono tracking-widest">
                ٦ أدوات / منصة واحدة
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {FEATURES.map((f) => (
                <div key={f.n} className="group border-t-2 border-border pt-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-cyan-500">{f.n}</span>
                    <span className="h-px flex-1 bg-transparent group-hover:bg-cyan-500/30 transition-colors" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SPECIALIZATIONS */}
        <section className="py-20 sm:py-28 border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12">
              <div className="text-xs font-mono tracking-widest text-amber-600 mb-3">
                التخصصات
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                منصةٌ لكل تخصص،
                <br />
                <span className="text-muted">نبدأ بإدارة الأعمال.</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SPECIALIZATIONS.map((s) => {
                const Icon = SPEC_ICONS[s.icon];
                const inner = (
                  <>
                    <div className="flex items-start justify-between mb-10">
                      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-royal-50 to-cyan-50 ring-1 ring-cyan-100 text-royal-700">
                        <Icon className="size-5" />
                      </span>
                      {s.status === "ready" ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-500 font-mono">
                          <span className="size-1.5 rounded-full bg-cyan-400" />
                          متاح
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-muted font-mono">
                          قريباً
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {s.title_ar}
                    </h3>
                    <p className="mt-1 text-sm text-muted font-mono" dir="ltr">
                      {s.title_en}
                    </p>
                  </>
                );
                return s.status === "ready" ? (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 hover:border-cyan-500/40 transition-colors"
                  >
                    {inner}
                    <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end text-xs">
                      <span className="inline-flex items-center gap-1 text-foreground font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        تصفّح
                        <ArrowLeft className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={s.slug}
                    className="relative overflow-hidden rounded-2xl border border-dashed border-border/70 bg-card/50 p-6"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-sm text-muted">
              تخصصك ليس هنا بعد؟{" "}
              <Link
                href="/custom-curriculum"
                className="font-semibold text-cyan-600 hover:underline"
              >
                اطلبه ونُعدّه لك مجاناً.
              </Link>
            </p>
          </div>
        </section>

        {/* BOOKS */}
        <section className="py-20 sm:py-28 border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
              <div>
                <div className="text-xs font-mono tracking-widest text-amber-600 mb-3">
                  إدارة الأعمال · المكتبة
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                  ثلاثة كتب متاحة،
                  <br />
                  <span className="text-muted">واثنان في الطريق.</span>
                </h2>
              </div>
              <Link
                href="/books"
                className="inline-flex items-center gap-1.5 text-sm font-mono text-muted hover:text-cyan-500 transition-colors"
              >
                عرض الكل
                <ArrowLeft className="size-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BOOKS.map((book, idx) => (
                <Link
                  key={book.slug}
                  href={book.status === "ready" ? `/books/${book.slug}` : "/books"}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-10">
                    <span className="font-mono text-2xl font-black text-muted/50 group-hover:text-cyan-500/70 transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {book.status === "ready" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 font-mono">
                        <span className="size-1.5 rounded-full bg-cyan-400" />
                        متاح
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-muted font-mono">
                        قريباً
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {book.title_ar}
                  </h3>
                  <p className="mt-1 text-sm text-muted font-mono" dir="ltr">
                    {book.title_en}
                  </p>
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted">
                      {book.chapters > 0
                        ? `${book.chapters} فصلاً`
                        : "قيد الإعداد"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-foreground font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      ادخل
                      <ArrowLeft className="size-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOM CURRICULUM PROMO */}
        <section className="py-20 sm:py-28 border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-br from-cyan-50 via-card to-amber-50/60 p-8 sm:p-12">
              <div className="pointer-events-none absolute top-0 end-0 size-72 bg-amber-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
              <div className="relative sm:flex items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="text-xs font-mono tracking-widest text-amber-600 mb-4">
                    خدمة مجانية
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black leading-tight text-foreground">
                    عندك منهجٌ آخر؟ نُعدّه لك مجاناً.
                  </h2>
                  <p className="mt-3 text-muted leading-relaxed">
                    أرسل اسم منهجك وكتبه، وبعد فحصها نحوّلها إلى فصولٍ وملخصاتٍ ذكية
                    وآلاف الأسئلة — بتجربة أكاديمية الغزاوي نفسها.
                  </p>
                </div>
                <Link
                  href="/custom-curriculum"
                  className="mt-6 sm:mt-0 inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground text-background h-12 px-7 text-sm font-bold hover:bg-cyan-500 hover:text-navy transition-colors"
                >
                  اطلب منهجك
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="text-xs font-mono tracking-widest text-amber-600 mb-5">
              ابدأ الآن
            </p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
              جرّب قبل أن تشترك.
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-xl">
              الفصل الأول من إدارة الموارد البشرية متاحٌ مجاناً بالكامل — جرّبه
              الآن، ثم فعّل بقية الكتب والفصول بكود تفعيل.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/books/hr/1"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background h-12 px-7 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                جرّب الفصل المجاني
                <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={whatsappLink(
                  "السلام عليكم، أرغب بالحصول على كود تفعيل لأكاديمية الغزاوي.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border h-12 px-7 text-sm font-bold text-foreground hover:border-foreground/40 transition-colors"
              >
                <MessageCircle className="size-4" />
                احصل على كود
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
