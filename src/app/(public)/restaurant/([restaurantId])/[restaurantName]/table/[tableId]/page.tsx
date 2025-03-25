'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { UserLogin, GuestLogin } from '@/components/login/index';

export default function TableIdentificationPage() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;
    const tableId = params.tableId as string;
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar informações do restaurante
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setIsLoading(true);

                // Para fins de desenvolvimento, estamos usando um mock
                // Em produção, você substituiria por uma chamada real à API
                setTimeout(() => {
                    setRestaurant({
                        _id: restaurantId,
                        name: 'Ecaflip Bêbado',
                        cnpj: '20031219000346',
                        specialty: 'Brasileira',
                        phone: '83986192317'
                    });
                    setIsLoading(false);
                }, 500);

                // Salvar o número da mesa no localStorage
                localStorage.setItem(`table-${restaurantId}`, tableId);

            } catch (error: any) {
                console.error('Erro ao carregar dados:', error);
                setError(error.message || 'Erro ao carregar informações do restaurante.');
                setIsLoading(false);
            }
        };

        if (restaurantId && tableId) {
            fetchRestaurantData();
        } else {
            setError('Parâmetros inválidos');
            setIsLoading(false);
        }
    }, [restaurantId, tableId]);

    // Callback para quando o login é bem-sucedido
    const handleLoginSuccess = () => {
        router.push(`/restaurant/${restaurantId}/menu`);
    };

    // Função para continuar como convidado anônimo
    const continueWithoutLogin = () => {
        // Criar um token de convidado genérico
        const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('guest_token', guestToken);

        // Salvar informações básicas do convidado
        localStorage.setItem('guest_data', JSON.stringify({
            firstName: `Mesa ${tableId}`,
            isGuest: true
        }));

        // Redirecionar para o menu
        router.push(`/restaurant/${restaurantId}/menu`);
    };

    // Função para ir diretamente para o cardápio
    const goToMenu = () => {
        continueWithoutLogin();
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center justify-center min-h-[70vh]">
                <div className="text-center mb-8 w-full">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-8 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-64 mx-auto mb-6" />
                </div>
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center justify-center min-h-[70vh]">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Erro</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
                <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                >
                    Voltar à Página Inicial
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-md min-h-[90vh] flex flex-col">
            {/* Cabeçalho com informações da mesa */}
            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Book size={40} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary mb-2">Mesa {tableId}</h1>
                {restaurant && (
                    <p className="text-gray-600 mb-4">
                        Você está acessando o cardápio digital de {restaurant.name}.
                    </p>
                )}
            </div>

            {/* Abas de identificação */}
            <div className="flex-grow mb-6">
                <Tabs defaultValue="user" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="user">Usuário</TabsTrigger>
                        <TabsTrigger value="guest">Convidado</TabsTrigger>
                    </TabsList>

                    <TabsContent value="user" className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm">Faça login para acessar sua conta e visualizar histórico de pedidos.</p>
                        </div>
                        <UserLogin onLoginSuccess={handleLoginSuccess} />
                    </TabsContent>

                    <TabsContent value="guest" className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm">Identifique-se para facilitar seus pedidos. Suas informações não serão armazenadas.</p>
                        </div>
                        <GuestLogin onLoginSuccess={handleLoginSuccess} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Opção para continuar sem login */}
            <div className="mt-auto pb-8">
                <div className="flex items-center w-full my-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-sm text-gray-500">ou</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <Button
                    onClick={goToMenu}
                    variant="default"
                    className="w-full"
                >
                    Ver Cardápio
                </Button>
            </div>
        </div>
    );
}