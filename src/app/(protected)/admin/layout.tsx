"use client"

import { Providers } from "@/providers/queryProvider"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Providers>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </Providers>
    )
}