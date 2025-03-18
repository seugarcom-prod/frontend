'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';

export default function TablePage() {
    const params = useParams();
    const router = useRouter();
    const restaurantName = params.restaurantName as string;
    const tableId = params.tableId as string;

    // Salvar o número da mesa no localStorage
    useEffect(() => {
        localStorage.setItem(`table-${restaurantName}`, tableId);
    }, [restaurantName, tableId]);

    // Função para ir para o cardápio
    const goToMenu = () => {
        router.push(`/${restaurantName}/menu`);
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-8">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Book size={40} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary mb-2">Mesa {tableId}</h1>
                <p className="text-gray-600 mb-6">
                    Você está acessando o cardápio digital de {restaurantName.replace(/-/g, ' ')}.
                </p>
            </div>

            <Button
                onClick={goToMenu}
                variant="default"
                className="w-full py-6 text-lg font-medium bg-primary text-white rounded-lg"
            >
                Ver Cardápio
            </Button>
        </div>
    );
}