import type { NextConfig } from "next";

// Static export so the site can be hosted on GitHub Pages.
// If the repo is NOT named <username>.github.io, set basePath to "/<repo-name>".
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "",
};

export default nextConfig;
