---
title: Page Builder Core — Implementation Plan
target_project: C:\Users\Flavi\Desktop\EMOVEL-OS
source_reference: C:\Users\Flavi\Desktop\EMOVEL_PAGE_BUILDER_V0_1
based_on_audit: docs/audits/PAGE_BUILDER_V0_1_AUDIT.md
status: plan (no code yet)
decision: Use lab as reference implementation; rebuild Page Builder Core inside EMOVEL OS
do_not: migrate the Vite app directly
---

# Page Builder Core — Implementation Plan (EMOVEL OS)

Acest document este un **plan**, nu o implementare. Niciun cod nu este scris și niciun fișier de aplicație nu este modificat. Planul pornește de la decizia din audit (`docs/audits/PAGE_BUILDER_V0_1_AUDIT.md`): folosim `EMOVEL_PAGE_BUILDER_V0_1` ca **referință conceptuală** și reconstruim un **Page Builder Core** curat în EMOVEL OS, fără a migra aplicația Vite.

---

## 1. Decision summary

**Ce decizie am luat.** Reconstruim Page Builder Core nativ în EMOVEL OS, ca bibliotecă pur TypeScript (`lib/page-builder`), reutilizând **conceptele** dovedite din lab: Page Schema, Component Registry, contractul de secțiune, validatorul și logica de export. Sursa de adevăr pentru generare devine Brand OS-ul existent (`lib/brand-os` + `lib/ai`), nu un composer determinist.

**Ce NU facem.** Nu copiem aplicația Vite, nu portăm shell-ul de editor, nu introducem Puck în v1, nu instalăm dependențe noi (inclusiv Zod), nu atingem Brand OS și nu construim UI în prima fază.

**De ce nu migrăm brut.** Auditul a arătat că logica valoroasă (schema/registry/validator/export) este aproape pur TypeScript și portabilă, dar este împachetată într-o aplicație **Vite SPA** cu persistență prin plugin de dev și două scheme paralele (PageSpec legacy + PageSchema v1.1). EMOVEL OS este un monorepo **Next.js**. Migrarea în bloc ar căra datorie tehnică (Vite, PageSpec legacy, composer determinist, overrides Puck) într-un sistem care are deja propriile primitive (Brand OS, builder-workspaces, output-preview). Reconstrucția curată păstrează doar contractul bun și elimină shell-ul.

---

## 2. Source assets to reuse conceptually

Din `EMOVEL_PAGE_BUILDER_V0_1` reutilizăm **ideile**, nu fișierele:

- **Registry** — `src/registry/componentRegistry.ts` + `shared.ts`: ideea de Shared Layer (universe/surface/motion/spacing/anchorId/aiLock) și mapare registryName → implementare, cu status `implemented`/`notImplemented`.
- **Page Schema** — `src/composer/page-schema.ts`: forma `{ registryVersion, title, components[] }` cu `{ registryName, props }`. Contractul „AI produce schema, nu JSX".
- **Section contract** — `src/builder/section-contract.ts`: props tipați per secțiune, `SharedSectionSurface`, normalizarea benefits `{text}[] → string[]`.
- **Validator** — `src/composer/page-schema-validator.ts`: validare fără excepții, `{valid, errors[]}`, verificare registryName + status + câmpuri de asset.
- **Export validator** — `src/builder/export-validator.ts`: `collectLocalAssetRefs()`, reguli de prefix `assets/`, scanare nested arrays.
- **Theme / tokens logic** — `tokens.ts`, `themes.ts`, `derive-theme.ts`: 13 chei de culoare, CSS vars, `deriveTheme()`. Reutilizat **doar conceptual**, ancorat la Brand OS (vezi §8).
- **Selected sections** — cele ~13 secțiuni implementate (theme-aware, zero culori hard-codate) ca referință pentru contractele v1.
- **Export ZIP ideas** — `publish.ts`: inline CSS din tokens + keyframes, IntersectionObserver vanilla, copiere assets, rescriere căi.
- **UX patterns** — inspector cu tab-uri (Content/Generate/Theme/Pages/Export), section library dock, status bar — referință pentru faza UI târzie.
- **Puck learnings** — injecția CSS în iframe, overrides, `setData` dispatch — utile doar dacă/ când adăugăm editor vizual (faza 6).

---

## 3. Assets NOT to migrate

- **Vite shell** — `index.html`, `vite.config.ts`, `vitest.config.ts`, `main.tsx`, `App.tsx`.
- **dist / build output** — orice artefact de build.
- **node_modules** — zero.
- **scripts/_out** — output generat.
- **vite-plugin-page-server.ts** — persistență de dev legată de Vite; în OS va fi API route Next (faza 4).
- **PageSpec legacy** — `src/builder/prompt-to-page.ts`, `page-spec.ts`, `page-spec-to-puck.ts`. O singură schemă în OS: PageSchema.
- **Demo-only code** — sample prompts, preset-uri demo, `test-final.mjs`, `verify-ts-zero.png`.
- **Puck editor (în v1)** — `@puckeditor/core`, `puck.config.tsx`, `src/shell/*`, `puck-overrides.tsx`. Eventual în faza 6, opțional.

---

## 4. Target architecture in EMOVEL OS

Locație propusă: `apps/emovel-prompt-studio/lib/page-builder/` (lângă `lib/brand-os`, `lib/ai`). Bibliotecă pur TS, fără dependențe externe, fără DOM, fără UI.

```
lib/page-builder/
├── schema.ts       # Tipurile PageBuilderDocument + PageSchema + SectionInstance + SharedProps. Sursa de adevăr a formei.
├── registry.ts     # Registrul de secțiuni: registryName → { status, category, requiredProps, requiresAssets }. Înlocuiește manifestul generat din lab; declarat direct în TS.
├── sections.ts     # Contractele de props per secțiune (hero, product_showcase, …) + defaults neutre. Echivalentul section-contract.ts.
├── validator.ts    # validatePageBuilderDocument(doc) → { valid, errors[], warnings[] }. Hand-rolled, fără Zod. Verifică registryName, status, ordine, required props, assets.
├── normalize.ts    # Normalizări de input (ex. {text}[]→string[], anchorId auto-generat, trim/slug, defaults). Curăță schema înainte de validare/export.
├── export.ts       # Reprezentări de output: markdown export + (mai târziu) builder pack / ZIP / HTML. Pur funcțional, întoarce string/obiecte.
├── generator.ts    # Construiește un PageBuilderDocument dintr-un input + Brand OS context. Apelează lib/ai prin contractul Brand-aware; NU conține model propriu.
├── verify.ts       # Harness de verificare rulabil (node) — teste de schema/validator/export fără framework. Echivalentul verify-*.mts din lab/OS.
└── index.ts        # Barrel export public al modulului.
```

**Rolul fiecărui fișier:**

- **schema.ts** — definește `PageBuilderDocument` (containerul de top: meta + brand context ref + secțiuni), `PageSchema`/`SectionInstance` și `SharedProps`. Nimic altceva nu redeclară aceste tipuri.
- **registry.ts** — sursa unică pentru ce secțiuni există, statusul lor și ce props cer. Determinist, în TS (nu JSON generat ca în lab).
- **sections.ts** — contractul de props per tip de secțiune + valori default neutre (fără copy EMOVEL hard-codat).
- **validator.ts** — poarta de validare: nume valide, status `implemented`, props obligatorii prezente, ordine de secțiuni, referințe de asset corecte. Întoarce erori + avertismente, nu aruncă.
- **normalize.ts** — aduce orice input (inclusiv JSON de la AI) la forma canonică înainte de validare și export.
- **export.ts** — transformă un document validat în output (v1: markdown; ulterior: builder pack/ZIP/HTML/React).
- **generator.ts** — orchestrează generarea: ia input + slug brand → cere structura prin Brand OS/`lib/ai` → normalize → validate → document. Nu deține logică de model.
- **verify.ts** — rulabil cu `node`/`tsx` pentru a verifica nucleul fără UI și fără build de aplicație.
- **index.ts** — expune API-ul public stabil al lui `lib/page-builder`.

---

## 5. Page Builder v1 scope

**V1 NU include editor vizual.** Fără Puck, fără drag-and-drop, fără canvas, fără shell.

**V1 include:**

- `PageBuilderDocument` — tipul-container și ciclul lui de viață (create → normalize → validate).
- Schema `landing_page` — primul (și singurul) tip de pagină în v1.
- Section registry — registrul de secțiuni v1.
- Validation — validator hand-rolled cu mod draft/production.
- Markdown/export representation — exportul minim, ca document markdown structurat.
- Brand OS-aware prompt builder — generarea folosește `buildBrandAwarePromptForSlug` cu `taskType: "landing_page"`.
- ProductShowcase section contract — prima secțiune premium, contract complet (vezi §7).
- 5–8 secțiuni critice — contracte definite (vezi §6).

---

## 6. Sections for v1

Pentru fiecare secțiune: rol comercial · status · required/optional · sursă conceptuală din lab.

| Secțiune | Rol comercial | Status v1 | Required/Optional | Sursă conceptuală din lab |
|---|---|---|---|---|
| **hero** | Promisiune principală + CTA primar; prima impresie | implemented | **required** | `components/sections/HeroSection.tsx` + `HeroProps` |
| **product_showcase** | Prezintă produsul ca obiect de dorit (prima secțiune premium) | implemented | **required** | `ProductGridSection` + `ScreenshotGallerySection` (idei de layout) |
| **problem** | Articulează durerea/contextul audienței | implemented | optional (recomandat) | `OfferSection.problem` (concept) |
| **mechanism** | Explică „de ce funcționează" — leagă de dominant mechanism Brand OS | implemented | optional (recomandat) | `FeatureSplitSection` / `OfferSection.solution` (concept) |
| **offer** | Oferta concretă + beneficii | implemented | **required** | `OfferSection` + `benefits: string[]` |
| **proof** | Dovadă socială / testimoniale / loguri | implemented | optional | `TestimonialsSection`, `LogoStripSection`, `StatsBarSection` |
| **pricing** | Planuri și preț | implemented | optional | `PricingTableSection` + `PricingPlan` |
| **faq** | Reduce frecarea / obiecții | implemented | optional | `FAQSection` + `FAQItem` |
| **final_cta** | Închiderea / conversia finală | implemented | **required** | `CTASection` |
| **implementation_notes** | Note interne (non-render) pentru autor/AI; nu apare în export public | meta | optional | nou — fără echivalent în lab |

Notă: `implementation_notes` este o secțiune de tip „meta" — nu se randează în output-ul public, doar în reprezentarea internă a documentului.

---

## 7. ProductShowcase as first premium section

**De ce prima secțiune avansată.** Este nucleul comercial al unei pagini de produs EMOVEL și exercită toate capabilitățile dificile (layout variabil, theme-driven rendering, assets reale, reguli de validare). Dacă ProductShowcase e corect, restul secțiunilor sunt mai simple.

- **Layout split / full-bleed** — suportă două moduri: `split` (imagine + copy, alternabil stânga/dreapta) și `full-bleed` (vizual dominant). Mapat pe `SharedProps.width` (`contained` / `full-bleed`) din contractul de lab.
- **Theme-driven rendering** — zero culori hard-codate; totul prin tokens derivați. Culorile vin din universe-ul paginii (vezi §8), nu sunt setate la nivel de secțiune.
- **Brand OS mapping** — copy-ul implicit și unghiul de prezentare derivă din `dominant_mechanism` și `recommended_tone` ale brandului (prin generator + Brand OS context).
- **Export behavior** — în v1, export markdown (titlu, descriere, listă de produse/feature-uri, referințe de asset). Ulterior, HTML/ZIP.
- **Asset requirements** — `requiresAssets: true`. Fiecare item poate avea `imageUrl` cu prefix `assets/` (sau extern http(s)/data). Lipsa unui asset cerut → warning în draft, error în production (vezi §11).
- **Validation rules** — minim 1 produs/item; fiecare item cu `title` obligatoriu; `imageUrl` (dacă prezent) trebuie să respecte regula de prefix; `layout ∈ {split, full-bleed}`; `width` valid.

---

## 8. Brand OS integration

Page Builder **nu** își inventează brandul; îl primește din Brand OS-ul existent (`apps/emovel-prompt-studio/lib/brand-os`).

- **Cum primește context.** `generator.ts` apelează `buildBrandAwarePromptForSlug({ slug, basePrompt, taskType: "landing_page", input })` (din `lib/brand-os/agent-prompt.ts`). Acesta încarcă `AgentBrandContext` prin `getAgentBrandContext(slug)` și injectează profilul strategic în prompt.
- **Cum folosește `buildBrandAwarePromptForSlug`.** Page Builder furnizează `basePrompt`-ul specific de landing page (instrucțiunea de a produce structura de secțiuni ca JSON conform schemei) și `input`-ul utilizatorului; Brand OS adaugă directivele de brand.
- **taskType: "landing_page".** Folosim maparea existentă (`toBrandAwareTaskType` recunoaște `landing-page` / `landing_page` / `page` → `landing_page`). Astfel structura de task respectă directiva de landing din Brand OS.
- **Dominant mechanism.** `appliedMechanism` din output reflectă `dominant_mechanism`-ul brandului; generatorul îl folosește ca logică primară de persuasiune pentru copy-ul de secțiuni (hero, mechanism, offer, final_cta).
- **Fallback behavior.** Dacă nu există profil de brand pentru slug, `buildBrandAwarePrompt` rulează în mod neutru (fără mecanism inventat). Page Builder marchează documentul cu `brandContext: null` și produce o structură generică, validă — fără a fabrica un mecanism. Acesta este un avertisment de draft, nu o eroare.

Regula de aur (din audit, risc §13): **o singură sursă de brand.** Page Builder nu duplică temele din lab; tokens/universe derivă din Brand OS.

---

## 9. Workspace integration (later)

Acestea vin **după** core și **NU** fac parte din prima etapă:

- **Generate Landing Page** — buton/flux în `app/builder-workspaces` care apelează `generator.ts`.
- **Preview Page Structure** — vizualizare a secțiunilor (read-only) din `PageBuilderDocument`.
- **Save PageBuilderDocument** — persistă documentul (API route Next, nu Vite plugin).
- **Export Landing Page Pack** — declanșează `export.ts` pentru markdown/pack.
- **BrandContextBadge** — afișează ce brand/mecanism a fost aplicat (sau „neutral fallback").

> Notă: toate cele de mai sus sunt **post-core**. Faza 1 nu livrează niciun UI.

---

## 10. Export integration

- **Markdown export (v1)** — `export.ts` produce un document markdown structurat: titlu, meta brand, secțiuni în ordine, props relevante, referințe de asset. Singurul output în v1.
- **Builder pack extension** — ulterior, un „landing page pack" (markdown + listă de assets + meta JSON) aliniat cu pipeline-urile de output existente din OS (`app/output-preview`).
- **Asset requirements** — exportul listează toate referințele de asset (`collectLocalAssetRefs`-style) și marchează lipsurile.
- **Future ZIP inclusion** — portăm ideea din `publish.ts` (CSS inline din tokens + keyframes + IntersectionObserver + copiere assets) când adăugăm output HTML.
- **HTML/React export (later)** — fază târzie; necesită un renderer de secțiuni (potențial partajat cu un eventual editor Puck în faza 6).

---

## 11. Validation strategy

- **Hand-rolled, fără Zod.** Validator pur TS, fără dependențe (regula din audit: zero deps în v1). Întoarce `{ valid, errors[], warnings[] }`, nu aruncă.
- **Required sections.** `landing_page` cere cel puțin: `hero`, (`offer` sau `product_showcase`), `final_cta`. Lipsa → error.
- **Prop-level validation.** Per secțiune, props obligatorii prezente și de tip corect; enum-uri valide (`width`, `layout`, `surface`, `motion`, `spacing`).
- **Section order validation.** `hero` prima; `final_cta` ultima dintre secțiunile de conținut; `implementation_notes` ignorată la ordine (meta). Ordine ilogică → warning (draft) / error (production).
- **Draft vs production mode.** `draft`: lipsuri de asset și secțiuni recomandate lipsă = **warnings**. `production`: aceleași devin **errors** (mirror al regulii „missing asset blochează exportul" din lab).
- **Missing asset warnings/errors.** Referințe de asset trebuie să înceapă cu `assets/` / `/assets/` sau să fie URL extern/data; altfel error. Asset cerut absent: warning în draft, error în production.

---

## 12. Implementation phases

- **Faza 1 — `lib/page-builder` core.** `schema.ts` + `registry.ts` + `sections.ts` + `validator.ts` + `normalize.ts` + `export.ts` (markdown) + `verify.ts` + `index.ts`. Pur TS, zero deps, zero UI, zero Puck.
- **Faza 2 — ProductShowcase + teme + export markdown.** Contract complet ProductShowcase, theme presets ancorate la Brand OS, export markdown finalizat.
- **Faza 3 — Prompt builder cu Brand OS.** `generator.ts` folosește `buildBrandAwarePromptForSlug` (`taskType: "landing_page"`), produce JSON structurat → normalize → validate.
- **Faza 4 — Workspace integration.** Save/read `PageBuilderDocument` prin API route Next; integrare în `app/builder-workspaces`.
- **Faza 5 — Preview UI.** Vizualizare read-only a structurii de pagină + `BrandContextBadge`.
- **Faza 6 — Optional Puck/editor integration.** Editor vizual peste contractul existent, dacă/când e necesar.

---

## 13. Risks and mitigations

| Risc | Mitigare |
|---|---|
| **Schema drift** (lab PageSpec vs PageSchema, sau OS vs lab) | O singură schemă (`schema.ts`) ca sursă de adevăr; `verify.ts` prinde regresiile; PageSpec legacy nu se portează. |
| **Brand OS duplication** | Page Builder nu deține teme/brand propriu; consumă `lib/brand-os`. Tokens derivă din universe-ul brandului. |
| **Puck complexity** | Puck exclus din fazele 1–5; introdus opțional doar în faza 6, peste un contract deja stabil. |
| **Export fragility** | Export pur funcțional, testat în `verify.ts`; căile de asset normalizate într-un singur loc (`normalize.ts`), fără tabele hard-codate împrăștiate. |
| **AI malformed JSON** | `normalize.ts` + `validator.ts` între AI și document; output invalid → erori clare, niciodată render direct. |
| **Overbuilding UI too early** | Regulă explicită: zero UI în faza 1; UI abia din faza 5. Core-ul trebuie complet și verificat înainte. |

---

## 14. Acceptance criteria

Planul este considerat **complet și acționabil** dacă:

1. Documentul acoperă toate cele 15 secțiuni cerute, cu decizii concrete (nu generalități).
2. `lib/page-builder` poate fi implementat **fără a atinge Brand OS** — interacțiunea e doar prin API-ul public existent (`buildBrandAwarePromptForSlug`, `getAgentBrandContext`).
3. **Verify harness** este definit (`verify.ts`, rulabil cu node/tsx, fără framework de test).
4. **No dependencies** — nucleul nu adaugă pachete noi (inclusiv fără Zod).
5. **No UI in phase 1** — faza 1 livrează doar TS de bibliotecă.
6. **No Puck in phase 1** — niciun import Puck până în faza 6 (opțional).

---

## 15. Immediate next action

Următorul pas după acest plan: **implementarea Fazei 1 — `lib/page-builder` core** (schema + registry + sections + validator + normalize + export markdown + verify + index), pur TypeScript, zero dependențe, zero UI, zero Puck — urmată de rularea `verify.ts` ca poartă de acceptare.

---

*Acest document este doar un plan. Nu s-a scris cod, nu s-a modificat aplicația, Brand OS-ul sau auditul, și nu s-a migrat nimic.*
