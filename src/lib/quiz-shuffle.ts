/**
 * Deterministic per-question choice shuffling for quizzes.
 *
 * The content files store the correct `answer` at a biased position — across the
 * four books ≈85% of questions have it at index 0 or 1 — which makes quizzes
 * guessable ("always pick أ/ب"). We shuffle the *display* order of the choices at
 * runtime, while keeping every answer index in its original space:
 *
 *   - `selected` / `answers[]` stay as indices into the original `choices` array,
 *     so saved attempts in Dexie (`quizAttempts.answers`) remain valid and the
 *     score reduction is untouched.
 *   - only the render loop maps a *display position* → *original index*.
 *
 * The permutation is seeded (NOT `Math.random`) so a given question always renders
 * the same order: stable across re-renders and navigation, and identical between
 * SSR and client hydration (no mismatch).
 */

/** FNV-1a string hash → unsigned 32-bit seed. */
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — tiny deterministic PRNG seeded from a 32-bit integer. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a permutation `order` of length `count` where
 * `order[displayPos] = originalIndex`. Deterministic for a given `seedKey`:
 * the same key always yields the same order. Use a key that is stable and
 * unique per question (e.g. `bookSlug#chapter#index#questionText`).
 */
export function choiceOrder(count: number, seedKey: string): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  const rand = mulberry32(hashString(seedKey));
  // Fisher-Yates over the seeded stream.
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
