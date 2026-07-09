import { defineProject } from "@ldlework/workmark/define";

export default [
  defineProject({
    name: "feedback",
    tags: ["lib"],
    description: "Drop-in feedback overlay for React",
    has: {
      buildable: { command: "pnpm build" },
      typecheckable: true,
      publishable: { kind: "npm", npmName: "@ldlework/feedback" },
    },
  }),
  defineProject({
    name: "feedback-site",
    dir: "site",
    tags: ["site"],
    description: "Landing page + docs at feedback.ldlework.com",
    has: {
      buildable: { command: "pnpm build" },
      typecheckable: true,
      publishable: { kind: "pages", url: "https://feedback.ldlework.com" },
    },
  }),
];
