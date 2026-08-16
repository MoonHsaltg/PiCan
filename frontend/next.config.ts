import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Next 16 creates AI instruction files during development unless disabled.
  agentRules: false,
  reactStrictMode: true,
  turbopack: {
    root: path.join(projectRoot, ".."),
  },
};

export default nextConfig;
