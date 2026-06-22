"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  migrateProjectToSchemaV1,
  type ProjectSchemaV1,
} from "../lib/project-schema";

type LocalProject = ProjectSchemaV1;

type CommandCenterProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Command = {
  id: string;
  label: string;
  description: string;
  group: string;
  keywords: string;
  tone?: "default" | "danger";
  run: () => void;
};

const PROJECTS_KEY = "emovel-projects";

function createProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `workspace-${Date.now().toString(36)}`;
}

function readProjects() {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (!stored) return [];

  try {
    const projects = (JSON.parse(stored) as unknown[])
      .map((item) => migrateProjectToSchemaV1(item))
      .filter((item): item is LocalProject => Boolean(item))
      .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return projects;
  } catch {
    return [];
  }
}

function writeProjects(projects: LocalProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function CommandCenter({ open, onOpenChange }: CommandCenterProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projects, setProjects] = useState<LocalProject[]>([]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCommandK) {
        event.preventDefault();
        onOpenChange(!open);
      }
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    setProjects(readProjects());
    setQuery("");
    setSelectedIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  function closeAndRoute(path: string) {
    onOpenChange(false);
    router.push(path);
  }

  function duplicateProject(project: LocalProject) {
    const duplicate: LocalProject = {
      ...project,
      id: createProjectId(),
      title: `${project.title} Copy`,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      status: "Ready",
      versions: [
        ...project.versions,
        {
          id: `${project.id}-command-copy-${Date.now().toString(36)}`,
          label: "Duplicated project",
          createdAt: new Date().toISOString(),
          reason: "Project duplicated from Command Center",
        },
      ],
    };
    const nextProjects = [duplicate, ...projects];
    setProjects(nextProjects);
    writeProjects(nextProjects);
    localStorage.setItem(`emovel-project:${duplicate.id}`, JSON.stringify(duplicate));
    onOpenChange(false);
    router.push(`/workspace/${duplicate.id}`);
  }

  function deleteProject(project: LocalProject) {
    const nextProjects = projects.filter((item) => item.id !== project.id);
    setProjects(nextProjects);
    writeProjects(nextProjects);
    localStorage.removeItem(`emovel-project:${project.id}`);
    setSelectedIndex(0);
  }

  const commands = useMemo<Command[]>(() => {
    const baseCommands: Command[] = [
      {
        id: "create-project",
        label: "Create new project",
        description: "Return to the prompt composer",
        group: "Navigation",
        keywords: "new create home prompt composer",
        run: () => closeAndRoute("/"),
      },
      {
        id: "open-projects",
        label: "Open Projects",
        description: "Browse local project library",
        group: "Navigation",
        keywords: "projects library",
        run: () => closeAndRoute("/projects"),
      },
      {
        id: "open-shop",
        label: "Open Shop",
        description: "View publish packages",
        group: "Navigation",
        keywords: "shop publish products",
        run: () => closeAndRoute("/shop"),
      },
      {
        id: "open-settings",
        label: "Open Settings",
        description: "Configure EMOVEL workspace defaults",
        group: "Navigation",
        keywords: "settings preferences config",
        run: () => closeAndRoute("/settings"),
      },
    ];

    const projectCommands = projects.flatMap((project): Command[] => [
      {
        id: `open-${project.id}`,
        label: `Open workspace: ${project.title}`,
        description: project.prompt,
        group: "Workspaces",
        keywords: `${project.title} ${project.prompt} open workspace`,
        run: () => closeAndRoute(`/workspace/${project.id}`),
      },
      {
        id: `duplicate-${project.id}`,
        label: `Duplicate project: ${project.title}`,
        description: "Create a local copy and open it",
        group: "Project actions",
        keywords: `${project.title} duplicate copy`,
        run: () => duplicateProject(project),
      },
      {
        id: `delete-${project.id}`,
        label: `Delete project: ${project.title}`,
        description: "Remove this local project from browser storage",
        group: "Project actions",
        keywords: `${project.title} delete remove`,
        tone: "danger",
        run: () => deleteProject(project),
      },
    ]);

    return [...baseCommands, ...projectCommands];
  }, [projects]);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.description} ${command.group} ${command.keywords}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function runSelected() {
    const command = filteredCommands[selectedIndex];
    if (command) command.run();
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, filteredCommands.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      runSelected();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24">
      <button
        type="button"
        aria-label="Close command center"
        className="absolute inset-0 cursor-default bg-black/62 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
      />

      <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#A855F7]/22 bg-[#090512]/95 shadow-[0_32px_120px_rgba(0,0,0,0.74),0_0_120px_rgba(139,92,246,0.24)]">
        <div className="border-b border-white/[0.07] p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.075] bg-white/[0.04] px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-[#A855F7] shadow-[0_0_18px_#A855F7]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search commands, projects, actions..."
              className="w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/28"
            />
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-2 py-1 font-mono text-[10px] text-white/35">
              Esc
            </span>
          </div>
        </div>

        <div className="max-h-[520px] overflow-auto p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => {
              const selected = index === selectedIndex;
              return (
                <button
                  key={command.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => command.run()}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left transition ${
                    selected ? "bg-[#8B5CF6]/16" : "hover:bg-white/[0.045]"
                  }`}
                >
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-sm font-bold ${
                        command.tone === "danger" ? "text-red-200" : "text-white/86"
                      }`}
                    >
                      {command.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-white/36">
                      {command.description}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 font-mono text-[10px] text-white/32">
                    {command.group}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-white/42">No commands found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
