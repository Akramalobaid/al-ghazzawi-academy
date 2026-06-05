export const SITE = {
  name: {
    ar: "أكاديمية الغزاوي",
    en: "Al-Ghazzawi Academy",
  },
  tagline: {
    ar: "منصة تعليمية متكاملة لكل التخصصات الجامعية بالعربية",
    en: "An integrated Arabic learning platform for every university discipline",
  },
  description: {
    ar: "ادرس تخصصك الجامعي بالعربية: كتب أصلية، ملخصات بثلاثة مستويات، آلاف الأسئلة، فلاش كاردز، وتتبع تقدمك. نبدأ بإدارة الأعمال ونتوسّع نحو كل التخصصات.",
    en: "Study your university major in Arabic: original books, three-level summaries, thousands of questions, flashcards, and progress tracking. Starting with Business, expanding to every discipline.",
  },
  url: "https://al-ghazzawi-academy.vercel.app",
  author: {
    name: "Akram",
    url: "https://github.com/Akramalobaid",
  },
  contact: {
    // ✅ القناة الحقيقية الوحيدة حالياً — واتساب
    whatsapp: "963968612861", // أرقام فقط (لرابط wa.me)
    whatsappDisplay: "+963 968 612 861",
    // 🎭 قنوات شكلية (غير مفعّلة بعد) — للإيحاء باتساع وسائل التواصل، تُفعّل لاحقاً
    email: "info@alghazzawi-academy.com",
    telegram: "AlGhazzawiAcademy",
    instagram: "alghazzawi.academy",
  },
} as const;

/** Build a wa.me link to the academy's WhatsApp, optionally with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const BOOKS = [
  {
    slug: "hr",
    title_ar: "إدارة الموارد البشرية",
    title_en: "Human Resource Management",
    chapters: 14,
    status: "ready",
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "marketing",
    title_ar: "التسويق",
    title_en: "Marketing",
    chapters: 14,
    status: "ready",
    color: "from-purple-500 to-pink-500",
  },
  {
    slug: "management",
    title_ar: "مبادئ الإدارة",
    title_en: "Management Principles",
    chapters: 12,
    status: "ready",
    color: "from-orange-500 to-red-500",
  },
  {
    slug: "economics",
    title_ar: "الاقتصاد الإداري",
    title_en: "Managerial Economics",
    chapters: 0,
    status: "coming",
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "research",
    title_ar: "مناهج البحث في الأعمال",
    title_en: "Business Research Methods",
    chapters: 0,
    status: "coming",
    color: "from-amber-500 to-yellow-500",
  },
] as const;

/**
 * Academic specializations (disciplines) — the top layer above books.
 * "business" is live (its books are in BOOKS above); the rest are the roadmap,
 * shown as "قريباً" to convey the platform's full-discipline vision honestly.
 * `icon` maps to a lucide icon in the homepage; `href` is where the card links.
 */
export const SPECIALIZATIONS = [
  {
    slug: "business",
    title_ar: "إدارة الأعمال",
    title_en: "Business Administration",
    status: "ready",
    icon: "briefcase",
    href: "/books",
  },
  {
    slug: "medicine",
    title_ar: "الطب والعلوم الصحية",
    title_en: "Medicine & Health Sciences",
    status: "coming",
    icon: "stethoscope",
    href: "/custom-curriculum",
  },
  {
    slug: "engineering",
    title_ar: "الهندسة",
    title_en: "Engineering",
    status: "coming",
    icon: "cog",
    href: "/custom-curriculum",
  },
  {
    slug: "law",
    title_ar: "الحقوق",
    title_en: "Law",
    status: "coming",
    icon: "scale",
    href: "/custom-curriculum",
  },
  {
    slug: "cs",
    title_ar: "علوم الحاسوب",
    title_en: "Computer Science",
    status: "coming",
    icon: "cpu",
    href: "/custom-curriculum",
  },
  {
    slug: "science",
    title_ar: "العلوم الأساسية",
    title_en: "Basic Sciences",
    status: "coming",
    icon: "flask",
    href: "/custom-curriculum",
  },
] as const;
