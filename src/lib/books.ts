/**
 * Book registry — single source of truth for resolving (bookSlug, chapterNum, cardIndex)
 * back to the static content shipped with the app. Used by /review, /dashboard, etc.
 */
import { hrBook, getChapterByNum } from "@/content/hr";
import { marketingBook, getChapterByNum as getMarketingChapterByNum } from "@/content/marketing";
import type { Book, Chapter, Flashcard, QuizItem } from "@/content/hr/types";

const BOOKS: Record<string, Book> = {
  hr: hrBook,
  marketing: marketingBook,
};

export function getBook(slug: string): Book | undefined {
  return BOOKS[slug];
}

export function allBooks(): Book[] {
  return Object.values(BOOKS);
}

export function getChapterFromBook(
  slug: string,
  num: number,
): Chapter | undefined {
  if (slug === "hr") return getChapterByNum(num);
  if (slug === "marketing") return getMarketingChapterByNum(num);
  return getBook(slug)?.chapters.find((c) => c.num === num);
}

export function getFlashcard(
  bookSlug: string,
  chapterNum: number,
  cardIndex: number,
): Flashcard | undefined {
  return getChapterFromBook(bookSlug, chapterNum)?.flashcards[cardIndex];
}

export function getQuizItem(
  bookSlug: string,
  chapterNum: number,
  questionIndex: number,
): QuizItem | undefined {
  return getChapterFromBook(bookSlug, chapterNum)?.quiz[questionIndex];
}

/** Total flashcards across all books — used for stats. */
export function totalFlashcards(): number {
  return allBooks().reduce(
    (sum, b) => sum + b.chapters.reduce((s, c) => s + c.flashcards.length, 0),
    0,
  );
}

/** Total chapters across all books. */
export function totalChapters(): number {
  return allBooks().reduce((sum, b) => sum + b.chapters.length, 0);
}
