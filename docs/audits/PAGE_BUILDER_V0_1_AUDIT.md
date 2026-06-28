---
title: EMOVEL Page Builder v0.1 Audit
source_project: C:\Users\Flavi\Desktop\EMOVEL_PAGE_BUILDER_V0_1
target_project: C:\Users\Flavi\Desktop\emovel-os
status: read-only audit
recommendation: Rebuild Page Builder Core inside EMOVEL OS
decision: Use as reference implementation, not direct migration
---

# EMOVEL Page Builder v0.1 — Audit complet (read-only)

## 1. Executive summary

Este un **page builder real și funcțional**, nu un demo: **Vite + React 18 + TypeScript**, peste **Puck Editor** (`@puckeditor/core@0.21.2`). Are 18 secțiuni reale, drag-and-drop nativ, inspector cu tab-uri, autosave, salvare JSON pe disc și export static ZIP.

Cel mai puternic activ este **stratul de contract**: Component Registry v1.1 generat din TypeScript + Page Schema validat printr-un Validation Gate + regula „AI produce Page Schema, niciodată JSX". Exact ce-i trebuie EMOVEL OS.

Cele mai slabe puncte: **„AI-ul" nu există** (composer-ul e un clasificator determinist pe regex/keyword, nu un model), iar builder-ul e o **aplicație Vite standalone**, în timp ce EMOVEL OS e un monorepo **Next.js** — deci shell-ul de editor și persistența nu se mută direct.

**Verdict: nu se abandonează, dar nici nu se migrează în bloc.** Valoarea reală e în logica schema/registry/validation/export, nu în shell.

## 2. What exists

Stack: Vite 5 + React 18.3 + TS 5.5 strict. Entry: `index.html → main.tsx → App.tsx` (montează `<Puck>`). Plugin Vite custom (`vite-plugin-page-server.ts`) salvează pagini pe disc în dev. 10 fișiere de test Vitest.

Foldere active: `src/builder/` (nucleu: `puck.config.tsx` 955 LOC, `section-contract.ts`, `themes.ts`, `tokens.ts`, `publish.ts`, `export-validator.ts`, + `sections/` cu 18 secțiuni), `src/composer/` (pipeline Page Schema), `src/registry/` (Registry v1.1), `src/shell/` (UI editor), `public/assets/` (assets reale), `docs/`, `scripts/`.

Inactiv/gol: `pages/` are doar `.gitkeep` + `.trash/` gol (**nicio pagină reală salvată**), `scripts/_out/`, `verify-ts-zero.png`, `test-final.mjs` (script vechi în afara suitei). `node_modules` neinstalat (corect).

Documentație de proces: `BUILDER_CONTRACT.md`, `INTEGRATION_REVIEW.md`, `LOCAL_TEST_REPORT.md`, `MIGRATION_PUCK_021.md`, plus 3 planuri și README/CLAUDE.

## 3. What is working

Builder vizual real (Puck, 18 secțiuni, drag-drop), inspector cu tab-uri (Content/Generate/Theme/Pages/Export), sistem de teme cu 13 chei de culoare ca CSS vars injectate corect și în iframe-ul Puck, Page Schema + Validation Gate funcțional, manifest generat din TypeScript, export static ZIP cu CSS + motion + IntersectionObserver + assets, policy „missing asset blochează exportul", persistență localStorage + disc + soft-delete, teste pe logica critică.

## 4. What is incomplete / fragile

- **„AI-ul" e determinist**: `composer-strategy.ts` clasifică prin regex și tabele hard-codate de CTA. Template engine, nu generare AI. Interfața (Page Schema) e pregătită, dar fără model.
- **Două scheme paralele active**: `PageSpec` legacy (`prompt-to-page.ts`) și `PageSchema` v1.1 (`composer.ts`) coexistă în `PromptPanel`. Datorie tehnică.
- **3 componente `notImplemented`**: DashboardPreview, WorkflowTimeline, ThreeDShowcase (necesită assets/3D reale). Registry promite 16, livrează ~13.
- **UX rupt** (din `LOCAL_TEST_REPORT.md`): editor de array pentru `Offer.benefits` afișează câmpuri goale (F-4); **ThemeSwitcher nu e montat** — temele merg dar nu pot fi schimbate din UI (F-5).
- **Naming indirect**: registryName ≠ filename ≠ propsType (FeatureGrid → CardSection, EditorialSection → FeatureSplitSection).
- **Salvarea depinde de Vite dev plugin** — nu merge în production build, nu se traduce în Next fără API route.

## 5. Technical audit

Dependențe runtime lean: `@puckeditor/core`, `react`, `react-dom`, `jszip`, `motion` + `animejs` (**redundanță motion**). Puck a fost migrat de la `@measured/puck` (vezi `MIGRATION_PUCK_021.md`); `@puckeditor/core` e publicat real pe npm. Riscuri package: `esbuild ≤0.24.2` (CVE moderat, dev-only), `uuid@9`/`deep-diff` deprecate tranzitiv — niciunul blocker. Build `tsc && vite build` raportat PASS. Cod de calitate ridicată: tipuri stricte, separare clară, teste pe logica critică.

*Verificare rulată: inspecție statică (find/cat/grep/wc/git log). Nu am rulat build/install/test per mandat — statusul build/test provine din rapoartele existente, neconfirmat live.*

## 6. Builder audit

Page Schema ✅ · Section registry ✅ · Manifest generat ✅ · Renderer ✅ (Puck) · Drag-and-drop ✅ · Preview ✅ · Export ✅ (doar HTML static ZIP) · Validation ✅ · Section library ✅ (18) · Componente reutilizabile ✅ (theme-aware, zero culori hard-codate) · Export React/Next ❌ · Validare AI input ⚠️ (schema validată, dar fără AI care s-o producă).

**Stabil:** registry, schema, validator, export, secțiuni, teme. **Fragil:** composer determinist, array editor, ThemeSwitcher nemontat, dublura PageSpec/PageSchema, persistența legată de Vite.

## 7. Integration audit cu EMOVEL OS

EMOVEL OS = monorepo cu apps **Next.js** (`emovel-site`, `emovel-prompt-studio`). Prompt Studio **are deja** `lib/brand-os`, `lib/brand-mechanism`, `lib/ai`, `project-schema.ts` și UI `app/builder-workspaces`, `app/output-preview`, `app/execution`. Conflictul-cheie: Vite SPA cu `<Puck>` la rădăcină + persistență prin Vite plugin nu se transferă în Next.

**Reutilizabil direct (pur TS):** `registry/*`, `composer/page-schema*` + validator, `section-contract.ts`, `tokens/themes/derive-theme`. **Probabil reutilizabil:** cele 18 `sections/*` (mici ajustări `"use client"`) + logica din `publish.ts`. **Rescris:** `shell/*`, montarea `<Puck>` (rută Next), composer determinist → `lib/ai` al OS. **Nu migra:** `vite-plugin-page-server.ts` → API route Next; `prompt-to-page.ts`/`PageSpec` legacy; `index.html`/`vite.config.ts`.

**Brand OS:** temele builder-ului dublează `lib/brand-os` → trebuie o singură sursă. **Agent Prompt Adapter:** punct de integrare curat — `lib/ai` produce `PageSchema`, Validation Gate-ul existent o validează înainte de render. **Risc integrare: mediu-mare** (nu logica, ci shell-ul în Next + reconcilierea Brand OS + Puck `"use client"`).

**`lib/page-builder` în OS =** registry + page-schema + validator + section-contract + tokens/themes/derive-theme + sections + export (nucleul fără shell, fără Vite). **Rămâne separat:** shell-ul (rută Next), persistența (API route), sursa AI (din OS).

## 8. Readiness scores

| Domeniu | Scor | Blochează nivelul următor |
|---|---|---|
| Technical readiness | **8/10** | nimic major; lipsește reconfirmare live build/test + E2E |
| Builder core readiness | **8/10** | unificarea celor două pipeline-uri de generare |
| UI readiness | **6/10** | F-4 (array UX) + F-5 (ThemeSwitcher nemontat) |
| Integration readiness (EMOVEL OS) | **4/10** | totul e Vite, nu Next; persistență Vite; Brand OS dublat |
| Product readiness | **5/10** | fără AI real + nicio pagină de producție livrată |

## 9. Risks

Arhitectură (Vite vs Next — risc de rewrite accidental dacă forțezi migrarea în bloc); dependențe (lock pe Puck recent migrat, `animejs`+`motion` redundante, CVE-uri dev); **schema instability** (două scheme active simultan); export fragil (tabele hard-codate de rescriere a căilor); editor complexity (overrides Puck + injecție CSS în iframe); integrare Brand OS (teme dublate); mentenanță (naming indirect + composer determinist deghizat în „AI").

## 10. Recommendation

**Varianta C — folosește-l ca referință și reconstruiește Page Builder Core în EMOVEL OS, extrăgând nucleul bun ca `lib/page-builder`.**

Logica schema/registry/validation/export e de calitate de producție și aproape pur TypeScript (portabilă direct), dar shell-ul și persistența sunt legate de Vite și nu aparțin într-un OS Next.js. Migrarea în bloc (A) ar căra datorie tehnică (Vite, PageSpec legacy, composer determinist). Doar schema (B) ar arunca secțiunile reale și exportul. Abandonul (D) ar pierde cel mai bun activ: contractul Registry v1.1 + Validation Gate.

## 11. Immediate next 5 actions

1. **Îngheață contractul ca pachet portabil** — confirmă că graful `registry → page-schema → validator → section-contract → tokens/themes` n-are dependențe de DOM/Vite (validatorul și schema deja n-au).
2. **Decide o singură schemă** — elimină `PageSpec`/`prompt-to-page.ts` în favoarea `PageSchema` v1.1, înainte de orice port.
3. **Reconciliază temele cu Brand OS** — mapează cele 13 chei de culoare peste `lib/brand-os` din Prompt Studio. O singură sursă de brand.
4. **Definește punctul de integrare AI** — contract `lib/ai` (OS) → `PageSchema` → `validatePageSchema()` → render; reutilizezi Validation Gate-ul ca atare.
5. **Prototip de port pe o singură secțiune** — `<Puck>` într-o rută Next `"use client"` în `app/builder-workspaces`, cu o secțiune reală + export ZIP, ca PoC înainte de a muta toate cele 18.

---

*Audit pur read-only. Niciun fișier din proiectul auditat nu a fost atins. Statusul build/test provine din rapoartele existente ale proiectului, neconfirmat prin rulare live (per mandat).*
