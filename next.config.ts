import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  output: "standalone",
};
export default withNextIntl(nextConfig);
