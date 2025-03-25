'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RestaurantPage() {
    const params = useParams();
    const router = useRouter();
    const restaurantName = params.restaurantName as string;
    const restaurantId = params.restaurantId as string;
    const APIBACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        // Função para buscar o ID do restaurante pelo nome
        async function fetchRestaurantId() {
            try {
                const response = await fetch(`${APIBACKEND_URL}/restaurant/by-slug/${restaurantName}`);
                if (response.ok) {
                    const restaurant = await response.json();
                    // Redirecionar para a URL com ID
                    router.push(`/${restaurantName}/${restaurantId}/menu`);
                } else {
                    // Restaurante não encontrado
                    router.push('/404');
                }
            } catch (error) {
                console.error('Erro ao buscar restaurante:', error);
            }
        }

        fetchRestaurantId();
    }, [restaurantName, router]);

    return <div>Carregando...</div>;
}