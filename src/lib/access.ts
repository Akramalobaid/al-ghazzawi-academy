"use client";

/**
 * Access control — local-first deterrent (Phase 1) + central code ledger (Phase 2).
 *
 * Model: a visitor without a code may fully use ONLY the free sample — chapter 1
 * of the first book (HR): reading, quiz, flashcards, notes, progress. EVERYTHING
 * else (other chapters, other books, the full-PDF reader) is locked until the
 * student redeems an activation code ("full") or the owner enters the owner code
 * ("owner").
 *
 * One predicate — `canAccess` — governs BOTH reading and interaction so the lock
 * is uniform across the app. Printing is a separate permission: owner always;
 * full only if the owner enabled `canPrint` for that code; trial never.
 */
import { useLiveQuery } from "dexie-react-hooks";
import { getDB } from "./db";

export type AccessTier = "trial" | "full" | "owner";

/**
 * The single free sample: chapter 1 of the first book (HR). يحدّده صاحب المنصة.
 * غيّر القيمة هنا لفتح فصل/كتاب آخر مجاناً.
 */
export const FREE_SAMPLE = { book: "hr", chapter: 1 } as const;

/** Direct path to the free sample chapter overview. */
export const FREE_SAMPLE_PATH = `/books/${FREE_SAMPLE.book}/${FREE_SAMPLE.chapter}`;

/** Is this the free sample — the only chapter a trial visitor may use? */
export function isFreeSample(bookSlug: string, chapterNum: number): boolean {
  return bookSlug === FREE_SAMPLE.book && chapterNum === FREE_SAMPLE.chapter;
}

/**
 * Unified access check governing BOTH reading and interaction.
 * full/owner → everything; trial → only the free sample chapter.
 */
export function canAccess(
  bookSlug: string,
  chapterNum: number,
  tier: AccessTier,
): boolean {
  return tier !== "trial" || isFreeSample(bookSlug, chapterNum);
}

/** Back-compat alias: interaction now follows the exact same rule as reading. */
export const canInteract = canAccess;

// =====================
// Device identity
// =====================

const DEVICE_ID_KEY = "agz_device_id";

/** Stable per-browser device id, created once and persisted in localStorage. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `dev_${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// =====================
// Reactive access state
// =====================

export interface AccessState {
  /** true until the local DB has been read at least once */
  loading: boolean;
  /** has the student entered a name? */
  registered: boolean;
  studentName: string;
  tier: AccessTier;
  /** may this account print? (owner ⇒ always; full ⇒ if enabled; trial ⇒ never) */
  canPrint: boolean;
}

/** Map a persisted value to a known tier (defaults to "trial"). */
function normalizeTier(value: unknown): AccessTier {
  return value === "owner" ? "owner" : value === "full" ? "full" : "trial";
}

export function useAccess(): AccessState {
  // Returning `null` (not undefined) when empty lets us tell "loading" apart
  // from "loaded but no row yet".
  const prefs = useLiveQuery(
    async () => (await getDB().preferences.get("user")) ?? null,
    [],
  );
  const loading = prefs === undefined;
  const studentName = prefs?.studentName?.trim() ?? "";
  const tier = normalizeTier(prefs?.accessTier);
  return {
    loading,
    registered: studentName.length > 0,
    studentName,
    tier,
    canPrint: tier === "owner" || (tier === "full" && prefs?.canPrint === true),
  };
}

// =====================
// Mutations
// =====================

/** Register (or update) the student's name; preserves any unlocked tier. */
export async function registerStudent(name: string): Promise<void> {
  try {
    const db = getDB();
    const existing =
      (await db.preferences.get("user")) ?? { id: "user" as const };
    await db.preferences.put({
      ...existing,
      studentName: name.trim(),
      accessTier: normalizeTier(existing.accessTier),
    });
  } catch (err) {
    console.warn("[access] registerStudent failed", err);
  }
}

export type ActivationReason =
  | "invalid"
  | "used_by_other"
  | "device_limit"
  | "network";

export type ActivationResult =
  | { ok: true; owner?: boolean; canPrint?: boolean }
  | { ok: false; reason: ActivationReason };

/**
 * Verify an activation code against the central ledger (Phase 2).
 *
 * Calls our own /api/activate route (same origin), which holds the Supabase
 * service-role key server-side and runs the atomic `claim_code` RPC (and a
 * short-circuit for the owner master code). The browser never talks to Supabase
 * directly. Maps the server's reason to ActivationReason.
 */
async function verifyCode(
  code: string,
  name: string,
  deviceId: string,
): Promise<ActivationResult> {
  const res = await fetch("/api/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, name, deviceId }),
  });
  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; reason?: string; owner?: boolean; can_print?: boolean }
    | null;
  if (!data || typeof data.ok !== "boolean") {
    return { ok: false, reason: "network" };
  }
  if (data.ok) {
    return { ok: true, owner: !!data.owner, canPrint: !!data.can_print };
  }
  const reason: ActivationReason =
    data.reason === "invalid" ||
    data.reason === "used_by_other" ||
    data.reason === "device_limit"
      ? data.reason
      : "network";
  return { ok: false, reason };
}

/**
 * Redeem a code and, on success, unlock access locally + persist the name.
 * Owner code → "owner" tier (print always on); otherwise → "full" tier with the
 * print permission the owner set for that code.
 */
export async function activate(
  code: string,
  name: string,
): Promise<ActivationResult> {
  const deviceId = getDeviceId();
  let result: ActivationResult;
  try {
    result = await verifyCode(code, name, deviceId);
  } catch {
    return { ok: false, reason: "network" };
  }
  if (!result.ok) return result;

  try {
    const db = getDB();
    const existing =
      (await db.preferences.get("user")) ?? { id: "user" as const };
    await db.preferences.put({
      ...existing,
      studentName: name.trim() || existing.studentName,
      accessTier: result.owner ? "owner" : "full",
      canPrint: result.owner ? true : !!result.canPrint,
      activationCode: code.trim().toUpperCase(),
      unlockedAt: Date.now(),
    });
  } catch (err) {
    console.warn("[access] activate persist failed", err);
  }
  return result;
}
