import { BookUp, CheckCircle2, GraduationCap, Sparkles, Wand2 } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CurriculumRequestForm } from "@/components/curriculum-request-form";

export const metadata = {
  title: "اطلب منهجك — نُعدّ أي منهاج مجاناً · أكاديمية الغزاوي",
  description:
    "أرسل لنا اسم منهجك الدراسي وكتبه، ونحوّلها إلى تجربة تفاعلية كاملة على المنصة — مجاناً.",
};

const STEPS = [
  {
    icon: BookUp,
    title: "أرسل منهجك",
    desc: "اسم البرنامج وعناوين كتبه (أو ملفاتها) عبر النموذج ثم واتساب.",
  },
  {
    icon: CheckCircle2,
    title: "نفحص ونحوّل",
    desc: "نتأكد أن الكتب سليمة وقابلة للقراءة، ثم نبني الفصول والملخصات والأسئلة.",
  },
  {
    icon: GraduationCap,
    title: "ادرس بكل الميزات",
    desc: "ملخصات بمستويات، كويزات، بطاقات، مراجعة ذكية، وشهادة إتمام.",
  },
];

export default function CustomCurriculumPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="size-3.5" />
          خدمة مجانية
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          نُعدّ لك أي منهاج دراسي
          <br />
          <span className="bg-gradient-to-l from-cyan-600 to-royal-700 bg-clip-text text-transparent">
            — مجاناً.
          </span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted max-w-2xl">
          عندك منهج جامعي أو برنامج دراسي وتريده بتجربة أكاديمية الغزاوي نفسها؟
          أرسل لنا اسمه وكتبه، وبعد فحصها نحوّلها إلى فصول وملخصات ذكية وآلاف
          الأسئلة والبطاقات — بالكامل وبلا مقابل.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="relative rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-600 to-cyan-500 text-white shadow-soft">
                <Icon className="size-5" />
              </div>
              <div className="absolute top-5 end-5 text-3xl font-black text-border/70">
                {i + 1}
              </div>
              <h3 className="mt-4 font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 mb-5 text-foreground">
            <Wand2 className="size-5 text-cyan-600" />
            <h2 className="text-xl font-black">نموذج الطلب</h2>
          </div>
          <CurriculumRequestForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
