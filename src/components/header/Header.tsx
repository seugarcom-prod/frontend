"use client"

import { Bell, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function Header() {
    const { toggle, isOpen } = useSidebar();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border sticky top-0 z-50 h-16 w-full">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggle}
                className="h-10 w-10 rounded-full bg-background border-border hover:bg-primary hover:text-secondary"
                aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>

            <h2 className="text-xl text-primary font-medium text-center">Lanchonete do Bio</h2>

            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-background border-border hover:bg-primary hover:text-secondary"
            >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
        </header>
    );
}