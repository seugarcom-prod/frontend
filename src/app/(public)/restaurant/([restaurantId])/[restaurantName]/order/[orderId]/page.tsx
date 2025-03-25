'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import { getRestaurantById, getOrderById } from '@/services/restaurant/services';

export default function OrderPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const restaurantId = params.restaurantId as string;
    const restaurantName = params.restaurantName as string;
    const orderId = params.orderId as string;
    const splitCount = searchParams.get('split') ? parseInt(searchParams.get('split')!) : 1;
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<any>(null);
    const [formattedRestaurantName, setFormattedRestaurantName] = useState<string>(
        restaurantName?.replace(/-/g, ' ') || "Restaurante"
    );
    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Buscar dados do restaurante pelo ID
                let restaurantData = null;
                try {
                    restaurantData = await getRestaurantById(restaurantId);
                    if (restaurantData) {
                        setRestaurant(restaurantData);
                        setFormattedRestaurantName(restaurantData.name || formattedRestaurantName);
                    }
                } catch (err) {
                    console.error("Erro ao buscar restaurante:", err);
                }

                // Buscar dados do pedido (usando uma função mock por enquanto)
                try {
                    // Aqui em uma implementação real, você buscaria os dados do pedido da API
                    // const orderResponse = await getOrderById(orderId);
                    // setOrderData(orderResponse);

                    // Mock data para exemplo
                    setOrderData({
                        status: 'pending',
                        totalAmount: 75.50,
                        items: [
                            { name: 'X-Burger', quantity: 2, price: 25.90 },
                            { name: 'Batata Frita', quantity: 1, price: 15.90 },
                            { name: 'Refrigerante Lata', quantity: 2, price: 6.90 }
                        ]
                    });
                } catch (err) {
                    console.error("Erro ao buscar pedido:", err);
                    setError("Não foi possível carregar os detalhes do pedido.");
                }

            } catch (error) {
                console.error("Erro ao carregar informações:", error);
                setError("Ocorreu um erro ao carregar os dados.");
            } finally {
                setIsLoading(false);
            }
        };

        if (restaurantId && orderId) {
            loadData();
        }
    }, [restaurantId, restaurantName, orderId, formattedRestaurantName]);

    // Voltar para o menu
    const handleBackToMenu = () => {
        router.push(`/restaurant/${restaurantId}/${restaurantName}/menu`);
    };

    // Voltar para a página inicial
    const handleBackToHome = () => {
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-md">
                <div className="animate-pulse">
                    <div className="h-16 w-16 bg-green-100 rounded-full mx-auto mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                    <div className="h-48 bg-gray-200 rounded mb-6"></div>
                    <div className="h-48 bg-gray-200 rounded mb-8"></div>
                    <div className="h-12 bg-gray-200 rounded mb-3"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-md text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-bold mb-2">Erro</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <OrderConfirmation
            orderId={orderId}
            restaurantId={restaurantId}
            restaurantName={formattedRestaurantName}
            splitCount={splitCount}
            onBackToMenu={handleBackToMenu}
            onBackToHome={handleBackToHome}
            orderData={orderData}
        />
    );
}