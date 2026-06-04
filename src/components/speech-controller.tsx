"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";

interface Props {
  /** the raw HTML to read — tags are stripped automatically */
  html: string;
  /**
   * Optional pre-generated professional MP3 (e.g. /audio/hr/1-detailed.mp3).
   * If present it is played instead of the (weaker) browser voice; if missing
   * (404) we fall back to Web Speech automatically.
   */
  audioSrc?: string;
}

const RATES = [0.8, 1.0, 1.25, 1.5] as const;

/** Extract readable Arabic/English text from the summary HTML. */
function htmlToSpeech(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|h\d|li|div|blockquote|tr)>/gi, ". ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\.+/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pick the best available Arabic voice, preferring natural/neural ones. */
function pickArabicVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const ar = voices.filter(
    (v) =>
      (v.lang || "").toLowerCase().startsWith("ar") ||
      /arabic|عرب/i.test(v.name || ""),
  );
  if (!ar.length) return undefined;
  const prefer =
    /natural|neural|online|multilingual|hamed|salma|naayf|zariyah|hala|zeina|google/i;
  return ar.find((v) => prefer.test(v.name)) ?? ar[0];
}

export function SpeechController({ html, audioSrc }: Props) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modeRef = useRef<"audio" | "speech">("speech");

  // Load voices (async — they often aren't ready on first paint).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // Stop everything if the component unmounts.
  useEffect(
    () => () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      audioRef.current?.pause();
    },
    [],
  );

  async function audioExists(src: string): Promise<boolean> {
    try {
      const r = await fetch(src, { method: "HEAD" });
      return r.ok && (r.headers.get("content-type")?.includes("audio") ?? true);
    } catch {
      return false;
    }
  }

  function speak(useRate: number) {
    if (!window.speechSynthesis) return;
    const text = htmlToSpeech(html);
    if (!text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    utter.rate = useRate;
    const v = pickArabicVoice(voices);
    if (v) utter.voice = v;
    utter.onend = () => setStatus("idle");
    utter.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utter);
    setStatus("playing");
  }

  function playAudio(useRate: number) {
    let a = audioRef.current;
    if (!a || a.src.indexOf(audioSrc ?? "") === -1) {
      a = new Audio(audioSrc);
      audioRef.current = a;
      a.onended = () => setStatus("idle");
      a.onerror = () => {
        modeRef.current = "speech";
        speak(useRate);
      };
    }
    a.playbackRate = useRate;
    a.play()
      .then(() => setStatus("playing"))
      .catch(() => {
        modeRef.current = "speech";
        speak(useRate);
      });
  }

  async function play(useRate = rate) {
    if (audioSrc && (await audioExists(audioSrc))) {
      modeRef.current = "audio";
      playAudio(useRate);
    } else {
      modeRef.current = "speech";
      speak(useRate);
    }
  }

  function changeRate(next: number) {
    setRate(next);
    if (status !== "playing") return;
    if (modeRef.current === "audio" && audioRef.current) {
      audioRef.current.playbackRate = next;
    } else {
      window.speechSynthesis.cancel();
      setTimeout(() => speak(next), 50);
    }
  }

  function pause() {
    if (modeRef.current === "audio") audioRef.current?.pause();
    else window.speechSynthesis?.pause();
    setStatus("paused");
  }

  function resume() {
    if (modeRef.current === "audio") void audioRef.current?.play();
    else window.speechSynthesis?.resume();
    setStatus("playing");
  }

  function stop() {
    if (modeRef.current === "audio" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
  }

  if (!supported && !audioSrc) return null;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card p-1">
      {status === "idle" && (
        <button
          onClick={() => play()}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors"
          aria-label="قراءة صوتية"
        >
          <Volume2 className="size-3.5" />
          استمع
        </button>
      )}
      {status === "playing" && (
        <>
          <button
            onClick={pause}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
            aria-label="إيقاف مؤقت"
          >
            <Pause className="size-3.5" />
            إيقاف
          </button>
          <button
            onClick={stop}
            className="inline-flex items-center justify-center size-7 rounded-md text-muted hover:bg-border/40 transition-colors"
            aria-label="إنهاء"
          >
            <Square className="size-3" />
          </button>
        </>
      )}
      {status === "paused" && (
        <>
          <button
            onClick={resume}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors"
            aria-label="متابعة"
          >
            <Play className="size-3.5" />
            متابعة
          </button>
          <button
            onClick={stop}
            className="inline-flex items-center justify-center size-7 rounded-md text-muted hover:bg-border/40 transition-colors"
            aria-label="إنهاء"
          >
            <Square className="size-3" />
          </button>
        </>
      )}
      <div className="inline-flex border-l border-border/60 ms-0.5 ps-1.5 gap-0.5">
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => changeRate(r)}
            className={`text-[10px] font-bold rounded px-1.5 py-0.5 transition-colors ${
              rate === r
                ? "bg-cyan-600 text-white"
                : "text-muted hover:text-foreground"
            }`}
            aria-label={`سرعة ${r}x`}
          >
            {r}x
          </button>
        ))}
      </div>
    </div>
  );
}
