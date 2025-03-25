'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function QRCodeHandler() {
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.restaurantId as string;
    const tableId = params.tableId as string;

    useEffect(() => {
        if (!restaurantId || !tableId) {
            console.error('Parâmetros de QR Code inválidos');
            router.push('/');
            return;
        }

        // Salvar temporariamente a mesa no localStorage
        localStorage.setItem(`table-${restaurantId}`, tableId);
        console.log(`Mesa ${tableId} salva para restaurante ${restaurantId}`);

        // Redirecionar para página de identificação
        router.push(`/restaurant/${restaurantId}/table/${tableId}`);
    }, [restaurantId, tableId, router]);

    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-xl font-bold mb-4">Redirecionando...</h1>
            <p className="text-gray-600 mb-8">Aguarde enquanto processamos o QR Code.</p>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    );
}