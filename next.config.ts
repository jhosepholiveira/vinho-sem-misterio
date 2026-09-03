import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.VINHO_DEPLOY_TARGET === "node" ? "standalone" : undefined,
};

export default nextConfig;
