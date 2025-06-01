import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["source.unsplash.com"], // 👈 Add this line
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
