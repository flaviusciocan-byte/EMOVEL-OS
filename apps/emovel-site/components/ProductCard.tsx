import Link from "next/link";
import type { Product } from "@/lib/products";

function cn(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

export function ProductCard({ product }: { product: Product }) {
  const available = product.status === "available";

  return (
    <Link
      href={product.href}
      className={cn(
        "group block rounded-lg border p-7 transition-all duration-200 no-underline",
        available
          ? "border-[#D9DEE7] bg-white hover:border-[#2F6BFF]/40 hover:shadow-lg"
          : "border-[#D9DEE7] bg-[#F5F7FA] hover:border-[#D9DEE7]/80 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={cn(
            "inline-block font-mono text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full",
            available
              ? "bg-[#2F6BFF]/10 text-[#2F6BFF]"
              : "bg-[#D9DEE7] text-gray-400"
          )}
        >
          {product.badge}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
          {product.category}
        </span>
      </div>

      <h3
        className="text-xl font-semibold text-[#101114] tracking-tight mb-2 group-hover:text-[#2F6BFF] transition-colors duration-150"
        style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
      >
        {product.name}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-[#101114] tracking-tight">
          {product.price}
        </span>
        {product.priceAlt && available && (
          <span className="text-xs text-gray-400">{product.priceAlt}</span>
        )}
        {!available && (
          <span className="text-xs text-gray-400 font-mono">Coming soon</span>
        )}
      </div>
    </Link>
  );
}
