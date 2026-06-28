export type PromptPackage = {
  raw_idea: string;
  refined_prompt: string;
  product_brief: string;
  target_audience: string;
  offer_angle: string;
  transformation: string;
  tone: string;
  page_goal: string;
  recommended_sections: string[];
  proof_needed: string[];
  missing_inputs: string[];
  generation_input: {
    project_title: string;
    source_prompt: string;
    refined_brief: string;
    page_goal: string;
    tone: string;
    audience: string;
    offer_angle: string;
  };
};

export type PromptEngineInput = {
  rawIdea: string;
  brandSlug?: string;
  tone?: string;
  productType?: string;
  audience?: string;
};

export type PromptEngineResult =
  | { ok: true; package: PromptPackage }
  | { ok: false; errors: string[] };
