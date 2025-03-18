"use client"

import { Providers } from "@/providers/queryProvider"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function RestaurantUnitListLayout({
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