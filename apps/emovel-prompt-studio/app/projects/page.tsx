"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LocalProjectStatus = "Generating" | "Ready";

type LocalProject = {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  status: LocalProjectStatus;
  assets?: Record<string, unknown>;
};

type ReadinessStatus = "Draft" | "Needs Work" | "Ready to Build" | "Ready to Launch";
type FilterValue = "All" | "Needs Work" | "Ready to Build" | "Ready to Launch";
type SortValue = "newest" | "highest-readiness" | "lowest-readiness";

const PROJECTS_KEY = "emovel-projects";
const filters: FilterValue[] = ["All", "Needs Work", "Ready to Build", "Ready to Launch"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function createProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `workspace-${Date.now().toString(36)}`;
}

function assetCount(project: LocalProject) {
  if (!project.assets) return 0;
  return Object.keys(project.assets).length;
}

function readReview(project: LocalProject) {
  const review = project.assets?.review as
    | {
        productReadiness?: number;
        buildReadiness?: number;
        launchReadiness?: number;
      }
    | undefined;

  return {
    productReadiness: review?.productReadiness || 0,
    buildReadiness: review?.buildReadiness || 0,
    launchReadiness: review?.launchReadiness || 0,
  };
}

function averageReadiness(project: LocalProject) {
  const review = readReview(project);
  return Math.round(
    (review.productReadiness + review.buildReadiness + review.launchReadiness) / 3
  );
}

function readinessStatus(project: LocalProject): ReadinessStatus {
  const review = readReview(project);
  const average = averageReadiness(project);

  if (!project.assets?.review || average === 0) return "Draft";
  if (review.launchReadiness >= 8 && review.productReadiness >= 8 && review.buildReadiness >= 7) {
    return "Ready to Launch";
  }
  if (review.productReadiness >= 7 && review.buildReadiness >= 8) return "Ready to Build";
  return "Needs Work";
}

function statusClass(status: ReadinessStatus) {
  if (status === "Ready to Launch") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
  }
  if (status === "Ready to Build") {
    return "border-[#A855F7]/28 bg-[#8B5CF6]/12 text-violet-200";
  }
  if (status === "Needs Work") {
    return "border-amber-300/25 bg-amber-300/10 text-amber-200";
  }
  return "border-white/[0.08] bg-white/[0.035] text-white/42";
}

function readProjects() {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (!stored) return [];

  try {
    return (JSON.parse(stored) as LocalProject[]).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

function writeProjects(projects: LocalProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("All");
  const [sort, setSort] = useState<SortValue>("newest");

  useEffect(() => {
    setProjects(readProjects());
    setLoaded(true);
  }, []);

  const visibleProjects = useMemo(() => {
    const filtered =
      filter === "All"
        ? projects
        : projects.filter((project) => readinessStatus(project) === filter);

    return [...filtered].sort((a, b) => {
      if (sort === "highest-readiness") return averageReadiness(b) - averageReadiness(a);
      if (sort === "lowest-readiness") return averageReadiness(a) - averageReadiness(b);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filter, projects, sort]);

  function duplicateProject(project: LocalProject) {
    const duplicate: LocalProject = {
      ...project,
      id: createProjectId(),
      title: `${project.title} Copy`,
      createdAt: new Date().toISOString(),
      status: "Ready",
    };
    const nextProjects = [duplicate, ...projects];
    setProjects(nextProjects);
    writeProjects(nextProjects);
    localStorage.setItem(`emovel-project:${duplicate.id}`, JSON.stringify(duplicate));
  }

  function deleteProject(project: LocalProject) {
    const nextProjects = projects.filter((item) => item.id !== project.id);
    setProjects(nextProjects);
    writeProjects(nextProjects);
    localStorage.removeItem(`emovel-project:${project.id}`);
  }

  return (
    <main className="relative min-h-[calc(100dvh-64px)] overflow-hidden bg-[#05020A] px-5 py-10 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#8B5CF6]/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-260px] right-[-180px] h-[560px] w-[680px] rounded-full bg-[#A855F7]/12 blur-3xl"
      />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
              Project Library
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white md:text-5xl">
              Local workspaces.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/52">
              Browse every prompt-generated EMOVEL workspace stored in this browser.
            </p>
          </div>

          <Link
            className="rounded-2xl bg-[#8B5CF6] px-5 py-3 text-sm font-black text-white shadow-[0_18px_55px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#A855F7]"
            href="/"
          >
            Create Project
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-3 backdrop-blur-2xl">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  filter === item
                    ? "bg-[#8B5CF6]/18 text-white shadow-[inset_0_0_0_1px_rgba(168,85,247,0.22)]"
                    : "text-white/48 hover:bg-white/[0.045] hover:text-white/82"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-white/40">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="rounded-2xl border border-white/[0.08] bg-[#0B0614] px-3 py-2 text-sm font-bold text-white/72 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="highest-readiness">Highest readiness</option>
              <option value="lowest-readiness">Lowest readiness</option>
            </select>
          </label>
        </div>

        {!loaded ? (
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 text-white/50 backdrop-blur-2xl">
            Loading projects...
          </section>
        ) : visibleProjects.length > 0 ? (
          <section className="grid gap-4">
            {visibleProjects.map((project) => {
              const review = readReview(project);
              const status = readinessStatus(project);

              return (
                <article
                  key={project.id}
                  className="group rounded-3xl border border-white/[0.075] bg-white/[0.035] p-5 backdrop-blur-2xl transition hover:border-[#A855F7]/28 hover:bg-white/[0.05] md:p-6"
                >
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${statusClass(status)}`}>
                          {status}
                        </span>
                        <span className="rounded-full border border-[#8B5CF6]/24 bg-[#8B5CF6]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">
                          {assetCount(project)} assets
                        </span>
                      </div>

                      <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">
                        {project.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-white/54">
                        {project.prompt}
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {[
                          { label: "Product", value: review.productReadiness },
                          { label: "Build", value: review.buildReadiness },
                          { label: "Launch", value: review.launchReadiness },
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-white/[0.055] bg-black/16 px-3 py-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                              {item.label}
                            </p>
                            <p className="mt-1 text-lg font-black text-white">
                              {item.value || "-"}
                              {item.value ? <span className="text-xs text-white/30">/10</span> : null}
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="mt-4 font-mono text-[11px] text-white/32">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link
                        href={`/workspace/${project.id}`}
                        className="rounded-2xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_40px_rgba(139,92,246,0.25)] transition hover:bg-[#A855F7]"
                      >
                        Open workspace
                      </Link>
                      <button
                        type="button"
                        onClick={() => duplicateProject(project)}
                        className="rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 py-2.5 text-sm font-bold text-white/68 transition hover:border-[#A855F7]/35 hover:bg-[#8B5CF6]/12 hover:text-white"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project)}
                        className="rounded-2xl border border-red-400/10 bg-red-400/[0.035] px-4 py-2.5 text-sm font-bold text-red-200/58 transition hover:border-red-400/25 hover:bg-red-400/10 hover:text-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-10 text-center backdrop-blur-2xl">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
              Empty Library
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white">
              Create your first project.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/50">
              Start from the Home composer. EMOVEL will create a local workspace
              with structured strategy, offer, copy, UX, design, build, and publish assets.
            </p>
            <Link
              className="mt-7 inline-flex rounded-2xl bg-[#8B5CF6] px-6 py-3 text-sm font-black text-white shadow-[0_18px_55px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#A855F7]"
              href="/"
            >
              Create your first project
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
