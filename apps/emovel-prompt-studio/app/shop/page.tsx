import Link from "next/link";
import { listShopProducts, type BuildStatus, type ShopStatus } from "@/lib/projects";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function statusBadgeClass(status: BuildStatus | ShopStatus | null) {
  if (status === "Needs Update" || status === "Build Failed") {
    return "border-red-500/30 bg-red-500/10 text-red-400";
  }
  if (status === "Published" || status === "Listed" || status === "Ready to Publish") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }
  if (status === "Ready for Gumroad" || status === "Building") {
    return "border-[#C7A45A]/30 bg-[#C7A45A]/10 text-[#C7A45A]";
  }
  return "border-white/[0.07] bg-white/[0.03] text-white/40";
}

export default async function ShopPage() {
  const products = await listShopProducts();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#C7A45A]">
            Shop Foundation
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
            Products prepared for Gumroad.
          </h1>
        </div>
        <Link
          className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition duration-200 hover:bg-white/[0.08] hover:text-white/90"
          href="/builder-workspaces"
        >
          Builder Workspaces
        </Link>
      </div>

      {products.length > 0 ? (
        <section className="grid gap-4">
          {products.map((product) => (
            <article
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition duration-200 hover:border-[#C7A45A]/15 hover:bg-white/[0.035]"
              key={product.slug}
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em] text-white">
                    {product.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${statusBadgeClass(product.shopStatus)}`}>
                      Shop: {product.shopStatus || "Draft"}
                    </span>
                    {product.buildStatus ? (
                      <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${statusBadgeClass(product.buildStatus)}`}>
                        Build: {product.buildStatus}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/40">
                      Assets {product.assetChecklist.done}/{product.assetChecklist.total}
                    </span>
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/35">
                      Modified {formatDate(product.lastModified)}
                    </span>
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45">
                    {product.gumroadPreview}
                  </p>
                </div>
                <Link
                  className="rounded-xl bg-[#A8863F] px-5 py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#C7A45A]"
                  href={`/shop/${product.slug}`}
                >
                  Open publish package
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-10 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-white">
            No shop products yet.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/40">
            Prepare a publish package from a builder workspace to make it appear in the local shop dashboard.
          </p>
          <Link
            className="mt-6 inline-flex rounded-xl bg-[#A8863F] px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#C7A45A]"
            href="/builder-workspaces"
          >
            View builder workspaces
          </Link>
        </section>
      )}
    </main>
  );
}
