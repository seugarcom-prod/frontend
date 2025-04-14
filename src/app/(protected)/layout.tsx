// app/restaurant/[restaurantId]/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRestaurantId } from '@/hooks/useRestaurantId';
import { useSession } from 'next-auth/react';

export default function RestaurantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { restaurantId: string };
}) {
    const router = useRouter();
    const { status } = useSession();
    const restaurantId = useRestaurantId();

    useEffect(() => {
        // Redirecionar se o ID na URL estiver como 'undefined' e tivermos o ID real disponível
        if (params.restaurantId === 'undefined' && restaurantId) {
            // Construir nova URL substituindo 'undefined' pelo ID real
            const currentPath = window.location.pathname;
            const correctedPath = currentPath.replace('/restaurant/undefined/', `/restaurant/${restaurantId}/`);

            // Usar replace para não adicionar à pilha de histórico
            router.replace(correctedPath);
        }
    }, [restaurantId, params.restaurantId, router]);

    // Não bloquear a renderização, deixe o redirecionamento acontecer
    return <>{children}</>;
}