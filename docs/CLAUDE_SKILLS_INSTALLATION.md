# Claude Skills Installation

This records real commands found in downloaded repositories. No Claude slash commands were executed automatically from PowerShell.

## 21st.dev MCP

No direct Claude MCP install command was found in:

`C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main\README.md`

Detected 21st SDK setup:

```powershell
cd C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main
pnpm.cmd install
pnpm.cmd run dev
```

The repo contains MCP-related implementation code, but the README does not document a one-line Claude MCP registration command.

## UI UX Pro Max

Detected in `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\README.md`:

```text
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Local skill paths:

```text
C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\.claude\skills\ui-ux-pro-max
C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\.claude\skills\ui-styling
C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\.claude\skills\design-system
```

## GSAP / Motion Skills

No dedicated GSAP skill was detected in `skills-main` or `ui-ux-pro-max-skill-main`.

Use the available motion-capable design skills until a GSAP-specific skill is installed:

```text
C:\EMOVEL\tools\skills-main\skills-main\skills\frontend-design
C:\EMOVEL\tools\skills-main\skills-main\skills\web-artifacts-builder
C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\.claude\skills\ui-styling
```

Production rule: GSAP should be added per app as a project dependency only when the target app actually uses GSAP motion.

## Anthropic Skills Repository

Detected in `C:\EMOVEL\tools\skills-main\skills-main\README.md`:

```text
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

Useful local skill paths:

```text
C:\EMOVEL\tools\skills-main\skills-main\skills\frontend-design
C:\EMOVEL\tools\skills-main\skills-main\skills\webapp-testing
C:\EMOVEL\tools\skills-main\skills-main\skills\web-artifacts-builder
C:\EMOVEL\tools\skills-main\skills-main\skills\mcp-builder
C:\EMOVEL\tools\skills-main\skills-main\skills\canvas-design
```

## EMOVEL Custom Skills

Local EMOVEL skills live inside the control center:

```text
C:\Users\flavi\Desktop\EMOVEL-OS\knowledge\skills
```

Production-relevant skills include:

```text
emovel.premium_ui_director.md
emovel.page_builder.md
emovel.visual_brief.md
emovel.copy_framework.md
emovel.offer_architect.md
emovel.funnel_builder.md
emovel.agent_blueprint.md
```
