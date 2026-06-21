import { routeCommand, type RoutedCommand } from "./command-router";
import { targetToolMap, type BuilderTarget, type PublishingTarget } from "./targets";

export type ExecutionPlanInput = {
  command: string;
  projectName: string;
  projectSlug: string;
  builderTarget?: BuilderTarget;
  publishingTargets?: PublishingTarget[];
};

function list(values: string[]) {
  return values.map((value) => `- ${value}`).join("\n");
}

function selectedTargetTools(builderTarget: BuilderTarget, publishingTargets: PublishingTarget[]) {
  return [
    ...targetToolMap[builderTarget],
    ...publishingTargets.flatMap((target) => targetToolMap[target])
  ];
}

export function generateExecutionPlan(input: ExecutionPlanInput) {
  const routed: RoutedCommand = routeCommand(input.command);
  const builderTarget = input.builderTarget || routed.builderTarget;
  const publishingTargets = input.publishingTargets?.length ? input.publishingTargets : routed.publishingTargets;
  const tools = Array.from(new Set([...routed.selectedTools, ...selectedTargetTools(builderTarget, publishingTargets)]));

  return `# Execution Plan: ${input.projectName}

## Command

${input.command}

## Router Result

- Intent: ${routed.intent}
- Confidence: ${routed.confidence}
- Pipeline: ${routed.selectedPipeline}

## Selected Skills

${list(routed.selectedSkills)}

## Selected Tools

${list(tools)}

## Builder Target

${builderTarget}

## Publishing Targets

${list(publishingTargets)}

## Output Targets

- projects/generated/${input.projectSlug}/
- projects/build-workspaces/${input.projectSlug}/
- projects/build-workspaces/${input.projectSlug}/publish-package/
- projects/build-workspaces/${input.projectSlug}/execution-plan.md

## Execution Sequence

1. Generate or refresh production pipeline files.
2. Create builder workspace.
3. Generate builder handoff files.
4. Generate publish package files.
5. Set build and shop statuses manually.
6. Review output in Prompt Studio dashboards.
7. Run external builder or publishing actions manually outside Prompt Studio.

## Safety Boundary

Prompt Studio prepares orchestration only. It does not run builders, execute shell commands, connect paid APIs, publish to social platforms, send email, or create Gumroad products automatically.
`;
}
