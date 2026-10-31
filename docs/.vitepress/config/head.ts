import type { HeadConfig } from "vitepress";

export const head: HeadConfig[] = [
  ["link", { rel: "icon", href: "/favicon.svg" }],
  [
    "meta",
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
];
