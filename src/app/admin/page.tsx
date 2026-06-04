"use client";

import { useState } from "react";
import {
  Loader2,
  Lock,
  Printer,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

type Row = {
  code: string;
  assigned_to: string | null;
  max_devices: number;
  device_count: number;
  can_print: boolean;
  used_at: string | null;
  note: string | null;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingCode, setSavingCode] = useState<string | null>(null);

  async function api(action: string, extra?: Record<string, unknown>) {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action, ...extra }),
    });
    return res.json().catch(() => null);
  }

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setBusy(true);
    const data = await api("list");
    setBusy(false);
    if (data?.ok) {
      setRows(data.rows ?? []);
      setAuthed(true);
    } else {
      setError(
        data?.error === "unauthorized"
          ? "كلمة السر غير صحيحة."
          : data?.error === "admin_not_configured"
            ? "لوحة التحكم غير مُعدّة (ADMIN_PASSWORD مفقود على الخادم)."
            : "تعذّر الاتصال بالخادم.",
      );
    }
  }

  async function refresh() {
    setBusy(true);
    const data = await api("list");
    setBusy(false);
    if (data?.ok) setRows(data.rows ?? []);
  }

  async function togglePrint(code: string, next: boolean) {
    setSavingCode(code);
    setRows((rs) => rs.map((r) => (r.code === code ? { ...r, can_print: next } : r)));
    const data = await api("set_print", { code, canPrint: next });
    setSavingCode(null);
    if (!data?.ok) {
      setRows((rs) =>
        rs.map((r) => (r.code === code ? { ...r, can_print: !next } : r)),
      );
    }
  }

  const used = rows.filter((r) => r.used_at).length;
  const printers = rows.filter((r) => r.can_print).length;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 flex items-start gap-3">
          <div className="size-11 rounded-2xl bg-gradient-to-br from-royal-600 to-navy text-white flex items-center justify-center shadow-card shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-royal-700 uppercase tracking-wider">
              لوحة التحكم
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-foreground">
              إدارة أكواد التفعيل
            </h1>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              متابعة الزبائن والأجهزة + التحكم بإذن الطباعة لكل كود.
            </p>
          </div>
        </div>

        {!authed ? (
          <form
            onSubmit={login}
            className="mx-auto max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4 text-foreground font-bold">
              <Lock className="size-4" />
              دخول المالك
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة سر اللوحة"
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-cyan-400 transition-colors"
            />
            {error && <p className="mt-3 text-sm text-rose-600 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              دخول
            </button>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "إجمالي الأكواد", value: rows.length },
                { label: "مُفعّلة", value: used },
                { label: "تطبع", value: printers },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border/60 bg-card p-4 text-center shadow-soft"
                >
                  <div className="text-2xl font-black text-foreground">{s.value}</div>
                  <div className="text-xs text-muted font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-foreground">الأكواد</h2>
              <button
                onClick={refresh}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold hover:border-foreground/40 transition-colors disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                تحديث
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-soft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted text-xs">
                    <th className="text-start font-bold px-4 py-3">الكود</th>
                    <th className="text-start font-bold px-4 py-3">الاسم</th>
                    <th className="text-center font-bold px-4 py-3">الأجهزة</th>
                    <th className="text-start font-bold px-4 py-3">التفعيل</th>
                    <th className="text-center font-bold px-4 py-3">الطباعة</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.code} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-foreground" dir="ltr">
                        {r.code}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {r.assigned_to || <span className="text-muted">—</span>}
                        {r.note && (
                          <span className="block text-[11px] text-muted">{r.note}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Smartphone className="size-3.5" />
                          {r.device_count}/{r.max_devices}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted" dir="ltr">
                        {r.used_at
                          ? new Date(r.used_at).toLocaleDateString("ar-EG")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => togglePrint(r.code, !r.can_print)}
                          disabled={savingCode === r.code}
                          aria-pressed={r.can_print}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            r.can_print ? "bg-emerald-500" : "bg-border"
                          } ${savingCode === r.code ? "opacity-60" : ""}`}
                          title={r.can_print ? "الطباعة مسموحة" : "الطباعة مقفلة"}
                        >
                          <span
                            className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
                              r.can_print ? "ltr:translate-x-5 rtl:-translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted">
                        لا توجد أكواد بعد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <Printer className="size-3.5" />
              تشغيل المفتاح يمنح صاحب الكود حقّ الطباعة (يسري بعد إعادة إدخاله للكود لتحديث صلاحياته).
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
