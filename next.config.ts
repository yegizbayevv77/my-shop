import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }, // product photos
      { protocol: "https", hostname: "placehold.co" }, // fallback placeholders
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
    ],
    // placehold.co serves SVG placeholders; allow them (safe for placeholder use)
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};

export default nextConfig;
