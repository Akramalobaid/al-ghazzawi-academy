/**
 * React hooks for the Academy local database.
 * Built on top of dexie-react-hooks (`useLiveQuery`) for reactive updates.
 *
 * All hooks are client-only — call them from `"use client"` components.
 */
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  chapterProgressId,
  dayKey,
  flashcardStateId,
  getDB,
  type FlashcardStatus,
  type Preferences,
} from "./db";

// =====================
// Reading progress
// =====================

export function useChapterProgress(bookSlug: string, chapterNum: number) {
  return useLiveQuery(
    () => getDB().readingProgress.get(chapterProgressId(bookSlug, chapterNum)),
    [bookSlug, chapterNum],
  );
}

export function useBookProgress(bookSlug: string) {
  return useLiveQuery(
    () =>
      getDB()
        .readingProgress.where({ bookSlug })
        .toArray(),
    [bookSlug],
  );
}

// =====================
// Quiz attempts
// =====================

export function useChapterQuizAttempts(bookSlug: string, chapterNum: number) {
  return useLiveQuery(
    () =>
      getDB()
        .quizAttempts.where("[bookSlug+chapterNum]")
        .equals([bookSlug, chapterNum])
        .reverse()
        .sortBy("date"),
    [bookSlug, chapterNum],
  );
}

export function useBookQuizAttempts(bookSlug: string) {
  return useLiveQuery(
    () => getDB().quizAttempts.where({ bookSlug }).reverse().sortBy("date"),
    [bookSlug],
  );
}

/** best attempt (highest percent) per chapter */
export function useChapterBestScore(bookSlug: string, chapterNum: number) {
  return useLiveQuery(async () => {
    const attempts = await getDB()
      .quizAttempts.where("[bookSlug+chapterNum]")
      .equals([bookSlug, chapterNum])
      .toArray();
    if (attempts.length === 0) return null;
    return attempts.reduce(
      (best, a) => (a.percent > best.percent ? a : best),
      attempts[0],
    );
  }, [bookSlug, chapterNum]);
}

// =====================
// Flashcards
// =====================

export function useChapterFlashcardStates(
  bookSlug: string,
  chapterNum: number,
) {
  return useLiveQuery(
    () =>
      getDB()
        .flashcardStates.where("[bookSlug+chapterNum]")
        .equals([bookSlug, chapterNum])
        .toArray(),
    [bookSlug, chapterNum],
  );
}

/**
 * Mark a single flashcard's status. Increments review count and updates `lastReviewed`.
 * SM-2 scheduling will be added in Session 3ب — this version just stores the status.
 */
export async function setFlashcardStatus(
  bookSlug: string,
  chapterNum: number,
  cardIndex: number,
  status: FlashcardStatus,
) {
  try {
    const db = getDB();
    const id = flashcardStateId(bookSlug, chapterNum, cardIndex);
    const existing = await db.flashcardStates.get(id);
    await db.flashcardStates.put({
      id,
      bookSlug,
      chapterNum,
      cardIndex,
      status,
      reviewCount: (existing?.reviewCount ?? 0) + 1,
      lastReviewed: Date.now(),
      easeFactor: existing?.easeFactor ?? 2.5,
      intervalDays: existing?.intervalDays ?? 0,
    });
  } catch (err) {
    console.warn("[db] setFlashcardStatus failed", err);
  }
}

// =====================
// PDF reading position & bookmarks
// =====================

export function usePdfPosition(bookSlug: string) {
  return useLiveQuery(
    () => getDB().pdfPositions.get(bookSlug),
    [bookSlug],
  );
}

export async function savePdfPosition(
  bookSlug: string,
  page: number,
  scale?: number,
) {
  try {
    await getDB().pdfPositions.put({
      bookSlug,
      page,
      scale,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn("[db] savePdfPosition failed", err);
  }
}

export function usePdfBookmarks(bookSlug: string) {
  return useLiveQuery(
    () =>
      getDB()
        .pdfBookmarks.where({ bookSlug })
        .reverse()
        .sortBy("createdAt"),
    [bookSlug],
  );
}

export async function addPdfBookmark(
  bookSlug: string,
  page: number,
  label?: string,
) {
  try {
    await getDB().pdfBookmarks.add({
      bookSlug,
      page,
      label,
      createdAt: Date.now(),
    });
  } catch (err) {
    console.warn("[db] addPdfBookmark failed", err);
  }
}

export async function removePdfBookmark(id: number) {
  try {
    await getDB().pdfBookmarks.delete(id);
  } catch (err) {
    console.warn("[db] removePdfBookmark failed", err);
  }
}

// =====================
// Notes
// =====================

export function useChapterNotes(bookSlug: string, chapterNum: number) {
  return useLiveQuery(
    () =>
      getDB()
        .notes.where("[bookSlug+chapterNum]")
        .equals([bookSlug, chapterNum])
        .reverse()
        .sortBy("updatedAt"),
    [bookSlug, chapterNum],
  );
}

// =====================
// Streak
// =====================

/**
 * Compute consecutive-day streak ending today.
 * Looks at distinct dayKeys in studySessions and walks back from today.
 */
export function useStreak() {
  return useLiveQuery(async () => {
    const sessions = await getDB().studySessions.toArray();
    if (sessions.length === 0)
      return { current: 0, longest: 0, todayActive: false };

    const days = new Set(sessions.map((s) => s.dayKey));
    const today = dayKey();
    const todayActive = days.has(today);

    // Compute current streak — start from today (or yesterday if today empty)
    let current = 0;
    const cursor = new Date();
    if (!todayActive) cursor.setDate(cursor.getDate() - 1);
    while (days.has(dayKey(cursor))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Compute longest streak — walk sorted unique day list
    const sorted = [...days].sort();
    let longest = 0;
    let run = 0;
    let prev: Date | null = null;
    for (const k of sorted) {
      const cur = new Date(k);
      if (prev) {
        const diffDays = Math.round(
          (cur.getTime() - prev.getTime()) / 86_400_000,
        );
        run = diffDays === 1 ? run + 1 : 1;
      } else {
        run = 1;
      }
      longest = Math.max(longest, run);
      prev = cur;
    }

    return { current, longest, todayActive };
  }, []);
}

// =====================
// Preferences
// =====================

export function usePreferences() {
  return useLiveQuery(
    () => getDB().preferences.get("user"),
    [],
  );
}

export async function setPreference<K extends keyof Preferences>(
  key: K,
  value: Preferences[K],
) {
  try {
    const db = getDB();
    const existing = (await db.preferences.get("user")) ?? {
      id: "user" as const,
    };
    await db.preferences.put({ ...existing, [key]: value });
  } catch (err) {
    console.warn("[db] setPreference failed", err);
  }
}
