import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import {
  projectNameFromSlug,
  readShopPackage,
  readShopStatus,
  updateShopStatus,
  type ShopStatus
} from "@/lib/projects";

export const dynamic = "force-dynamic";

type ShopProductPageProps = {
  params: {
    slug: string;
  };
};

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.md$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusBadgeClass(status: ShopStatus | null) {
  if (status === "Needs Update") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "Listed" || status === "Published") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Ready for Gumroad") {
    return "border-blue/20 bg-blue/10 text-blue";
  }

  return "border-line bg-cloud text-slate-700";
}

export default async function ShopProductPage({ params }: ShopProductPageProps) {
  const files = await readShopPackage(params.slug);
  const shopStatus = await readShopStatus(params.slug);

  if (!files) {
    notFound();
  }

  async function markAsListedAction() {
    "use server";

    await updateShopStatus(params.slug, "Listed");
    revalidatePath("/shop");
    revalidatePath(`/shop/${params.slug}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Shop Product
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            {projectNameFromSlug(params.slug)}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold text-slate-600">
            projects/build-workspaces/{params.slug}/publish-package/
          </p>
          <span
            className={`mt-4 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-black ${statusBadgeClass(
              shopStatus
            )}`}
          >
            {shopStatus || "Draft"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <form action={markAsListedAction}>
            <button
              className="rounded-emovel bg-mint px-5 py-3 font-black text-ink transition hover:-translate-y-0.5"
              type="submit"
            >
              Mark as Listed
            </button>
          </form>
          <Link className="rounded-emovel border border-line bg-white px-5 py-3 font-black" href="/shop">
            Back to Shop
          </Link>
        </div>
      </div>

      <p className="mb-5 rounded-emovel border border-line bg-white p-4 font-mono text-xs font-bold text-slate-600">
        Local shop foundation only. Gumroad is not connected and no product is published from this UI.
      </p>

      <section className="grid gap-4">
        {files.map((file) => (
          <article className="overflow-hidden rounded-emovel border border-line bg-white" key={file.filename}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cloud px-5 py-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.02em]">{titleFromFilename(file.filename)}</h2>
                <p className="mt-1 font-mono text-xs font-bold text-slate-600">{file.filename}</p>
              </div>
              <CopyMarkdownButton content={file.content} />
            </div>
            {file.exists ? (
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-slate-800">
                {file.content}
              </pre>
            ) : (
              <div className="p-5 text-sm font-bold text-slate-500">
                This shop file has not been created yet.
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
