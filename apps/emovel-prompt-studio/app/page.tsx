"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProjectSchemaV1,
  emptyRefinedBrief,
  migrateProjectToSchemaV1,
  type ProjectSchemaV1,
  type RefinedBrief,
  type StrategyAsset,
} from "../lib/project-schema";

// Inline icon set (no external icon dependency). Stroke icons inherit currentColor.
type IconProps = { size?: number; className?: string };
function Stroke({ size = 16, d, className }: IconProps & { d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {d.split("|").map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}
const ArrowRight = ({ size }: IconProps) => <Stroke size={size} d="M5 12h14|m13 6 6 6-6 6" />;
const ChevronDown = ({ size }: IconProps) => <Stroke size={size} d="m6 9 6 6 6-6" />;
const Plus = ({ size }: IconProps) => <Stroke size={size} d="M12 5v14|M5 12h14" />;
const X = ({ size }: IconProps) => <Stroke size={size} d="M18 6 6 18|M6 6l12 12" />;
const Mic = ({ size }: IconProps) => <Stroke size={size} d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z|M19 10a7 7 0 0 1-14 0|M12 19v3" />;
const Paperclip = ({ size, className }: IconProps) => <Stroke size={size} className={className} d="m21.44 11.05-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L9.4 18.84a2 2 0 0 1-2.83-2.83l8.49-8.48" />;
const TrendingUp = ({ size }: IconProps) => <Stroke size={size} d="m3 17 6-6 4 4 8-8|M17 7h4v4" />;
const Layers = ({ size }: IconProps) => <Stroke size={size} d="M12 2 2 7l10 5 10-5-10-5z|m2 12 10 5 10-5|m2 17 10 5 10-5" />;
const Code2 = ({ size }: IconProps) => <Stroke size={size} d="m18 16 4-4-4-4|M6 8l-4 4 4 4|m14.5 4-5 16" />;
const Rocket = ({ size }: IconProps) => <Stroke size={size} d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.79-.74.78-2.05-.09-2.91a2.18 2.18 0 0 0-2.91-.09z|M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z|M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0|M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />;
function Play({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}><path d="M8 5v14l11-7z" /></svg>
  );
}

const STARTER_CHIPS = ["AI SaaS landing page", "Gumroad product system", "Founder content OS", "Mobile app MVP"];
const WORKSPACE_OPTIONS = ["Workspace", "Landing page", "Product system"];

const CAPABILITY_CARDS = [
  { icon: <TrendingUp size={17} />, title: "Strategy", desc: "Market research, positioning, offer and funnel strategy.", tag: "AI Analysis" },
  { icon: <Layers size={17} />, title: "Design", desc: "UI/UX direction, visual systems, branding and style guides.", tag: "Design System" },
  { icon: <Code2 size={17} />, title: "Build", desc: "Technical architecture, stack, and development plan.", tag: "Tech Blueprint" },
  { icon: <Rocket size={17} />, title: "Publish", desc: "Launch assets, content, marketing systems, and automation.", tag: "Go to Market" },
];

const refineFields: { key: keyof RefinedBrief; label: string; placeholder: string }[] = [
  { key: "productType", label: "What are you building?", placeholder: "AI content OS, agency site, SaaS dashboard..." },
  { key: "targetAudience", label: "Who is it for?", placeholder: "Solo founders, luxury agents, SaaS teams..." },
  { key: "platform", label: "What platform?", placeholder: "Web app, Gumroad, landing page, Instagram..." },
  { key: "tone", label: "What tone?", placeholder: "Premium, direct, cinematic, playful..." },
  { key: "launchGoal", label: "What should it achieve?", placeholder: "Sell preorders, capture leads, launch a paid product..." },
  { key: "pricePoint", label: "Price point / monetization", placeholder: "$49 prompt pack, $499 service audit, free waitlist..." },
];

type ConsoleState = "idle" | "focused" | "generating" | "drag-over";
type MicState = "idle" | "recording" | "processing";
interface Attachment { id: string; type: "img" | "video"; name: string; url: string }

type AiGenerateResponse = { mode?: "ai" | "fallback"; fallback?: boolean; asset?: StrategyAsset };

// Minimal typing for the browser Speech Recognition API (no DOM lib coverage).
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function titleFromPrompt(value: string) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (!clean) return "Untitled Workspace";
  const withoutCommand = clean.replace(/^(create|build|design|launch|generate)\s+/i, "");
  return withoutCommand.charAt(0).toUpperCase() + withoutCommand.slice(1, 72);
}

function inferBriefFromPrompt(prompt: string): RefinedBrief {
  const lower = prompt.toLowerCase();
  const productType =
    lower.includes("dashboard") ? "SaaS dashboard" :
    lower.includes("gumroad") || lower.includes("prompt pack") ? "Digital product" :
    lower.includes("agency") ? "Agency landing page" :
    lower.includes("content") || lower.includes("instagram") ? "Content operating system" :
    lower.includes("real estate") ? "Luxury real estate website" :
    lower.includes("site") || lower.includes("landing") ? "Conversion website" :
    "Launch workspace";
  const targetAudience =
    lower.includes("founder") ? "Solo founders and lean operators" :
    lower.includes("real estate") ? "Luxury real estate buyers and sellers" :
    lower.includes("saas") ? "SaaS teams and product operators" :
    lower.includes("agency") ? "High-trust service buyers" :
    "Builders preparing a product launch";
  const platform =
    lower.includes("instagram") ? "Instagram" :
    lower.includes("gumroad") ? "Gumroad" :
    lower.includes("dashboard") || lower.includes("saas") ? "Web app" :
    lower.includes("site") || lower.includes("landing") ? "Website" :
    "Web workspace";
  const tone =
    lower.includes("luxury") ? "Luxury and polished" :
    lower.includes("agency") ? "Premium and authoritative" :
    lower.includes("founder") ? "Clear and founder-friendly" :
    "Premium, clear, and decisive";
  const pricePoint =
    lower.includes("gumroad") || lower.includes("prompt pack") ? "$29-$99 digital product" :
    lower.includes("agency") ? "$2k-$10k service offer" :
    lower.includes("saas") ? "Free trial or paid SaaS plan" :
    "Pilot price with premium upgrade";
  const launchGoal =
    lower.includes("waitlist") ? "Capture qualified waitlist leads" :
    lower.includes("gumroad") || lower.includes("prompt pack") ? "Sell a self-serve digital product" :
    lower.includes("dashboard") ? "Guide users to activation" :
    "Turn the idea into publish-ready launch assets";
  return { productType, targetAudience, platform, tone, launchGoal, pricePoint };
}

function mergeBrief(prompt: string, brief: RefinedBrief) {
  const inferred = inferBriefFromPrompt(prompt);
  return {
    productType: brief.productType.trim() || inferred.productType,
    targetAudience: brief.targetAudience.trim() || inferred.targetAudience,
    platform: brief.platform.trim() || inferred.platform,
    tone: brief.tone.trim() || inferred.tone,
    launchGoal: brief.launchGoal.trim() || inferred.launchGoal,
    pricePoint: brief.pricePoint.trim() || inferred.pricePoint,
  };
}

function createProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `workspace-${Date.now().toString(36)}`;
}

function persistLocalProject(project: ProjectSchemaV1) {
  const storageKey = "emovel-projects";
  const existing = localStorage.getItem(storageKey);
  const projects = existing
    ? (JSON.parse(existing) as unknown[])
        .map((item) => migrateProjectToSchemaV1(item))
        .filter((item): item is ProjectSchemaV1 => Boolean(item))
    : [];
  localStorage.setItem(storageKey, JSON.stringify([project, ...projects]));
  localStorage.setItem(`emovel-project:${project.id}`, JSON.stringify(project));
}

function WaveformBars() {
  const heights = [3, 6, 9, 7, 12, 8, 5, 11, 6, 8, 4];
  return (
    <div className="flex h-4 items-center gap-[2px]">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full bg-[#2E6BFF]"
          style={{ height: `${h}px`, animation: `emovelWave 0.7s ease-in-out ${i * 0.06}s infinite alternate` }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [brief, setBrief] = useState<RefinedBrief>(emptyRefinedBrief);
  const [refineOpen, setRefineOpen] = useState(false);
  const [consoleState, setConsoleState] = useState<ConsoleState>("idle");
  const [micState, setMicState] = useState<MicState>("idle");
  const [workspace, setWorkspace] = useState("Workspace");
  const [showDropdown, setShowDropdown] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [aiMode, setAiMode] = useState<"idle" | "ai" | "fallback">("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (micState === "recording") {
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [micState]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Real voice-to-text via the Web Speech API (graceful no-op if unsupported).
  const handleMicToggle = useCallback(() => {
    if (micState === "recording") {
      recognitionRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setMicState("processing");
      setTimeout(() => setMicState("idle"), 1200);
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript) setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onerror = () => setMicState("idle");
    rec.onend = () => setMicState((s) => (s === "recording" ? "processing" : s));
    recognitionRef.current = rec;
    setMicState("recording");
    rec.start();
    // processing -> idle settle after stop
  }, [micState]);

  useEffect(() => {
    if (micState === "processing") {
      const t = setTimeout(() => setMicState("idle"), 900);
      return () => clearTimeout(t);
    }
  }, [micState]);

  function addFiles(files: FileList | File[]) {
    Array.from(files).forEach((f) => {
      const type: "img" | "video" = f.type.startsWith("video") ? "video" : "img";
      const url = URL.createObjectURL(f);
      setAttachments((prev) => [...prev, { id: `${f.name}-${Date.now()}-${Math.random()}`, type, name: f.name, url }]);
    });
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setConsoleState("drag-over");
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setConsoleState((s) => (s === "drag-over" ? "idle" : s));
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setConsoleState("idle");
    addFiles(e.dataTransfer.files);
  }, []);

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
  }

  const handleGenerate = useCallback(async () => {
    if (consoleState === "generating") return;
    const text = prompt.trim() || "Create a premium launch workspace for a new EMOVEL product.";
    const refinedBrief = mergeBrief(text, brief);
    setConsoleState("generating");
    setAiMode("idle");
    let strategyAsset: StrategyAsset | null = null;

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assetType: "strategy", prompt: text, refinedBrief }),
      });
      const payload = (await response.json()) as AiGenerateResponse;
      if (payload.asset) strategyAsset = payload.asset;
      setAiMode(payload.mode === "ai" && !payload.fallback ? "ai" : "fallback");
    } catch {
      setAiMode("fallback");
    }

    const project = createProjectSchemaV1({
      id: createProjectId(),
      title: titleFromPrompt(text),
      prompt: text,
      refinedBrief,
      createdAt: new Date().toISOString(),
      status: "Ready",
    });
    if (strategyAsset) project.assets = { strategy: strategyAsset } as ProjectSchemaV1["assets"];

    persistLocalProject(project);
    sessionStorage.setItem("emovel-pending-prompt", text);
    router.push(`/workspace/${project.id}`);
  }, [brief, consoleState, prompt, router]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  const generating = consoleState === "generating";
  const consoleBorderClass =
    consoleState === "drag-over" ? "border-[#2E6BFF]/50 border-dashed"
    : consoleState === "focused" ? "border-[rgba(199,164,90,0.35)]"
    : generating ? "border-[rgba(199,164,90,0.4)]"
    : "border-[rgba(255,255,255,0.08)]";
  const consoleGlow =
    generating ? "0 0 0 1px rgba(199,164,90,0.25), 0 32px 80px rgba(0,0,0,0.65), 0 0 60px rgba(199,164,90,0.07)"
    : consoleState === "focused" ? "0 0 0 1px rgba(199,164,90,0.12), 0 32px 80px rgba(0,0,0,0.6)"
    : "0 32px 80px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.3)";

  return (
    <main
      className="relative min-h-dvh overflow-x-hidden bg-[#0A0A0B] px-4 pb-28 pt-32 text-[#F5F5F2]"
      style={{ fontFamily: "'Onest','Inter',system-ui,sans-serif" }}
    >
      <style>{`
        @keyframes emovelWave { from { transform: scaleY(0.4); opacity: 0.5; } to { transform: scaleY(1.7); opacity: 1; } }
        @keyframes emovelPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(46,107,255,0.5); } 50% { box-shadow: 0 0 0 7px rgba(46,107,255,0); } }
        @keyframes emovelShimmer { 0% { background-position: -400% 0; } 100% { background-position: 400% 0; } }
      `}</style>

      {/* Background layers — gold bloom + dot-grid + blue micro ambient + vignette */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.032) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 90% 90% at 50% 45%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 45%, black 30%, transparent 100%)" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(199,164,90,0.07) 0%, transparent 65%)" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 32% 70% at 0% 48%, rgba(46,107,255,0.04) 0%, transparent 60%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-0 h-40" style={{ background: "linear-gradient(to top, rgba(10,10,11,0.85) 0%, transparent 100%)" }} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Hero pill */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.025)] px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D6B25E]" style={{ boxShadow: "0 0 7px rgba(199,164,90,0.85)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9AA0A6]">AI-Powered Product Creation OS</span>
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-[780px] text-center font-bold leading-[1.08] tracking-[-0.04em]" style={{ fontSize: "clamp(2rem,5vw,3.85rem)" }}>
          Build products, sites and launch systems from{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(180deg, #F4E3AC 0%, #D9B868 42%, #B98F3E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              filter: "drop-shadow(0 0 34px rgba(206,162,78,0.28))",
            }}
          >
            one prompt.
          </span>
        </h1>
        <p className="mb-12 max-w-[500px] text-center text-base leading-relaxed text-[#9AA0A6] md:text-[17px]">
          Describe the outcome. EMOVEL turns it into strategy, copy, UX, build plans, and publish-ready assets.
        </p>

        {/* Prompt console */}
        <div
          className={`relative w-full max-w-[840px] rounded-[28px] border transition-all duration-300 ${consoleBorderClass}`}
          style={{ background: "#16161A", boxShadow: consoleGlow }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="absolute left-8 right-8 top-0 h-px rounded-full" style={{ background: "linear-gradient(to right, transparent, rgba(199,164,90,0.45) 25%, rgba(233,216,166,0.6) 50%, rgba(199,164,90,0.45) 75%, transparent)" }} />
          <div className="pointer-events-none absolute inset-0 rounded-[28px]" style={{ background: "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(199,164,90,0.038) 0%, transparent 60%)" }} />

          {consoleState === "drag-over" && (
            <div className="pointer-events-none absolute inset-2 z-10 flex items-center justify-center rounded-[22px] border-2 border-dashed border-[#2E6BFF]/50 bg-[#2E6BFF]/[0.04]">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2E6BFF]">Drop files here</span>
            </div>
          )}

          {generating && (
            <div className="absolute -top-9 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 rounded-full border border-[rgba(199,164,90,0.22)] bg-[#16161A] px-3.5 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D6B25E]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D6B25E]">
                  {aiMode === "fallback" ? "Fallback mode…" : "Generating workspace…"}
                </span>
              </div>
            </div>
          )}

          <div className="relative z-[1] p-6 pb-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setConsoleState((s) => (s === "idle" ? "focused" : s))}
              onBlur={() => setConsoleState((s) => (s === "focused" ? "idle" : s))}
              placeholder="Tell EMOVEL what you want to create…"
              rows={4}
              aria-label="Product idea prompt"
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#F5F5F2] outline-none placeholder:text-white/30"
              style={{ minHeight: "120px", caretColor: "#D6B25E" }}
            />

            {attachments.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 border-t border-[rgba(255,255,255,0.055)] pt-3">
                {attachments.map((att) => (
                  <div key={att.id} className="group relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0F0F12]">
                    {att.type === "video" ? (
                      <Play size={14} className="text-[#F5F5F2]/50" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={att.url} alt={att.name} className="h-full w-full object-cover" />
                    )}
                    <span className="absolute bottom-1 left-1 rounded bg-[#0A0A0B]/80 px-1 py-0.5 font-mono text-[7px] uppercase tracking-wide text-[#9AA0A6]">
                      {att.type === "video" ? "VID" : "IMG"}
                    </span>
                    <button onClick={() => removeAttachment(att.id)} className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[#0A0A0B]/90 opacity-0 transition-opacity group-hover:opacity-100">
                      <X size={8} className="text-[#F5F5F2]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.055)] pt-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button type="button" aria-label="Add context" onClick={() => setRefineOpen((v) => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#9AA0A6] transition-all hover:border-[rgba(255,255,255,0.18)] hover:text-[#F5F5F2]">
                  <Plus size={15} />
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-8 items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.1)] px-3 font-mono text-[12px] text-[#9AA0A6] transition-all hover:border-[rgba(255,255,255,0.18)] hover:text-[#F5F5F2]">
                  <Paperclip size={13} /> Media
                </button>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files ?? [])} />
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`flex h-8 items-center gap-2 rounded-full border px-3 text-[12px] transition-all ${
                    micState === "recording" ? "border-[#2E6BFF]/50 bg-[#2E6BFF]/[0.08] text-[#2E6BFF]"
                    : micState === "processing" ? "border-[rgba(255,255,255,0.1)] text-[#9AA0A6]/60"
                    : "border-[rgba(255,255,255,0.1)] text-[#9AA0A6] hover:border-[rgba(255,255,255,0.18)] hover:text-[#F5F5F2]"
                  }`}
                  style={micState === "recording" ? { animation: "emovelPulse 1.6s ease-in-out infinite" } : undefined}
                  aria-label="Voice to prompt"
                >
                  <Mic size={13} />
                  {micState === "recording" && (
                    <>
                      <WaveformBars />
                      <span className="font-mono text-[10px] tabular-nums">{fmt(recordingTime)}</span>
                    </>
                  )}
                  {micState === "processing" && <span className="font-mono text-[10px]">Processing…</span>}
                </button>
                <button type="button" onClick={() => setRefineOpen((v) => !v)} className="hidden h-8 items-center rounded-full border border-[rgba(255,255,255,0.1)] px-3 font-mono text-[12px] text-[#9AA0A6] transition-all hover:border-[rgba(255,255,255,0.18)] hover:text-[#F5F5F2] sm:flex">
                  Refine Brief
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                  <button type="button" onClick={() => setShowDropdown((d) => !d)} className="flex h-8 items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.1)] px-3 font-mono text-[12px] text-[#9AA0A6] transition-all hover:border-[rgba(255,255,255,0.18)] hover:text-[#F5F5F2]">
                    {workspace} <ChevronDown size={11} />
                  </button>
                  {showDropdown && (
                    <div className="absolute bottom-full right-0 z-50 mb-2 w-44 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0F0F12] py-1 shadow-2xl">
                      {WORKSPACE_OPTIONS.map((opt) => (
                        <button key={opt} type="button" onClick={() => { setWorkspace(opt); setShowDropdown(false); }} className={`w-full px-4 py-2.5 text-left font-mono text-[12px] transition-colors ${workspace === opt ? "bg-[rgba(199,164,90,0.07)] text-[#D6B25E]" : "text-[#9AA0A6] hover:bg-white/[0.04] hover:text-[#F5F5F2]"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex h-9 items-center gap-2 rounded-full px-5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundImage: generating
                      ? "linear-gradient(180deg, rgba(215,179,98,0.22), rgba(168,127,54,0.22))"
                      : "linear-gradient(180deg, #F0DDA0 0%, #D7B362 44%, #A87F36 100%)",
                    color: generating ? "#E7CE8E" : "#1A1303",
                    border: "1px solid rgba(240,221,160,0.55)",
                    boxShadow:
                      "0 10px 30px rgba(168,127,54,0.4), 0 1px 0 rgba(255,244,214,0.55) inset, 0 -1px 0 rgba(120,90,30,0.45) inset",
                  }}
                >
                  {generating ? (
                    <span style={{ backgroundImage: "linear-gradient(90deg,#D6B25E 30%,#E9D8A6 50%,#D6B25E 70%)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "emovelShimmer 1.6s linear infinite" }}>
                      Generating…
                    </span>
                  ) : (
                    <>Generate Workspace <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </div>

            {refineOpen && (
              <div className="mt-4 grid gap-3 border-t border-[rgba(255,255,255,0.055)] pt-4 md:grid-cols-2">
                {refineFields.map((field) => (
                  <label key={field.key} className="grid gap-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/34">{field.label}</span>
                    <input
                      value={brief[field.key]}
                      onChange={(e) => setBrief((c) => ({ ...c, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-sm text-[#F5F5F2] outline-none transition placeholder:text-white/24 focus:border-[#D6B25E]/45 focus:bg-[#D6B25E]/[0.05]"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Starter chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {STARTER_CHIPS.map((chip) => (
            <button key={chip} type="button" onClick={() => setPrompt(chip)} className="h-8 rounded-full border border-[rgba(255,255,255,0.09)] bg-transparent px-4 font-mono text-[12px] text-[#9AA0A6] transition-all hover:border-[rgba(255,255,255,0.16)] hover:bg-white/[0.02] hover:text-[#F5F5F2]">
              {chip}
            </button>
          ))}
        </div>

        {/* Capability cards */}
        <section className="mt-28 w-full max-w-[1080px] px-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITY_CARDS.map((card) => (
              <div key={card.title} className="group relative cursor-default rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#16161A] p-6 transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(199,164,90,0.28)]" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                <div className="relative z-[1] mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(199,164,90,0.18)] bg-[rgba(199,164,90,0.09)] text-[#D6B25E] transition-all duration-300 group-hover:border-[rgba(199,164,90,0.28)] group-hover:bg-[rgba(199,164,90,0.14)]">
                  {card.icon}
                </div>
                <h3 className="relative z-[1] mb-2 text-[15px] font-semibold tracking-[-0.02em] text-[#F5F5F2]">{card.title}</h3>
                <p className="relative z-[1] mb-5 text-[13px] leading-relaxed text-[#9AA0A6]">{card.desc}</p>
                <div className="relative z-[1] inline-flex h-6 items-center rounded-md border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#9AA0A6]">{card.tag}</span>
                </div>
                <span className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-[#2E6BFF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: "0 0 7px rgba(46,107,255,0.85)" }} />
              </div>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA0A6]/40">Scroll to explore capabilities ⌄</span>
          </div>
        </section>
      </div>
    </main>
  );
}
