"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, BadgePercent, BarChart, Store, Sun, Cog, Home, LogOut, UserCog2, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

// Define the navigation items
interface NavItem {
    title: string
    href: string
    icon: React.ReactNode
    color: string
}

const items: NavItem[] = [
    {
        title: "Início",
        href: "/admin",
        icon: <Home size={20} />,
        color: "#ef4444"
    },
    {
        title: "Funcionários",
        href: "/funcionarios",
        icon: <UserCog2 size={20} />,
        color: "#84cc16"
    },
    {
        title: "Unidades",
        href: "/restaurant/unit",
        icon: <Store size={20} />,
        color: "#d946ef"
    },
    {
        title: "Promoções",
        href: "/promocoes",
        icon: <BadgePercent size={20} />,
        color: "#f97316"
    },
    {
        title: "Estatísticas",
        href: "/estatisticas",
        icon: <BarChart size={20} />,
        color: "#06b6d4"
    }
]

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { setTheme } = useTheme()
    const { isOpen } = useSidebar();

    // Sidebar está escondida quando isOpen é false
    if (!isOpen) {
        return null;
    }

    return (
        <div className={cn("fixed top-0 left-0 w-72 h-screen bg-background border-r border-border", className)}>
            <div className="h-full flex flex-col bg-secondary">
                {/* Menu de navegação */}
                <div className="flex-1 pt-16 bg-background">
                    <nav className="space-y-1 bg-background">
                        {items.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-8 py-4 text-primary transition-all hover:bg-primary-foreground",
                                    pathname === item.href
                                        ? "bg-background"
                                        : ""
                                )}
                            >
                                <span style={{ color: item.color }}>{item.icon}</span>
                                <span className="text-primary">{item.title}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Footer da sidebar */}
                <div className="mt-auto bg-background border-t border-border">

                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <Link href="/" className="flex items-center gap-4 px-5 py-4 text-primary cursor-pointer">
                                <LogOut size={20} className="text-gray-500" />
                                <span>Desconectar</span>
                            </Link>
                        </div>
                        <div className="flex justify-between items-end gap-2 px-5 py-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/configuracoes" className="flex items-center gap-4 text-primary">
                                <Cog size={20} className="text-gray-500" />
                                <span>Configurações</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

// Mobile Sidebar with Sheet component
export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}