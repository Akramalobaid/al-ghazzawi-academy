import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * POST /api/admin  { password, action, ... }
 *
 * Owner-only control plane for the access-code ledger. Guarded by ADMIN_PASSWORD
 * (server-only env var). Uses the service-role client, so it can read & update
 * the RLS-locked `access_codes` table.
 *
 *   action "list"       → { ok, rows: [{ code, assigned_to, device_count, … }] }
 *   action "set_print"  { code, canPrint }  → { ok }
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  password?: string;
  action?: "list" | "set_print";
  code?: string;
  canPrint?: boolean;
};

function deny(status: number, error: string) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return deny(400, "bad_request");
  }

  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!expected) return deny(500, "admin_not_configured");
  if ((body.password ?? "").trim() !== expected) return deny(401, "unauthorized");

  const supabase = getSupabaseAdmin();

  try {
    if (body.action === "list") {
      const { data, error } = await supabase
        .from("access_codes")
        .select(
          "code, assigned_to, max_devices, devices, can_print, used_at, note, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []).map((r) => ({
        code: r.code as string,
        assigned_to: (r.assigned_to as string | null) ?? null,
        max_devices: r.max_devices as number,
        device_count: Array.isArray(r.devices) ? r.devices.length : 0,
        can_print: !!r.can_print,
        used_at: (r.used_at as string | null) ?? null,
        note: (r.note as string | null) ?? null,
      }));
      return Response.json({ ok: true, rows });
    }

    if (body.action === "set_print" && typeof body.code === "string") {
      const { error } = await supabase
        .from("access_codes")
        .update({ can_print: !!body.canPrint })
        .eq("code", body.code.trim().toUpperCase());
      if (error) throw error;
      return Response.json({ ok: true });
    }

    return deny(400, "bad_action");
  } catch (err) {
    console.error("[admin] error:", err);
    return deny(500, "server");
  }
}
