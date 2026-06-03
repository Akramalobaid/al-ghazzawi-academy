import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * POST /api/activate  { code, name, deviceId }  → { ok, reason }
 *
 * The single point where the browser touches the central ledger. Runs the atomic
 * `claim_code` Postgres function via the service-role client, so the validation
 * (single-use, per-person, device-limit) happens on the server and cannot be
 * bypassed. Maps everything to a small JSON contract the client understands.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Reason = "invalid" | "used_by_other" | "device_limit" | "network";

function fail(reason: Reason, status = 200) {
  return Response.json({ ok: false, reason }, { status });
}

export async function POST(request: NextRequest) {
  let body: { code?: string; name?: string; deviceId?: string };
  try {
    body = await request.json();
  } catch {
    return fail("invalid", 400);
  }

  const code = (body.code ?? "").trim().toUpperCase();
  const name = (body.name ?? "").trim();
  const deviceId = (body.deviceId ?? "").trim();

  if (!code || !name || !deviceId) {
    return fail("invalid", 400);
  }

  // TEMP DEBUG — diagnoses the Vercel env issue; removed right after.
  const _dbg = {
    hasUrl: !!process.env.SUPABASE_URL,
    urlLen: (process.env.SUPABASE_URL ?? "").length,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keyPrefix: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").slice(0, 10),
    keyLen: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").length,
  };

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc("claim_code", {
      p_code: code,
      p_name: name,
      p_device: deviceId,
    });

    if (error) {
      return Response.json(
        { ok: false, reason: "network", _dbg: { ..._dbg, rpcError: error.message } },
        { status: 500 },
      );
    }

    // `data` is the jsonb { ok, reason } returned by claim_code.
    if (data && typeof data.ok === "boolean") {
      return Response.json(data);
    }
    return Response.json(
      { ok: false, reason: "network", _dbg: { ..._dbg, note: "no data" } },
      { status: 500 },
    );
  } catch (err) {
    return Response.json(
      { ok: false, reason: "network", _dbg: { ..._dbg, err: String(err) } },
      { status: 500 },
    );
  }
}
