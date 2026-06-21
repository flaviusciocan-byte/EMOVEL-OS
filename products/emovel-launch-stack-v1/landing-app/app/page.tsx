const deliverables = [
  ["Audience Snapshot", "Defines the buyer, pain, desire, objections, and language"],
  ["Offer Stack", "Frames the product as a transformation with bonuses and guarantee"],
  ["Pricing Map", "Sets the price, tiers, payment plan, and upgrade logic"],
  ["Landing Page Copy", "Gives you the hero, CTA flow, proof, and FAQ copy"],
  ["Visual Brief", "Defines colors, typography, imagery, layout, and creative direction"],
  ["Funnel Map", "Shows how traffic moves from interest to sale"],
  ["Launch Plan", "Gives you a 14-day content and outreach sequence"],
  ["Usage Guide", "Shows how to turn the package into a live launch"]
];

const skills = [
  "Audience Builder",
  "Offer Architect",
  "Pricing Engine",
  "Copy Framework",
  "Page Builder",
  "Visual Brief",
  "Funnel Builder"
];

const benefits = [
  {
    title: "Sell the outcome, not the features",
    body: "The offer stack translates your idea into a buyer-facing promise that makes the value obvious."
  },
  {
    title: "Charge with confidence",
    body: "The pricing map gives you a clear price point, tier structure, anchor, and payment plan."
  },
  {
    title: "Build the page faster",
    body: "The landing page copy gives your page builder, designer, or developer a complete conversion structure."
  },
  {
    title: "Stay visually consistent",
    body: "The visual brief gives your brand and launch assets a premium direction before anyone opens a design tool."
  },
  {
    title: "Publish with a plan",
    body: "The launch plan tells you what to say before launch, on launch day, and after launch."
  }
];

const tiers = [
  {
    name: "Starter",
    price: "$197",
    note: "For buyers who want templates and prompts only.",
    features: ["Intake template", "Launch stack outline", "Prompt sequence", "Example output"]
  },
  {
    name: "Core",
    price: "$497",
    note: "For founders who want one complete launch stack.",
    featured: true,
    features: ["Everything in Starter", "Audience, offer, pricing, copy, visual, and funnel package", "Launch plan", "Usage guide"]
  },
  {
    name: "Premium",
    price: "$1,500",
    note: "For teams that want implementation support.",
    features: ["Everything in Core", "90-minute strategy session", "Landing page wireframe review", "7-day async refinement window"]
  }
];

const faqs = [
  ["Is this just a prompt pack?", "No. The prompt logic is part of the system, but the output is a structured launch package for a real page, real offer, and real launch."],
  ["Do I need a finished product?", "No. You need a concrete product idea, target buyer, and intended outcome. The stack is especially useful before you overbuild."],
  ["Will this build my landing page for me?", "The Core version gives you the page copy and structure. Premium can include review support, but live implementation is separate."],
  ["Can agencies use this for clients?", "Yes. Agencies should use Premium or the Agency License depending on whether they need one client stack or repeatable delivery rights."],
  ["Is there a revenue guarantee?", "No. The guarantee covers clarity and completeness. Sales depend on product quality, audience fit, traffic, trust, and follow-through."]
];

function CtaButton({ children }: { children: React.ReactNode }) {
  return <a className="cta" href="#pricing">{children}</a>;
}

function ArtifactPreview() {
  return (
    <div className="artifact" aria-label="Preview of the EMOVEL Launch Stack deliverables">
      <div className="artifactTop">
        <span>EMOVEL / LAUNCH STACK</span>
        <span>v1</span>
      </div>
      <div className="artifactHero">
        <div>
          <p className="artifactLabel">Raw idea</p>
          <h2>Underlaunched operator</h2>
        </div>
        <div className="artifactPrice">$497</div>
      </div>
      <div className="artifactGrid">
        {["Offer", "Price", "Page", "Visual", "Funnel", "Launch"].map((item) => (
          <div className="artifactCell" key={item}>
            <span>{item}</span>
            <strong>Ready</strong>
          </div>
        ))}
      </div>
      <div className="artifactTimeline">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <section className="hero sectionBand">
        <nav className="nav" aria-label="Main navigation">
          <span className="brand">EMOVEL</span>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Premium launch command system</p>
            <h1>Turn Your Raw Product Idea Into A Launch-Ready Offer</h1>
            <p className="subhead">
              EMOVEL Launch Stack v1 turns your product idea into a clear audience profile, offer stack, pricing strategy, landing page copy, visual brief, funnel map, and 14-day launch plan.
            </p>
            <div className="heroActions">
              <CtaButton>Get The Launch Stack</CtaButton>
              <p>Built for one product idea. Delivered as a complete launch package.</p>
            </div>
          </div>
          <ArtifactPreview />
        </div>
      </section>

      <section className="problem sectionBand">
        <div className="narrow">
          <p className="eyebrow">The real bottleneck</p>
          <h2>Your product is not stuck because it is bad. It is stuck because it is unclear.</h2>
          <p>
            You know the idea has value. You can explain it in a call. But when it is time to write the offer, choose a price, structure the page, or announce the launch, everything slows down.
          </p>
        </div>
      </section>

      <section className="sectionBand white">
        <div className="container">
          <div className="sectionHeader">
            <p className="eyebrow">The system</p>
            <h2>One structured system for the assets every launch needs.</h2>
          </div>
          <div className="process">
            {skills.map((skill, index) => (
              <div className="processStep" key={skill}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{skill}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark sectionBand">
        <div className="container">
          <div className="sectionHeader">
            <p className="eyebrow mint">Deliverables</p>
            <h2>Your complete launch foundation.</h2>
          </div>
          <div className="deliverableTable">
            {deliverables.map(([name, body]) => (
              <div className="deliverableRow" key={name}>
                <strong>{name}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBand">
        <div className="container">
          <div className="sectionHeader">
            <p className="eyebrow">Why it works</p>
            <h2>Launch with sharper thinking before you spend on design, ads, or development.</h2>
          </div>
          <div className="benefits">
            {benefits.map((benefit) => (
              <article className="benefitCard" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="white sectionBand">
        <div className="proof">
          <p className="eyebrow">System proof</p>
          <blockquote>
            "We used EMOVEL Launch Stack v1 to turn a rough product idea into a complete sales page, pricing model, and 14-day launch plan in under 48 hours."
          </blockquote>
        </div>
      </section>

      <section className="pricing sectionBand" id="pricing">
        <div className="container">
          <div className="sectionHeader">
            <p className="eyebrow mint">Offer stack</p>
            <h2>Get the launch assets that usually require a strategist, copywriter, and designer.</h2>
          </div>
          <div className="pricingGrid">
            {tiers.map((tier) => (
              <article className={tier.featured ? "tier featuredTier" : "tier"} key={tier.name}>
                <p className="tierName">{tier.name}</p>
                <strong className="tierPrice">{tier.price}</strong>
                <p>{tier.note}</p>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="guarantee sectionBand">
        <div className="narrow">
          <p className="eyebrow">Risk reversal</p>
          <h2>The Launch-Clarity Guarantee</h2>
          <p>
            Complete the intake and receive a stack with a clear offer, price, page structure, visual direction, and launch plan. If the stack does not give you that clarity, EMOVEL will revise it once within 14 days at no additional cost.
          </p>
        </div>
      </section>

      <section className="white sectionBand">
        <div className="container faqWrap">
          <div className="sectionHeader">
            <p className="eyebrow">Questions</p>
            <h2>Common objections, answered directly.</h2>
          </div>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing sectionBand">
        <div className="narrow">
          <p className="eyebrow mint">Next move</p>
          <h2>Get the product out of your head and into the market.</h2>
          <p>If your idea has been waiting for the right offer, price, page, and plan, this is the fastest way to turn it into something buyers can understand.</p>
          <CtaButton>Get EMOVEL Launch Stack v1</CtaButton>
        </div>
      </section>
    </main>
  );
}
