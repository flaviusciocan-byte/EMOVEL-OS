const settingSections = [
  {
    label: "Pipeline",
    rows: [
      {
        title: "Pipeline Version",
        description: "Active production pipeline template",
        value: "v1",
        variant: "violet" as const
      },
      {
        title: "Output Directory",
        description: "Local generated project storage",
        value: "projects/generated/",
        variant: "mono" as const
      },
      {
        title: "Skills Source",
        description: "Prompt routing knowledge base",
        value: "knowledge/skills/",
        variant: "mono" as const
      }
    ]
  },
  {
    label: "Interface",
    rows: [
      {
        title: "Theme",
        description: "Visual design system applied globally",
        value: "EMOVEL Dark",
        variant: "violet" as const
      },
      {
        title: "Complexity",
        description: "Advanced options are hidden until needed",
        value: "Progressive",
        variant: "neutral" as const
      }
    ]
  },
  {
    label: "Publishing",
    rows: [
      {
        title: "Default Targets",
        description: "Gumroad, Instagram, Email - configurable per project in Prompt Studio",
        value: "3 active",
        variant: "neutral" as const
      }
    ]
  }
];

function Badge({
  value,
  variant
}: {
  value: string;
  variant: "violet" | "mono" | "neutral";
}) {
  const base = "rounded-lg px-3 py-1.5 font-mono text-xs font-bold";
  if (variant === "violet")
    return (
      <span className={`${base} border border-violet-500/20 bg-violet-500/10 text-violet-300`}>
        {value}
      </span>
    );
  if (variant === "mono")
    return (
      <span className={`${base} border border-white/[0.07] bg-white/[0.03] text-white/40`}>
        {value}
      </span>
    );
  return (
    <span className={`${base} border border-white/[0.06] bg-white/[0.02] text-white/35`}>
      {value}
    </span>
  );
}

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-violet-400">
          System
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
          Settings
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
          EMOVEL OS configuration, pipeline preferences, and interface options.
        </p>
      </div>

      {/* Setting sections */}
      <div className="grid gap-3">
        {settingSections.map((section) => (
          <section
            key={section.label}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-sm"
          >
            <h2 className="mb-5 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
              {section.label}
            </h2>
            <div className="grid gap-0 divide-y divide-white/[0.05]">
              {section.rows.map((row) => (
                <div
                  key={row.title}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/85">{row.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-white/35">{row.description}</p>
                  </div>
                  <div className="shrink-0">
                    <Badge value={row.value} variant={row.variant} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Version footer */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5 text-center">
          <p className="font-mono text-[10px] text-white/20">
            EMOVEL OS - Local Build - Pipeline v1
          </p>
        </div>
      </div>
    </main>
  );
}
