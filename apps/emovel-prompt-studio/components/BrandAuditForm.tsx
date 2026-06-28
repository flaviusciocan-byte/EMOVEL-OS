"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { likertScale, mechanisms, type Likert, type MechanismId } from "@/lib/brand-mechanism";
import type { BrandMechanismProfile } from "@/lib/brand-os";

export type SubmitAuditResult =
  | { ok: true; profile: BrandMechanismProfile }
  | { ok: false; errors: string[] };

type BrandAuditFormProps = {
  slug: string;
  existingProfile: BrandMechanismProfile | null;
  action: (answers: Record<string, number>) => Promise<SubmitAuditResult>;
};

const orderedMechanisms = mechanisms;
const TOTAL_QUESTIONS = mechanisms.reduce((n, m) => n + m.questions.length, 0);
const likertValues: Likert[] = [1, 2, 3, 4, 5];

function mechanismName(id: MechanismId): string {
  return mechanisms.find((m) => m.id === id)?.name ?? id;
}

function ProfileSummary({ profile }: { profile: BrandMechanismProfile }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Dominant mechanism</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">{mechanismName(profile.dominant_mechanism)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Secondary mechanism</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white/80">{mechanismName(profile.secondary_mechanism)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Congruence</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white/80">{profile.congruence_level}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Mechanism scores</p>
        <div className="mt-4 grid gap-3">
          {orderedMechanisms.map((m) => {
            const pct = profile.percentages[m.id];
            return (
              <div key={m.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{m.name}</span>
                  <span className="font-mono text-xs text-white/40">{profile.scores[m.id]}/20 · {pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-white/70" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Recommended tone</p>
          <p className="mt-2 text-sm leading-6 text-white/70">{profile.recommended_tone}</p>
          <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Recommended content types</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.recommended_content_types.map((c) => (
              <span key={c} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-white/60">{c}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/70">Strategic warning</p>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">{profile.strategic_warning}</p>
        </div>
      </div>
    </div>
  );
}

export function BrandAuditForm({ slug, existingProfile, action }: BrandAuditFormProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [savedProfile, setSavedProfile] = useState<BrandMechanismProfile | null>(existingProfile);
  const [justSaved, setJustSaved] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  function setAnswer(qid: string, value: Likert) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    if (errors.length) setErrors([]);
  }

  function handleSubmit() {
    if (!allAnswered) {
      setErrors(["Complete all 20 questions before saving your Brand Mechanism Profile."]);
      return;
    }
    startTransition(async () => {
      const res = await action(answers);
      if (!res.ok) {
        setErrors(res.errors);
        return;
      }
      setErrors([]);
      setSavedProfile(res.profile);
      setJustSaved(true);
      setRetaking(false);
    });
  }

  // 1) Success state after a fresh save.
  if (justSaved && savedProfile) {
    return (
      <div className="grid gap-6">
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/70">Saved to Brand OS</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">Brand Mechanism Profile Saved</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Your Brand OS now contains a strategic mechanism profile. Future EMOVEL generators can use it to produce more
            aligned headlines, landing pages, ads, emails and content assets.
          </p>
          <p className="mt-3 font-mono text-[10px] text-white/30">projects/brand-os/{slug}.json</p>
        </div>
        <ProfileSummary profile={savedProfile} />
        <div className="flex flex-wrap gap-3">
          <Link href="/projects" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90">
            Continue to brand-aware generation
          </Link>
          <button
            type="button"
            onClick={() => { setJustSaved(false); setRetaking(true); setAnswers({}); }}
            className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/[0.07] hover:text-white"
          >
            Retake audit
          </button>
        </div>
      </div>
    );
  }

  // 2) Existing-profile state (before retaking).
  if (savedProfile && !retaking) {
    return (
      <div className="grid gap-6">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Existing profile</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">This brand already has a strategic mechanism profile</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Retaking the audit recalculates and overwrites the saved profile. Nothing is deleted until you save a new result.
          </p>
        </div>
        <ProfileSummary profile={savedProfile} />
        <div>
          <button
            type="button"
            onClick={() => { setRetaking(true); setAnswers({}); }}
            className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
          >
            Update / retake audit
          </button>
        </div>
      </div>
    );
  }

  // 3) Questionnaire.
  return (
    <div className="grid gap-6">
      <div className="sticky top-0 z-10 -mx-1 rounded-2xl border border-white/[0.08] bg-os-bg/80 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/40">Progress</p>
          <p className="font-mono text-xs text-white/50">{answeredCount} / {TOTAL_QUESTIONS}</p>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }} />
        </div>
      </div>

      {orderedMechanisms.map((m, mi) => (
        <section key={m.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold text-white/25">{String(mi + 1).padStart(2, "0")}</span>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">{m.name}</h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-white/40">{m.description}</p>
          <div className="mt-5 grid gap-5">
            {m.questions.map((q) => (
              <div key={q.id}>
                <p className="text-sm leading-6 text-white/80">{q.text}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {likertValues.map((v) => {
                    const selected = answers[q.id] === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        title={likertScale.labels[v]}
                        aria-pressed={selected}
                        onClick={() => setAnswer(q.id, v)}
                        className={
                          selected
                            ? "h-9 min-w-[2.5rem] rounded-lg bg-white px-3 text-sm font-semibold text-black"
                            : "h-9 min-w-[2.5rem] rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 text-sm font-medium text-white/50 transition hover:border-white/25 hover:text-white/80"
                        }
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center justify-between gap-3 text-xs text-white/35">
        <span>1 = {likertScale.labels[1]}</span>
        <span>5 = {likertScale.labels[5]}</span>
      </div>

      {errors.length ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-400/[0.06] p-4">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-200/80">{e}</p>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered || isPending}
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
        >
          {isPending ? "Saving…" : "Save Strategic DNA"}
        </button>
        {!allAnswered ? (
          <span className="text-xs text-white/35">Answer all {TOTAL_QUESTIONS} questions to continue.</span>
        ) : null}
      </div>
    </div>
  );
}
