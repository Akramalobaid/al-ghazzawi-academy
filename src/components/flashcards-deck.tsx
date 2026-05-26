"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import type { Flashcard } from "@/content/hr/types";

interface FlashcardsDeckProps {
  cards: Flashcard[];
  chapterNum: number;
  hasNext: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardsDeck({ cards, chapterNum, hasNext }: FlashcardsDeckProps) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const total = deck.length;
  const current = deck[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowLeft") {
        goNext();
      } else if (e.key === "ArrowRight") {
        goPrev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  function goNext() {
    if (index < total - 1) {
      setIndex(index + 1);
      setFlipped(false);
    }
  }

  function goPrev() {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  }

  function reshuffle() {
    setDeck(shuffleArray(cards));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          البطاقة {index + 1} من {total}
        </div>
        <button
          onClick={reshuffle}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold hover:border-amber-300 transition-colors"
        >
          <Shuffle className="size-3.5" />
          خلط
        </button>
      </div>

      <div className="h-1.5 rounded-full bg-border/60 overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="[perspective:1500px] mb-5">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="relative w-full aspect-[3/2] sm:aspect-[16/9] [transform-style:preserve-3d] transition-transform duration-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4 rounded-3xl"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          aria-label="اقلب البطاقة"
        >
          {/* Front: term */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-royal-700 text-white p-6 sm:p-10 shadow-card flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute top-0 end-0 size-48 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 start-0 size-40 bg-amber-400/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
                <Sparkles className="size-3" />
                مصطلح
              </div>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                {current.term}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/70 font-medium" dir="ltr">
                {current.term_en}
              </p>
              <div className="mt-8 text-xs text-white/60 font-medium inline-flex items-center gap-1.5">
                <RotateCw className="size-3" />
                اضغط للقلب
              </div>
            </div>
          </div>

          {/* Back: definition */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-card border-2 border-amber-300/60 p-6 sm:p-10 shadow-card flex flex-col justify-center text-center overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-3">
              التعريف
            </div>
            <p className="text-base sm:text-lg text-foreground leading-relaxed">
              {current.definition}
            </p>
            <div className="mt-6 text-xs text-muted font-medium inline-flex items-center justify-center gap-1.5">
              <RotateCw className="size-3" />
              اضغط للعودة
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-foreground/40 transition-colors"
        >
          <ArrowRight className="size-4" />
          السابقة
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-amber-700 transition-colors"
        >
          <RotateCw className="size-4" />
          اقلب
        </button>
        <button
          onClick={goNext}
          disabled={index === total - 1}
          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-foreground/40 transition-colors"
        >
          التالية
          <ArrowLeft className="size-4" />
        </button>
      </div>

      {index === total - 1 && (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-5 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <h3 className="font-bold text-foreground">أنهيت بطاقات الفصل</h3>
          <p className="mt-1 text-sm text-muted">
            راجع البطاقات مرة أخرى أو انتقل للفصل التالي
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={reshuffle}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold hover:border-amber-300 transition-colors"
            >
              <Shuffle className="size-3.5" />
              ابدأ من جديد
            </button>
            {hasNext && (
              <Link
                href={`/books/hr/${chapterNum + 1}/flashcards`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                بطاقات الفصل التالي
                <ArrowLeft className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
