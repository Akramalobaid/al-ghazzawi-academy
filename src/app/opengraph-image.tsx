import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name.ar} — ${SITE.name.en}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social-share (link preview) image. Latin-branded on purpose: Satori (next/og)
 * can't shape Arabic from Tajawal/Cairo (GSUB lookupType 5 / substFormat 3 is
 * unsupported), so the emblem + Latin wordmark carry the brand reliably. A
 * bilingual variant can later be added as a pre-rendered static PNG.
 */
async function loadInter(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)" } },
    ).then((r) => r.text());
    const url = css.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const [bold, regular] = await Promise.all([loadInter(800), loadInter(400)]);
  const fonts = [
    bold && { name: "Inter", data: bold, weight: 800 as const, style: "normal" as const },
    regular && { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 800; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0E27 0%, #06091A 100%)",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -170,
            right: -130,
            width: 580,
            height: 580,
            background:
              "radial-gradient(circle, rgba(6,182,212,0.30), rgba(6,182,212,0))",
            display: "flex",
          }}
        />
        <svg width="168" height="168" viewBox="0 0 64 64">
          <path
            d="M32 4 L56.2 18 L56.2 46 L32 60 L7.8 46 L7.8 18 Z"
            fill="#161d44"
          />
          <path
            d="M32 4 L56.2 18 L56.2 46 L32 60 L7.8 46 L7.8 18 Z"
            fill="none"
            stroke="#06B6D4"
            strokeOpacity="0.7"
            strokeWidth="2"
          />
          <path
            d="M32 13 L48 22 L48 42 L32 51 L16 42 L16 22 Z"
            fill="none"
            stroke="#06B6D4"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <circle cx="56.2" cy="18" r="3.6" fill="#06B6D4" />
        </svg>
        <div
          style={{
            marginTop: 44,
            fontWeight: 800,
            fontSize: 78,
            letterSpacing: -1,
            color: "#FFFFFF",
            display: "flex",
          }}
        >
          AL-GHAZZAWI
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 18,
            color: "#22D3EE",
            display: "flex",
          }}
        >
          ACADEMY
        </div>
        <div
          style={{
            marginTop: 28,
            fontWeight: 400,
            fontSize: 27,
            color: "rgba(255,255,255,0.72)",
            display: "flex",
          }}
        >
          Arabic MBA learning platform · books · summaries · thousands of questions
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
