'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRestaurantById, getRestaurantProducts } from '@/services/restaurant/services';
import MenuClient from '@/components/menu/index';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

export default function MenuPage() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;

    const [restaurant, setRestaurant] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                console.log("Buscando restaurante com ID:", restaurantId);

                // Buscar informações do restaurante pelo ID
                const restaurantData = await getRestaurantById(restaurantId);
                setRestaurant(restaurantData);

                console.log("Restaurante encontrado:", restaurantData);

                // Buscar produtos do restaurante
                const productsData = await getRestaurantProducts(restaurantId);
                setProducts(productsData);

                // Extrair categorias únicas dos produtos
                const categorySet = new Set<string>();
                productsData.forEach(product => {
                    if (product.category) {
                        categorySet.add(product.category);
                    }
                });
                setCategories(Array.from(categorySet));

                // Salvar informações da mesa no localStorage (caso exista na URL)
                const urlParams = new URLSearchParams(window.location.search);
                const tableId = urlParams.get('table');
                if (tableId) {
                    localStorage.setItem(`table-${restaurantId}`, tableId);
                    console.log(`Mesa ${tableId} salva para restaurante ${restaurantId}`);
                }

            } catch (error: any) {
                console.error("Erro ao carregar dados:", error);
                setError(error.message || "Erro ao carregar cardápio. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        if (restaurantId) {
            fetchData();
        }
    }, [restaurantId]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-12">
                <div className="space-y-6">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex space-x-4 overflow-x-auto py-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-64 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-12 text-center">
                <div className="inline-flex p-4 mx-auto bg-red-100 rounded-full mb-4">
                    <AlertTriangle size={32} className="text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar cardápio</h1>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="container mx-auto py-12 text-center">
                <div className="inline-flex p-4 mx-auto bg-yellow-100 rounded-full mb-4">
                    <AlertTriangle size={32} className="text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-yellow-600 mb-4">Restaurante não encontrado</h1>
                <p className="text-gray-600">Não foi possível encontrar o restaurante solicitado.</p>
            </div>
        );
    }

    return (
        <MenuClient
            restaurantId={restaurantId}
            restaurantName={restaurant.name}
            initialProducts={products}
            initialCategories={categories}
        />
    );
}