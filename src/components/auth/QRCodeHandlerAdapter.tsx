'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

// API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

interface QRCodeHandlerProps {
    params: {
        restaurantName: string;
        tableId: string;
    };
}

export default function QRCodeHandler({ params }: QRCodeHandlerProps) {
    const router = useRouter();
    const { restaurantName, tableId } = params;
    const { authenticateAsGuest, isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleQRScan = async () => {
            try {
                setLoading(true);

                // Salvar a mesa no localStorage (independente de autenticação)
                localStorage.setItem(`table-${restaurantName}`, tableId);

                // Buscar informações do restaurante pelo slug
                const response = await fetch(`${API_URL}/restaurant/by-slug/${restaurantName}`);

                if (!response.ok) {
                    throw new Error('Restaurante não encontrado');
                }

                const restaurant = await response.json();

                // Se o usuário não estiver autenticado, autenticar como convidado
                if (!isAuthenticated) {
                    authenticateAsGuest(tableId, restaurant._id, restaurantName);
                }

                // Redirecionar para a página da mesa
                router.push(`/${restaurantName}/table/${tableId}`);
            } catch (error) {
                console.error('Erro ao processar QR code:', error);
                setError('Não foi possível acessar este QR code. Verifique se o restaurante existe.');
            } finally {
                setLoading(false);
            }
        };

        handleQRScan();
    }, [restaurantName, tableId, router, authenticateAsGuest, isAuthenticated]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg text-gray-600">Processando QR Code...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <Button
                        variant="secondary"
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Voltar à página inicial
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <p>Redirecionando para a mesa {tableId}...</p>
        </div>
    );
}