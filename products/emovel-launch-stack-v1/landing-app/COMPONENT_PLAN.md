# 21st.dev Component Plan

## Tool Reality

21st.dev MCP is not available in this environment. The local 21st SDK is installed at:

`C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main`

The detected `packages/ui` exports simple primitives:

- `button`
- `card`
- `code`

## Fallback Used

The app implements local components that map to the 21st-style vocabulary from `emovel.premium_ui_director`:

| Page Need | Local Component / Section | 21st-style Equivalent |
|---|---|---|
| Hero | `ArtifactPreview`, `CtaButton` | Hero section, button |
| Process | `.processStep` sequence | Steps / process strip |
| Deliverables | `.deliverableTable` | Data table |
| Benefits | `.benefitCard` | Feature card |
| Proof | `blockquote` proof block | Quote block |
| Pricing | `.tier` cards | Pricing table |
| FAQ | Native `details` | Accordion |
| Closing | CTA band | CTA section |

## Next Integration Upgrade

When a live 21st.dev MCP or component marketplace command is available, replace the local section primitives with fetched 21st components and keep the same content/data model.

