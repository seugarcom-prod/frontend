import React from 'react';
import { getRestaurantBySlug } from '@/services/restaurant/services';
import { notFound } from 'next/navigation';
import ScanClient from '@/components/QRScan/ScanClient';

interface ScanPageProps {
    params: {
        restaurantName: string;
    };
}

export default async function ScanPage({ params }: ScanPageProps) {
    const { restaurantName } = params;

    try {
        // Buscar o restaurante pelo slug
        const restaurant = await getRestaurantBySlug(restaurantName);

        // Se o restaurante não for encontrado, mostrar página 404
        if (!restaurant) {
            notFound();
        }

        return (
            <div className="container mx-auto px-4 py-6">
                <ScanClient
                    restaurantName={restaurantName}
                    restaurantId={restaurant._id}
                />
            </div>
        );
    } catch (error) {
        console.error('Erro ao carregar dados do restaurante:', error);
        return (
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-xl font-bold mb-4">Erro ao carregar scanner</h1>
                <p>Não foi possível carregar os dados necessários. Tente novamente mais tarde.</p>
            </div>
        );
    }
}