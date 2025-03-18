import React from 'react';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getRestaurantBySlug, getRestaurantProducts, getProductCategories } from '@/services/restaurant/services';
import MenuClient from '@/components/menu/index';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuPageProps {
    params: {
        restaurantName: string;
    };
}

export default async function MenuPage({ params }: MenuPageProps) {
    const { restaurantName } = params;

    try {
        // Buscar o restaurante pelo slug
        const restaurant = await getRestaurantBySlug(restaurantName);

        // Se o restaurante não for encontrado, mostrar página 404
        if (!restaurant) {
            notFound();
        }

        // Buscar produtos do restaurante
        const products = await getRestaurantProducts(restaurant._id);

        // Buscar categorias dos produtos
        const categories = await getProductCategories(products);

        return (
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Cardápio - {restaurant.name}</h1>

                <Suspense fallback={<MenuSkeleton />}>
                    <MenuClient
                        restaurantName={restaurantName}
                        restaurantId={restaurant._id}
                        initialProducts={products}
                        initialCategories={categories}
                    />
                </Suspense>
            </div>
        );
    } catch (error) {
        console.error('Erro ao carregar dados do cardápio:', error);
        return (
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-xl font-bold mb-4">Erro ao carregar cardápio</h1>
                <p>Não foi possível carregar os dados do cardápio. Tente novamente mais tarde.</p>
            </div>
        );
    }
}

function MenuSkeleton() {
    return (
        <div>
            {/* Skeleton para a barra de busca */}
            <Skeleton className="h-12 w-full mb-6" />

            {/* Skeleton para as categorias */}
            <div className="flex gap-2 overflow-x-auto mb-6">
                {[1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} className="h-10 w-24 rounded-full" />
                ))}
            </div>

            {/* Skeleton para os produtos */}
            {[1, 2, 3].map((item) => (
                <div key={item} className="mb-4">
                    <Skeleton className="h-48 w-full rounded-lg mb-2" />
                </div>
            ))}
        </div>
    );
}