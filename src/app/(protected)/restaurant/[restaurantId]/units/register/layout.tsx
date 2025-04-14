"use client"

import { SidebarProvider } from "@/components/ui/sidebar"

export default function RestaurantUnitRegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                {children}
            </div>
        </SidebarProvider>
    );
}