"use client";

import { useEffect, useState } from "react";
import UnitsList from "@/components/units/UnitsList";
import { Sidebar } from "@/components/dashboard/SideMenu";
import Header from "@/components/header/Header";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRestaurantId } from "@/hooks/useRestaurantId";
import { useAuthStore } from '@/stores';
import { redirect, useParams } from "next/navigation";
import { useAuthCheck } from "@/hooks/sessionManager";

interface Unit {
    id: string;
    name: string;
    manager: string;
    cnpj: string;
    status: "active" | "inactive" | "outOfHours";
    isTopSeller?: boolean;
    isActive: boolean;
}

export default function UnitsPage() {
    const { isAuthenticated, isLoading, session } = useAuthCheck();
    const updateFromSession = useAuthStore((state) => state.updateFromSession);
    const { restaurantId } = useParams();
    const { isLoading: isLoadingId } = useRestaurantId();
    const [units, setUnits] = useState<Unit[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { isOpen } = useSidebar();

    useEffect(() => {
        updateFromSession(session);
    }, [session, updateFromSession]);

    useEffect(() => {
        const fetchUnits = async () => {
            if (!restaurantId || isLoadingId) {
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/restaurant/${restaurantId}/units`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${session?.token}`
                        }
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao buscar unidades: ${errorData.message || response.statusText}`);
                }

                const data = await response.json();
                setUnits(data);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar unidades:", err);
                setError("Não foi possível carregar as unidades");
            }
        };

        fetchUnits();
    }, [restaurantId, isLoadingId, session]);

    // Ajuste para verificar role antes de redirecionar
    useEffect(() => {
        if (!isAuthenticated && session?.user?.role !== 'ADMIN' && session?.user?.role !== 'MANAGER') {
            redirect('/login');
        }
    }, [isAuthenticated, session]);

    if (isLoadingId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="ml-3">Carregando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col static h-screen w-full bg-background">
            <Header />

            <div className={cn(
                "flex flex-col w-screen transition-all duration-300",
                isOpen ? "ml-64" : "ml-0"
            )}>
                <Sidebar />

                <div className="flex-1 w-full overflow-auto">
                    <div className="max-w-5xl mx-auto px-6 py-4">
                        <UnitsList
                            units={units}
                            isLoading={isLoading}
                            restaurantId={restaurantId as string}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}