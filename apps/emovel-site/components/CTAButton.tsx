import Link from "next/link";

function cn(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  external?: boolean;
  className?: string;
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  external,
  className,
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2 cursor-pointer no-underline";

  const sizes = {
    sm: "text-sm px-4 py-2 min-h-[36px]",
    md: "text-base px-6 py-3 min-h-[44px]",
    lg: "text-lg px-9 py-4 min-h-[52px]",
  };

  const variants = {
    primary:
      "bg-[#2F6BFF] text-white hover:bg-[#1A55E8] hover:scale-[1.01]",
    outline:
      "border border-[#2F6BFF] text-[#2F6BFF] bg-transparent hover:bg-[#2F6BFF]/5",
    ghost:
      "text-[#101114] hover:text-[#2F6BFF] bg-transparent",
  };

  const cls = cn(base, sizes[size], variants[variant], fullWidth && "w-full", className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
