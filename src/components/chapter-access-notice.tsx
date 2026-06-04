"use client";

import { Sparkles } from "lucide-react";
import { useAccess, isFreeSample } from "@/lib/access";

/**
 * Green banner shown ONLY on the free sample chapter (HR ch.1) for trial
 * visitors, telling them it is fully unlocked. Hidden everywhere else — locked
 * chapters show the AccessGate lock screen instead, and full/owner accounts see
 * no banner at all.
 */
export function ChapterAccessNotice({
  bookSlug,
  chapterNum,
}: {
  bookSlug: string;
  chapterNum: number;
}) {
  const { loading, tier } = useAccess();
  if (loading || tier !== "trial") return null;
  if (!isFreeSample(bookSlug, chapterNum)) return null;

  return (
    <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm">
      <Sparkles className="size-4 text-emerald-600 shrink-0" />
      <span className="text-emerald-800 font-medium">
        هذا فصلك التجريبي المجاني — تصفّح وتفاعل بحرية. بقية الفصول والكتب تُفتح
        بكود التفعيل.
      </span>
    </div>
  );
}
