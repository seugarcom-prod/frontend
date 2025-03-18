'use client';

import { IRestaurant, IProduct, IRestaurantUnit } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Função para gerar slug a partir do nome do restaurante
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-')     // Substitui espaços por hífens
        .replace(/-+/g, '-');     // Remove múltiplos hífens seguidos
}

// Buscar todos os restaurantes
export async function getRestaurants(): Promise<IRestaurant[]> {
    const response = await fetch(`${API_BASE_URL}/restaurant/list`, {
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar restaurantes');
    }

    return response.json();
}

// Buscar restaurante pelo ID
export async function getRestaurantById(id: string): Promise<IRestaurant> {
    const response = await fetch(`${API_BASE_URL}/restaurant/${id}`, {
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar restaurante');
    }

    return response.json();
}

// Buscar restaurante por slug (nome)
export async function getRestaurantBySlug(slug: string): Promise<IRestaurant | null> {
    // Como a API não tem endpoint por slug, precisamos buscar todos e filtrar
    const restaurants = await getRestaurants();

    const restaurant = restaurants.find(
        (r) => generateSlug(r.name) === slug
    );

    return restaurant || null;
}

// Buscar unidades de um restaurante
export async function getRestaurantUnits(restaurantId: string): Promise<IRestaurantUnit[]> {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/units`, {
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar unidades do restaurante');
    }

    return response.json();
}

// Buscar produtos de um restaurante
export async function getRestaurantProducts(restaurantId: string): Promise<IProduct[]> {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/products/`, {
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar produtos do restaurante');
    }

    return response.json();
}

// Enviar um pedido
export async function createOrder(
    restaurantId: string,
    data: {
        items: Array<{ productId: string; quantity: number }>;
        table: number;
        observations?: string;
    }
): Promise<any> {
    // Obter ID do usuário atual (ou usar um ID genérico para pedidos anônimos)
    const userId = localStorage.getItem('userId') || 'anonymous';

    const response = await fetch(`${API_BASE_URL}/user/${userId}/${restaurantId}/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Adicione cabeçalhos de autenticação, se necessário
        },
        body: JSON.stringify({
            userId,
            restaurantId,
            ...data
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar pedido');
    }

    return response.json();
}

// Obter pedidos de um usuário
export async function getUserOrders(userId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/request/list`, {
        headers: {
            // Adicione cabeçalhos de autenticação, se necessário
        }
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar pedidos do usuário');
    }

    return response.json();
}

// Buscar categorias baseado nos produtos (já que não há endpoint específico)
export async function getProductCategories(products: IProduct[]): Promise<string[]> {
    // Extrair categorias únicas dos produtos usando filter para compatibilidade
    const categories = products
        .map(product => product.category)
        .filter((category, index, self) =>
            category && self.indexOf(category) === index
        );

    return categories;
}