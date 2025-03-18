"use client";

import UnitsList from "@/components/units/UnitsList";
import { Sidebar } from "@/components/dashboard/SideMenu";
import Header from "@/components/header/Header";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function UnitsPage({ params }: { params: { restaurantName: string } }) {
    const { isOpen } = useSidebar();
    const restaurantName = params.restaurantName;

    return (
        <div className="flex flex-col static h-screen w-full bg-background">
            <Header />

            {/* Sidebar sempre presente no DOM com animação em ambas direções */}
            <div className={cn(
                "flex flex-col w-screen transition-all duration-300",
                isOpen ? "ml-64" : "ml-0"
            )}
            >
                <Sidebar />

                {/* Conteúdo principal centralizado, independente da sidebar */}
                <div className="flex-1 w-full overflow-auto">
                    <div className="max-w-5xl mx-auto px-6 py-4">
                        <UnitsList />
                    </div>
                </div>
            </div>
        </div>
    );
}