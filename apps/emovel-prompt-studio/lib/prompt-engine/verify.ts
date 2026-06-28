// Verification harness for Prompt Engine Core v1.
// Run: npx tsx lib/prompt-engine/verify.ts

import { promptPackageToMarkdown, refineRawIdea } from "./index";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

console.log("Prompt Engine Core:");

const valid = refineRawIdea({
  rawIdea: "  Create a premium AI launch system for founders that sells a paid pilot.  ",
});
check("raw idea valid produces package", valid.ok === true);
if (valid.ok) {
  check("whitespace is cleaned", valid.package.raw_idea === "Create a premium AI launch system for founders that sells a paid pilot.");
  check("recommended_sections contains hero", valid.package.recommended_sections.includes("hero"));
  check("recommended_sections contains offer", valid.package.recommended_sections.includes("offer"));
  check("recommended_sections contains pricing", valid.package.recommended_sections.includes("pricing"));
  check("recommended_sections contains faq", valid.package.recommended_sections.includes("faq"));
  check("generation_input has refined_brief", valid.package.generation_input.refined_brief.length > 0);

  const markdown = promptPackageToMarkdown(valid.package);
  check("markdown contains Refined Prompt", markdown.includes("## Refined Prompt"));
  check("markdown contains Page Builder Generation Input", markdown.includes("## Page Builder Generation Input"));
}

const tooShort = refineRawIdea({ rawIdea: "idea" });
check("raw idea too short is rejected", tooShort.ok === false);

const noAudience = refineRawIdea({
  rawIdea: "Create a landing page for a premium operations toolkit with paid pricing and proof later.",
});
check(
  "missing audience is reported",
  noAudience.ok === true && noAudience.package.missing_inputs.includes("target audience"),
);

const weakIdeaCases = [
  {
    name: "Instagram AI templates",
    rawIdea: "vreau site pt templateuri ai instagram",
    brief: "AI Instagram template library",
    audience: "Instagram",
    offer: "templates",
    transformation: "template system",
  },
  {
    name: "digital product launch",
    rawIdea: "fac ceva pentru oameni care vor sa lanseze produse digitale",
    brief: "digital product launch offer",
    audience: "creators and founders",
    offer: "paid offer",
    transformation: "structured launch offer",
  },
  {
    name: "course sales",
    rawIdea: "am un curs dar nu stiu cum sa il vand",
    brief: "online course",
    audience: "course creators",
    offer: "direct purchase path",
    transformation: "sales page path",
  },
  {
    name: "premium design service",
    rawIdea: "vreau pagina pentru servicii premium de design",
    brief: "premium design service",
    audience: "premium service buyers",
    offer: "trust",
    transformation: "books qualified calls",
  },
  {
    name: "founder offer clarity tool",
    rawIdea: "tool pentru fondatori sa faca oferte mai clare",
    brief: "offer clarity tool",
    audience: "founders",
    offer: "sharper paid offer",
    transformation: "unclear offer messaging",
  },
];

for (const sample of weakIdeaCases) {
  const result = refineRawIdea({ rawIdea: sample.rawIdea });
  check(`${sample.name} produces package`, result.ok === true);
  if (result.ok) {
    const pkg = result.package;
    check(`${sample.name} product brief is specific`, pkg.product_brief.toLowerCase().includes(sample.brief.toLowerCase()));
    check(`${sample.name} target audience is useful`, pkg.target_audience.toLowerCase().includes(sample.audience.toLowerCase()));
    check(`${sample.name} offer angle is commercial`, pkg.offer_angle.toLowerCase().includes(sample.offer.toLowerCase()));
    check(`${sample.name} transformation is concrete`, pkg.transformation.toLowerCase().includes(sample.transformation.toLowerCase()));
    check(`${sample.name} pricing is missing`, pkg.missing_inputs.includes("pricing"));
    check(`${sample.name} proof is missing`, pkg.missing_inputs.includes("proof"));
    check(`${sample.name} generation input is Page Builder ready`, pkg.generation_input.refined_brief === pkg.product_brief);
  }
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll checks passed.");
