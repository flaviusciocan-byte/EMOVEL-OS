// EMOVEL Brand Mechanism Audit — strategic content layer.
// Typed, mechanism-keyed content used by the report generator and the agent
// layer. Content strings are the canonical EMOVEL copy and are kept verbatim.

import type { MechanismId } from "./mechanisms";

export type MechanismInterpretation = {
  summary: string;
  works: string[];
  doesNotWork: string[];
};

export type MechanismRecommendation = {
  tone: string;
  contentTypes: string[];
  landingPageStructure: string[];
  adAngle: string;
  emailAngle: string;
  strategicWarning: string;
};

export type MechanismAgentRule = {
  primaryTrigger: string;
  avoid: string;
  bestCtaStyle: string;
};

export const interpretations: Record<MechanismId, MechanismInterpretation> = {
  identificare: {
    summary:
      "Brandul tău convinge prin sentimentul de apartenență. Clientul cumpără pentru că se recunoaște în valorile, stilul și energia brandului. Comunicarea trebuie să creeze proximitate, familiaritate și comunitate selectivă.",
    works: [
      "storytelling personal",
      "valori clare",
      "limbaj de comunitate",
      "conținut despre stil de viață și identitate",
    ],
    doesNotWork: [
      "comunicare rece",
      "argumente exclusiv raționale",
      "promisiuni prea tehnice",
      "poziționare lipsită de personalitate",
    ],
  },
  aspiratie: {
    summary:
      "Brandul tău convinge prin evoluție. Clientul cumpără pentru că vrea să ajungă la un nivel mai bun, mai rafinat sau mai profesionist. Comunicarea trebuie să proiecteze statut, progres și transformare controlată.",
    works: [
      "ton premium",
      "vizualuri curate",
      "promisiuni de elevare",
      "comparații între nivelul actual și nivelul următor",
    ],
    doesNotWork: [
      "limbaj banal",
      "discount agresiv",
      "comunicare prea modestă",
      "lipsă de estetică și direcție",
    ],
  },
  siguranta: {
    summary:
      "Brandul tău convinge prin încredere. Clientul cumpără pentru că simte claritate, stabilitate și risc redus. Comunicarea trebuie să fie calmă, exactă și susținută de dovezi.",
    works: [
      "explicații clare",
      "dovezi sociale",
      "studii de caz",
      "garanții",
      "pași simpli",
    ],
    doesNotWork: [
      "ambiguitate",
      "promisiuni vagi",
      "presiune excesivă",
      "lipsă de structură",
    ],
  },
  obicei: {
    summary:
      "Brandul tău convinge prin familiaritate și recurență. Clientul revine pentru că procesul este simplu, rapid și deja integrat în comportamentul lui. Comunicarea trebuie să întărească rutina și accesibilitatea.",
    works: [
      "oferte recurente",
      "membership",
      "reminder-e",
      "experiență de cumpărare foarte simplă",
      "consistență vizuală și verbală",
    ],
    doesNotWork: [
      "schimbări frecvente de poziționare",
      "friction în checkout",
      "comunicare imprevizibilă",
      "mesaje prea complicate",
    ],
  },
  diferentiere: {
    summary:
      "Brandul tău convinge prin contrast. Clientul cumpără pentru că înțelege rapid de ce brandul tău este diferit și de ce alternativa standard nu este suficientă. Comunicarea trebuie să fie precisă, tăioasă și memorabilă.",
    works: [
      "poziționare clară",
      "comparații elegante",
      "avantaj unic",
      "mesaje scurte și memorabile",
      "demonstrații de diferență",
    ],
    doesNotWork: [
      "mesaje generice",
      "promisiuni comune",
      "lipsă de categorie clară",
      "copierea competitorilor",
    ],
  },
};

export const recommendations: Record<MechanismId, MechanismRecommendation> = {
  identificare: {
    tone: "uman, selectiv, apropiat, editorial",
    contentTypes: [
      "manifesto posts",
      "founder stories",
      "community-driven carousels",
      "behind-the-brand content",
    ],
    landingPageStructure: [
      "Hero cu mesaj de apartenență",
      "Secțiune despre valori",
      "Problema comună a publicului",
      "Produsul ca expresie a identității",
      "Testimoniale de tip: m-am regăsit",
      "CTA comunitar",
    ],
    adAngle: "Pentru oamenii care se regăsesc în această viziune.",
    emailAngle:
      "Nu este doar un produs. Este un mod de a lucra, a gândi sau a construi.",
    strategicWarning:
      "Riscul este să confunzi apartenența cu exclusivitatea goală. Comunitatea trebuie să stea pe valori reale și pe un produs care le susține, altfel identificarea se erodează rapid.",
  },
  aspiratie: {
    tone: "premium, elevat, cinematic, controlat",
    contentTypes: [
      "before-after strategic",
      "premium positioning posts",
      "vision-led carousels",
      "transformation reels",
    ],
    landingPageStructure: [
      "Hero cu promisiune de nivel superior",
      "Starea actuală vs starea dorită",
      "De ce alternativele sunt insuficiente",
      "Produsul ca sistem de upgrade",
      "Dovezi de progres",
      "CTA premium",
    ],
    adAngle: "Treci de la improvizație la sistem.",
    emailAngle:
      "Următorul nivel nu cere mai mult zgomot. Cere structură mai bună.",
    strategicWarning:
      "Aspirația fără dovezi devine promisiune goală. Susține fiecare proiecție de status cu rezultate concrete, altfel tonul premium se citește ca exagerare.",
  },
  siguranta: {
    tone: "clar, calm, precis, profesionist",
    contentTypes: [
      "educational posts",
      "case studies",
      "step-by-step carousels",
      "FAQ content",
      "proof-driven content",
    ],
    landingPageStructure: [
      "Hero clar și direct",
      "Problema explicată simplu",
      "Cum funcționează produsul",
      "Ce primește clientul",
      "Dovezi și testimoniale",
      "FAQ",
      "CTA fără presiune",
    ],
    adAngle: "O soluție clară pentru o problemă care nu trebuie complicată.",
    emailAngle: "Tot ce trebuie să știi înainte să iei decizia.",
    strategicWarning:
      "Prea multă siguranță poate aluneca în plictiseală. Păstrează claritatea, dar adaugă un motiv clar de acțiune, altfel încrederea nu se convertește.",
  },
  obicei: {
    tone: "familiar, eficient, simplu, constant",
    contentTypes: [
      "routine posts",
      "weekly prompts",
      "repeatable frameworks",
      "membership content",
      "quick-use templates",
    ],
    landingPageStructure: [
      "Hero orientat pe ușurință",
      "Beneficiu imediat",
      "Cum intră produsul în rutina clientului",
      "Exemple de utilizare",
      "Plan recurent sau bundle",
      "CTA rapid",
    ],
    adAngle:
      "Instrumentul la care revii de fiecare dată când ai nevoie de claritate.",
    emailAngle: "Păstrează-l aproape. Îl vei folosi mai des decât crezi.",
    strategicWarning:
      "Obiceiul se pierde la prima fricțiune. Orice schimbare bruscă de poziționare, preț sau flux de cumpărare poate rupe rutina pe care se sprijină recurența.",
  },
  diferentiere: {
    tone: "precis, contrastant, autoritar, memorabil",
    contentTypes: [
      "comparison posts",
      "myth-breaking carousels",
      "positioning reels",
      "category design content",
      "bold thesis posts",
    ],
    landingPageStructure: [
      "Hero cu diferență clară",
      "Ce fac ceilalți greșit",
      "Noua abordare",
      "Mecanismul unic",
      "Demonstrație",
      "Ofertă",
      "CTA direct",
    ],
    adAngle: "Nu este încă un template. Este un sistem de decizie.",
    emailAngle: "Diferența nu este în design. Este în arhitectura din spate.",
    strategicWarning:
      "Diferențierea fără substanță devine doar contrast de suprafață. Avantajul declarat trebuie să fie demonstrabil, altfel poziționarea tăioasă se întoarce împotriva brandului.",
  },
};

export const agentRules: Record<MechanismId, MechanismAgentRule> = {
  identificare: {
    primaryTrigger: "apartenență",
    avoid: "comunicare rece sau prea tehnică",
    bestCtaStyle: "intră în ecosistem / descoperă dacă e pentru tine",
  },
  aspiratie: {
    primaryTrigger: "evoluție",
    avoid: "discount agresiv sau limbaj banal",
    bestCtaStyle: "treci la nivelul următor / construiește mai profesionist",
  },
  siguranta: {
    primaryTrigger: "încredere",
    avoid: "ambiguitate sau promisiuni vagi",
    bestCtaStyle: "vezi cum funcționează / începe cu claritate",
  },
  obicei: {
    primaryTrigger: "familiaritate",
    avoid: "schimbări bruște și procese complicate",
    bestCtaStyle: "folosește-l azi / adaugă-l în workflow",
  },
  diferentiere: {
    primaryTrigger: "contrast",
    avoid: "mesaje generice sau poziționare copiată",
    bestCtaStyle: "vezi diferența / alege sistemul corect",
  },
};

// 7-day action plan — a fixed template, mechanism-agnostic.
export const sevenDayPlan: string[] = [
  "Ziua 1 — Clarifică mecanismul dominant. Definește într-o frază de ce cumpără oamenii de la brandul tău.",
  "Ziua 2 — Rescrie headline-ul principal. Adaptează promisiunea principală la mecanismul dominant.",
  "Ziua 3 — Ajustează bio / profil / poziționare. Elimină cuvintele generice și adaugă semnalul psihologic corect.",
  "Ziua 4 — Creează o postare de autoritate. Publică un conținut care explică mecanismul brandului fără să îl numească tehnic.",
  "Ziua 5 — Rescrie oferta. Schimbă structura ofertei astfel încât să susțină motivul real de cumpărare.",
  "Ziua 6 — Ajustează CTA-ul. CTA-ul trebuie să activeze mecanismul dominant, nu doar să ceară acțiune.",
  "Ziua 7 — Verifică congruența. Compară homepage, Instagram, email și produs. Toate trebuie să transmită aceeași logică.",
];

// Canonical system prompt for the Brand Mechanism agent layer.
export const agentSystemPrompt = `You are an EMOVEL Brand Mechanism Agent.

Your role is to generate brand assets based on the user's dominant and secondary brand mechanisms.

Always use the dominant mechanism as the primary persuasion logic.
Use the secondary mechanism as support, never as the main message.

Do not generate generic copy.
Do not mix all mechanisms equally.
Do not use hype, exaggerated claims, or guru-style language.

When creating content, pages, ads, emails, or product descriptions, adapt:
- tone
- promise
- CTA
- proof type
- content structure
- emotional trigger
- objection handling

Input variables:
dominant_mechanism:
secondary_mechanism:
mechanism_scores:
brand_congruence_level:
product_type:
target_audience:
offer:
channel:
desired_output:

Output must be clear, premium, structured, and commercially usable.`;
