import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getBrandMechanismProfile, runAndPersistBrandMechanismAudit } from "@/lib/brand-os";
import { BrandAuditForm, type SubmitAuditResult } from "@/components/BrandAuditForm";

export const dynamic = "force-dynamic";

type BrandAuditPageProps = {
  params: { slug: string };
};

export default async function BrandAuditPage({ params }: BrandAuditPageProps) {
  const existingProfile = await getBrandMechanismProfile(params.slug);

  async function submitAudit(answers: Record<string, number>): Promise<SubmitAuditResult> {
    "use server";
    const out = await runAndPersistBrandMechanismAudit(answers, { slug: params.slug });
    if (!out.ok) {
      return { ok: false, errors: out.errors };
    }
    revalidatePath(`/brand-os/${params.slug}/audit`);
    return { ok: true, profile: out.profile };
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-10">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/40">Brand OS</p>
          <Link href="/projects" className="font-mono text-xs text-white/35 transition hover:text-white/70">
            ← Projects
          </Link>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
          Brand Mechanism Audit
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
          A 20-question diagnostic that identifies how your brand converts: through identification, aspiration, safety,
          habit, or differentiation.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          This audit does not define your visual identity. It identifies the psychological mechanism your brand should
          use across pages, ads, emails and content. The result is saved as strategic DNA inside Brand OS.
        </p>
        <p className="mt-4 font-mono text-[10px] text-white/25">projects/brand-os/{params.slug}.json</p>
      </div>

      <BrandAuditForm slug={params.slug} existingProfile={existingProfile} action={submitAudit} />
    </main>
  );
}
