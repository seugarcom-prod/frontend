"use client"

import { Providers } from "@/providers/queryProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import AdminGuard from '@/components/guards/AdminGuard' // O componente de proteção que criamos

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Providers>
            <AdminGuard requiredRole="ANY_ADMIN">
                <SidebarProvider>
                    {children}
                </SidebarProvider>
            </AdminGuard>
        </Providers>
    )
}