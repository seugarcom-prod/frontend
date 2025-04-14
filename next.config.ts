import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en-US', 'es'],
    localeDetection: true,
  } as any,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL
  },
}

export default nextConfig;