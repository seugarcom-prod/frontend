"use client";

import { useEffect, useState } from "react";
import UnitsList from "@/components/units/UnitsList";
import { Sidebar } from "@/components/dashboard/SideMenu";
import Header from "@/components/header/Header";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRestaurantId } from "@/hooks/useRestaurantId";
import { useAuthStore } from '@/stores';
import { useParams, useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/sessionManager";

export default function UnitsPage() {
    const router = useRouter(); // Adicione o useRouter
    const { isAuthenticated, isLoading, isAdminOrManager } = useAuthCheck();
    const { restaurantId } = useParams();
    const { isLoading: isLoadingId } = useRestaurantId();
    const [units, setUnits] = useState([]);
    const [error, setError] = useState(null);
    const { isOpen } = useSidebar();
    const token = useAuthStore((state) => state.token);

    // Adicione este useEffect para debug
    useEffect(() => {
        console.log('Estado de autenticação:', {
            isAuthenticated,
            isAdminOrManager,
            token,
            isLoading
        });
    }, [isAuthenticated, isAdminOrManager, token, isLoading]);

    // Modifique a verificação de autenticação
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdminOrManager)) {
            console.log('Redirecionando: Não autenticado ou sem permissão');
            router.push('/login');
            return;
        }
    }, [isAuthenticated, isAdminOrManager, isLoading, router]);

    // Modifique o useEffect de fetch
    useEffect(() => {
        const fetchUnits = async () => {
            if (!restaurantId || isLoadingId || !token || !isAuthenticated) {
                console.log('Condições não atendidas para fetch:', {
                    restaurantId,
                    isLoadingId,
                    hasToken: !!token,
                    isAuthenticated
                });
                return;
            }

            try {
                console.log('Iniciando fetch de unidades');
                const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
                const response = await fetch(`${API_URL}/restaurant/${restaurantId}/units?includeMatrix=true`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao buscar unidades');
                }

                const data = await response.json();
                console.log('Unidades recebidas:', data);

                // Formatar os dados para corresponder à interface Unit
                const formattedUnits = data.units.map((unit: any) => {
                    // Verificar se há managers e pegar o primeiro
                    const primaryManager = unit.managers && unit.managers.length > 0
                        ? unit.managers[0]
                        : null;

                    // Construir o nome do manager
                    let managerName = 'Sem gerente';
                    if (primaryManager) {
                        if (primaryManager.firstName && primaryManager.lastName) {
                            managerName = `${primaryManager.firstName} ${primaryManager.lastName}`;
                        } else if (primaryManager.firstName) {
                            managerName = primaryManager.firstName;
                        }
                    }

                    return {
                        id: unit._id,
                        name: unit.name,
                        manager: managerName,
                        cnpj: unit.cnpj,
                        status: unit.status,
                        isTopSeller: unit.isTopSeller || false
                    };
                });

                setUnits(formattedUnits);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar unidades:", err);
            }
        };

        fetchUnits();
    }, [restaurantId, isLoadingId, token, isAuthenticated]);

    // Modifique a condição de loading
    if (isLoading) {
        console.log('Renderizando loading state');
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="ml-3">Carregando...</p>
            </div>
        );
    }

    // Resto do componente permanece o mesmo...
    return (
        <div className="flex flex-col static h-screen bg-background w-dvw">
            <Header />
            <div className={cn("flex flex-col w-full transition-all duration-300", isOpen ? "ml-64" : "ml-0")}>
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