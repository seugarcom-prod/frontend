import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getRestaurantBySlug, getRestaurantUnits, getRestaurants, generateSlug } from '@/services/restaurant/services';

interface RestaurantPageProps {
    params: {
        restaurantName: string;
    };
}

// Esta função executa no servidor durante o build
export async function generateStaticParams() {
    try {
        // Buscar todos os restaurantes da API
        const restaurants = await getRestaurants();

        // Gerar slugs para cada restaurante
        return restaurants.map((restaurant) => ({
            restaurantName: generateSlug(restaurant.name),
        }));
    } catch (error) {
        console.error('Erro ao gerar parâmetros estáticos:', error);
        return [];
    }
}

// Esta função executa no servidor para cada solicitação (Server Component)
export default async function RestaurantPage({ params }: RestaurantPageProps) {
    const { restaurantName } = params;

    try {
        // Buscar o restaurante pelo slug
        const restaurant = await getRestaurantBySlug(restaurantName);

        // Se o restaurante não for encontrado, mostrar página 404
        if (!restaurant) {
            notFound();
        }

        // Buscar unidades do restaurante
        const units = await getRestaurantUnits(restaurant._id);

        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 relative overflow-hidden rounded-full">
                        {restaurant.logo ? (
                            <Image
                                src={restaurant.logo}
                                alt={restaurant.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 128px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Logo</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                        <p className="text-gray-600 mb-2">{restaurant.specialty}</p>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                ⭐ {restaurant.rating || 'Novo'}
                            </div>
                            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                📞 {restaurant.phone}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Sobre o Restaurante</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            {restaurant.socialName || restaurant.name} está localizado na {restaurant.address.street}, {restaurant.address.number}, {restaurant.address.complement || ''} - {restaurant.address.zipCode}.
                        </p>
                    </div>
                </div>

                {units && units.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Nossas Unidades</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {units.map((unit: any) => (
                                <div key={unit._id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium">{unit.socialName || 'Unidade'}</h3>
                                    <p className="text-sm text-gray-600">{unit.address.street}, {unit.address.number}</p>
                                    <p className="text-sm text-gray-600">{unit.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Link href={`/${restaurantName}/menu`} passHref>
                        <Button className="w-full h-16 text-lg font-medium">
                            Ver Cardápio
                        </Button>
                    </Link>

                    <Link href={`/${restaurantName}/table/scan`} passHref>
                        <Button className="w-full h-16 text-lg font-medium" variant="outline">
                            Escanear QR Code da Mesa
                        </Button>
                    </Link>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Erro ao carregar dados do restaurante:', error);
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Ocorreu um erro</h1>
                <p className="text-gray-600 mb-6">Não foi possível carregar os dados do restaurante. Tente novamente mais tarde.</p>
                <Link href="/" passHref>
                    <Button>Voltar para a página inicial</Button>
                </Link>
            </div>
        );
    }
}