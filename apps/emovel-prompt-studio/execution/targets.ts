export const builderTargets = ["GPT-Pilot", "Pythagora", "Reflex", "Next.js"] as const;

export const publishingTargets = ["Gumroad", "Instagram", "Facebook", "TikTok", "Email"] as const;

export type BuilderTarget = (typeof builderTargets)[number];
export type PublishingTarget = (typeof publishingTargets)[number];

export const targetToolMap: Record<BuilderTarget | PublishingTarget, string[]> = {
  "GPT-Pilot": ["gpt-pilot-main"],
  Pythagora: ["gpt-pilot-main"],
  Reflex: ["reflex-main"],
  "Next.js": ["apps/emovel-prompt-studio", "apps/emovel-site"],
  Gumroad: ["publish-package", "SHOP_STATUS.md"],
  Instagram: ["SOCIAL_LAUNCH_POSTS.md"],
  Facebook: ["SOCIAL_LAUNCH_POSTS.md"],
  TikTok: ["SOCIAL_LAUNCH_POSTS.md"],
  Email: ["EMAIL_LAUNCH_COPY.md"]
};
