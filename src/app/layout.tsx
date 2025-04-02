import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/queryProvider";
import { ToastProvider } from "@/components/toast/toastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sr. Garçom",
  description: "Sistema de gestão para restaurantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}