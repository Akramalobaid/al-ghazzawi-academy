"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

/**
 * Curriculum request form. Collects the program details and opens WhatsApp with
 * a pre-filled message (no backend) — the requester sends the books over the
 * chat after we reply. Matches the chosen "form + WhatsApp" approach.
 */
export function CurriculumRequestForm() {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [institution, setInstitution] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !program.trim()) {
      setError("أدخل اسمك واسم المنهاج على الأقل.");
      return;
    }
    setError(null);
    const lines = [
      "📚 طلب إعداد منهاج دراسي — أكاديمية الغزاوي",
      `الاسم: ${name.trim()}`,
      `المنهاج/البرنامج: ${program.trim()}`,
      institution.trim() ? `الجهة/الجامعة: ${institution.trim()}` : null,
      notes.trim() ? `ملاحظات/عناوين الكتب: ${notes.trim()}` : null,
    ].filter(Boolean) as string[];
    window.open(
      whatsappLink(lines.join("\n")),
      "_blank",
      "noopener,noreferrer",
    );
  }

  const field =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-cyan-400 transition-colors";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-bold text-foreground">
          اسمك <span className="text-rose-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم الكامل"
          className={field}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-foreground">
          اسم المنهاج / البرنامج <span className="text-rose-500">*</span>
        </label>
        <input
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          placeholder="مثال: ماجستير المحاسبة — جامعة دمشق"
          className={field}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-foreground">
          الجهة / الجامعة (اختياري)
        </label>
        <input
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="اسم الجامعة أو المعهد"
          className={field}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-bold text-foreground">
          عناوين الكتب أو ملاحظات (اختياري)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="اكتب عناوين الكتب أو أي تفاصيل — وسترسل الملفات عبر واتساب بعد ردّنا."
          className={field + " resize-none"}
        />
      </div>

      {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-3.5 text-sm font-bold hover:bg-emerald-700 transition-colors shadow-soft"
      >
        <MessageCircle className="size-4" />
        إرسال الطلب عبر واتساب
      </button>
      <p className="text-center text-xs text-muted">
        سيفتح واتساب برسالة جاهزة تحوي بياناتك — أرسلها لنا ثم أرفِق ملفات الكتب.
      </p>
    </form>
  );
}
