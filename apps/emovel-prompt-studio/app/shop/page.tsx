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
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "Published" || status === "Listed" || status === "Ready to Publish") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Ready for Gumroad" || status === "Building") {
    return "border-blue/20 bg-blue/10 text-blue";
  }

  return "border-line bg-cloud text-slate-700";
}

export default async function ShopPage() {
  const products = await listShopProducts();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Shop Foundation
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            Products prepared for Gumroad.
          </h1>
        </div>
        <Link className="rounded-emovel border border-line bg-white px-5 py-3 font-black" href="/builder-workspaces">
          Builder Workspaces
        </Link>
      </div>

      {products.length > 0 ? (
        <section className="grid gap-4">
          {products.map((product) => (
            <article className="rounded-emovel border border-line bg-white p-5" key={product.slug}>
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em]">{product.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs font-bold text-slate-600">
                    <span className={`rounded-full border px-3 py-1 ${statusBadgeClass(product.shopStatus)}`}>
                      Shop: {product.shopStatus || "Draft"}
                    </span>
                    {product.buildStatus ? (
                      <span className={`rounded-full border px-3 py-1 ${statusBadgeClass(product.buildStatus)}`}>
                        Build: {product.buildStatus}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-cloud px-3 py-1">
                      Assets {product.assetChecklist.done}/{product.assetChecklist.total}
                    </span>
                    <span className="rounded-full bg-cloud px-3 py-1">
                      Modified {formatDate(product.lastModified)}
                    </span>
                  </div>
                  <p className="mt-4 max-w-3xl leading-7 text-slate-600">{product.gumroadPreview}</p>
                </div>
                <Link
                  className="rounded-emovel bg-ink px-5 py-3 text-center font-black text-white transition hover:-translate-y-0.5"
                  href={`/shop/${product.slug}`}
                >
                  Open publish package
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-emovel border border-line bg-white p-8">
          <h2 className="text-2xl font-black">No shop products yet.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Prepare a publish package from a builder workspace to make it appear in the local shop dashboard.
          </p>
          <Link
            className="mt-6 inline-flex rounded-emovel bg-blue px-5 py-3 font-black text-white"
            href="/builder-workspaces"
          >
            View builder workspaces
          </Link>
        </section>
      )}
    </main>
  );
}
