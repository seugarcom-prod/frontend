// page.tsx
"use client";

import { Sidebar } from "@/components/dashboard/SideMenu";
import Header from "@/components/header/Header";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import AddRestaurantUnit from "@/components/units/add/AddRestaurantUnit";

export default function AddUnitPage() {
    const { isOpen } = useSidebar();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className={cn(
                    "flex-1 transition-all duration-300",
                    isOpen ? "ml-64" : "ml-0"
                )}>
                    <div className="max-w-5xl mx-auto px-6 py-8">
                        <AddRestaurantUnit />
                    </div>
                </main>
            </div>
        </div>
    );
}