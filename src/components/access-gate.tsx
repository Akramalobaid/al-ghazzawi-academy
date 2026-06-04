"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Lock, MessageCircle } from "lucide-react";
import { useAccess, canAccess, FREE_SAMPLE_PATH } from "@/lib/access";
import { whatsappLink } from "@/lib/site";
import { UnlockForm } from "./unlock-form";

/**
 * Unified access gate for chapter content — governs READING and INTERACTION.
 * Renders the children only when the student may access this chapter; otherwise
 * a lock screen with the activation form + a WhatsApp CTA to obtain a code.
 *
 * To lock a whole-book surface (e.g. the full-PDF reader), pass a chapterNum that
 * can never be the free sample, such as 0.
 */
export function AccessGate({
  bookSlug,
  chapterNum,
  children,
  whatLocked = "هذا المحتوى",
}: {
  bookSlug: string;
  chapterNum: number;
  children: ReactNode;
  whatLocked?: string;
}) {
  const { loading, registered, studentName, tier } = useAccess();

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-sm text-muted">
        جارٍ التحميل…
      </div>
    );
  }

  if (canAccess(bookSlug, chapterNum, tier)) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-card p-6 sm:p-8 shadow-soft">
      <div className="flex flex-col items-center text-center">
        <div className="size-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-soft">
          <Lock className="size-7" />
        </div>
        <h2 className="mt-4 text-xl font-black text-foreground">
          {whatLocked} مقفل
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted leading-relaxed">
          النسخة التجريبية المجانية تشمل{" "}
          <strong className="text-foreground">
            الفصل الأول من كتاب إدارة الموارد البشرية
          </strong>{" "}
          فقط. لفتح كل الكتب والفصول — قراءةً وتفاعلاً — فعّل حسابك بكود التفعيل.
        </p>
      </div>

      <div className="mt-6 mx-auto max-w-sm">
        <UnlockForm needName={!registered} defaultName={studentName} />
        <a
          href={whatsappLink(
            "السلام عليكم، أرغب بالحصول على كود تفعيل لأكاديمية الغزاوي.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <MessageCircle className="size-4" />
          لا تملك كوداً؟ تواصل عبر واتساب
        </a>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Link
          href={FREE_SAMPLE_PATH}
          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-sm font-bold hover:border-foreground/40 transition-colors"
        >
          <BookOpen className="size-4" />
          جرّب الفصل المجاني
        </Link>
      </div>
    </div>
  );
}
