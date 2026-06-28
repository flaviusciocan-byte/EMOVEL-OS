import type { PromptEngineInput, PromptEngineResult } from "./schema";

const recommendedSections = [
  "hero",
  "problem",
  "mechanism",
  "offer",
  "proof",
  "pricing",
  "faq",
  "final_cta",
];

function cleanText(value: string | undefined): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function titleCase(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function includesAny(value: string, words: string[]): boolean {
  return words.some((word) => value.includes(word));
}

function detectionText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bpt\b/g, "pentru");
}

function detectProduct(raw: string, explicit?: string): string {
  const productType = cleanText(explicit);
  if (productType) return productType;

  const lower = detectionText(raw);
  if (includesAny(lower, ["templateuri", "templates", "template"]) && lower.includes("instagram")) {
    return "AI Instagram template library";
  }
  if (includesAny(lower, ["curs", "course"])) return "online course";
  if (includesAny(lower, ["servicii", "service", "services"]) && lower.includes("design")) {
    return "premium design service";
  }
  if (includesAny(lower, ["tool", "instrument", "software"]) && includesAny(lower, ["oferta", "oferte", "offer"])) {
    return "offer clarity tool";
  }
  if (includesAny(lower, ["produse digitale", "digital products", "digital product"])) {
    return "digital product launch offer";
  }
  if (includesAny(lower, ["saas", "dashboard", "app"])) return "SaaS or web application";
  if (includesAny(lower, ["agency", "service", "servicii", "consulting"])) return "productized service";
  if (includesAny(lower, ["course", "template", "gumroad", "prompt pack", "digital product"])) return "digital product";
  if (includesAny(lower, ["landing", "website", "site", "page"])) return "conversion landing page";
  return "premium offer";
}

function detectAudience(raw: string, explicit?: string): string {
  const audience = cleanText(explicit);
  if (audience) return audience;

  const lower = detectionText(raw);
  if (lower.includes("instagram") && includesAny(lower, ["template", "templateuri"])) {
    return "creators and small businesses publishing on Instagram";
  }
  if (includesAny(lower, ["lanseze produse digitale", "digital product launch", "produse digitale"])) {
    return "creators and founders launching digital products";
  }
  if (includesAny(lower, ["curs", "course"])) return "course creators and experts selling their knowledge";
  if (includesAny(lower, ["servicii", "services"]) && lower.includes("design")) {
    return "premium service buyers who need high-trust design support";
  }
  if (includesAny(lower, ["fondatori", "founder", "founders"])) return "founders";
  if (includesAny(lower, ["creator", "creators"])) return "creators";
  if (includesAny(lower, ["agency", "agencies"])) return "agency buyers";
  if (includesAny(lower, ["saas", "team", "teams"])) return "SaaS teams";
  if (includesAny(lower, ["coach", "consultant", "consultants"])) return "consultants";
  return "";
}

function detectPageGoal(raw: string): string {
  const lower = detectionText(raw);
  if (lower.includes("instagram") && includesAny(lower, ["template", "templateuri"])) {
    return "sell the template library and explain the Instagram content use cases";
  }
  if (includesAny(lower, ["lanseze produse digitale", "digital product launch", "produse digitale"])) {
    return "position the digital product launch offer and capture qualified buyers";
  }
  if (includesAny(lower, ["curs", "course"]) && includesAny(lower, ["vand", "sell", "sales"])) {
    return "sell the course with a clear outcome and objection handling";
  }
  if (includesAny(lower, ["servicii", "services"]) && lower.includes("design")) {
    return "book qualified design service calls";
  }
  if (includesAny(lower, ["oferta", "oferte", "offer"]) && includesAny(lower, ["clara", "clare", "clear"])) {
    return "show founders how to clarify and package stronger offers";
  }
  if (includesAny(lower, ["waitlist", "lead", "leads"])) return "capture qualified leads";
  if (includesAny(lower, ["sell", "sales", "checkout", "gumroad", "paid"])) return "sell the offer";
  if (includesAny(lower, ["book", "call", "demo"])) return "book qualified calls";
  if (includesAny(lower, ["launch", "preorder", "pre-order"])) return "support a paid launch";
  return "explain the offer and drive a clear next action";
}

function detectTone(raw: string, explicit?: string): string {
  const tone = cleanText(explicit);
  if (tone) return tone;

  const lower = detectionText(raw);
  if (includesAny(lower, ["luxury", "premium", "high-end"])) return "premium and polished";
  if (includesAny(lower, ["friendly", "simple", "clear"])) return "clear and approachable";
  if (includesAny(lower, ["bold", "direct", "strong"])) return "direct and confident";
  return "premium, clear, and decisive";
}

function detectOfferAngle(product: string, audience: string, pageGoal: string): string {
  if (product === "AI Instagram template library") {
    return "AI Instagram templates that help creators publish faster without starting from a blank page.";
  }
  if (product === "digital product launch offer") {
    return "A digital product launch system for creators who need structure from idea to paid offer.";
  }
  if (product === "online course") {
    return "An online course positioned around a concrete outcome, clear buyer pain, and a direct purchase path.";
  }
  if (product === "premium design service") {
    return "Premium design services positioned around trust, taste, and a high-value transformation.";
  }
  if (product === "offer clarity tool") {
    return "An offer clarity tool for founders who need to turn vague value into a sharper paid offer.";
  }

  const audiencePart = audience || "the target audience";
  return `${titleCase(product)} for ${audiencePart}, positioned to ${pageGoal}.`;
}

function detectTransformation(product: string, pageGoal: string): string {
  if (product === "AI Instagram template library") {
    return "Move from inconsistent Instagram posting to a reusable content template system that makes publishing faster and easier to repeat.";
  }
  if (product === "digital product launch offer") {
    return "Move from a vague digital product idea to a structured launch offer with a clear promise, audience, and next step.";
  }
  if (product === "online course") {
    return "Move from having course knowledge to presenting a clear promise, curriculum angle, and sales page path.";
  }
  if (product === "premium design service") {
    return "Move from generic service positioning to a premium design page that earns trust and books qualified calls.";
  }
  if (product === "offer clarity tool") {
    return "Move from unclear offer messaging to a sharper value proposition, package, and call to action.";
  }

  return `Move from a rough idea to a structured ${product.toLowerCase()} page that can ${pageGoal}.`;
}

function projectTitle(product: string): string {
  return `${titleCase(product)} Landing Page`;
}

export function refineRawIdea(input: PromptEngineInput): PromptEngineResult {
  const rawIdea = cleanText(input.rawIdea);
  if (rawIdea.length < 12) {
    return { ok: false, errors: ["rawIdea is too short. Add a clear product, audience, or outcome."] };
  }

  const product = detectProduct(rawIdea, input.productType);
  const audience = detectAudience(rawIdea, input.audience);
  const pageGoal = detectPageGoal(rawIdea);
  const tone = detectTone(rawIdea, input.tone);
  const offerAngle = detectOfferAngle(product, audience, pageGoal);
  const transformation = detectTransformation(product, pageGoal);
  const productBrief = `${titleCase(product)} for ${audience || "a defined audience"}, designed to ${pageGoal} with a premium, structured landing page.`;
  const refinedPrompt = `Based on the raw idea, create a premium landing page for ${product} ${audience ? `serving ${audience}` : "serving a clearly defined audience"}. The page should ${pageGoal}, communicate the offer angle "${offerAngle}", use a ${tone} tone, and avoid inventing proof, testimonials, metrics, customers, or visual assets.`;

  const missingInputs: string[] = [];
  const lower = detectionText(rawIdea);
  if (!audience) missingInputs.push("target audience");
  if (!includesAny(lower, ["$", "price", "pret", "pricing", "paid", "free", "subscription", "abonament", "pilot"])) {
    missingInputs.push("pricing");
  }
  if (!includesAny(lower, ["proof", "testimonial", "case study", "customer", "result", "metric", "dovada", "rezultat"])) {
    missingInputs.push("proof");
  }
  if (!input.productType && product === "premium offer") missingInputs.push("product details");

  const proofNeeded = [
    "customer result or testimonial",
    "credible proof point",
    "specific metric or before/after evidence",
  ];

  return {
    ok: true,
    package: {
      raw_idea: rawIdea,
      refined_prompt: refinedPrompt,
      product_brief: productBrief,
      target_audience: audience || "needs clarification",
      offer_angle: offerAngle,
      transformation,
      tone,
      page_goal: pageGoal,
      recommended_sections: [...recommendedSections],
      proof_needed: proofNeeded,
      missing_inputs: missingInputs,
      generation_input: {
        project_title: projectTitle(product),
        source_prompt: rawIdea,
        refined_brief: productBrief,
        page_goal: pageGoal,
        tone,
        audience: audience || "needs clarification",
        offer_angle: offerAngle,
      },
    },
  };
}
