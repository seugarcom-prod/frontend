import type { NextConfig } from "next";
import { I18NConfig } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en-US', 'es'],
    localeDetection: true,
  } as any,
}

export default nextConfig;
