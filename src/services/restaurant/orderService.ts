const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/';

// Interface para pedido
export interface IOrder {
    _id: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'payment_requested';
    totalAmount: number;
    items: Array<{
        name: string;
        price: number;
        quantity: number;
    }>;
    metadata?: {
        tableNumber?: number;
        orderType?: 'local' | 'takeaway';
        observations?: string;
        paymentMethod?: string;
        splitCount?: number;
    };
    isPaid: boolean;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Função para obter um pedido pelo ID
export async function getOrderById(orderId: string): Promise<IOrder> {
    try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('guest_token');
        const response = await fetch(`${API_URL}/order/${orderId}`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar pedido');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);

        // Retornar dados mock em caso de erro (para desenvolvimento)
        // Em produção, você pode querer lançar um erro ou implementar uma lógica diferente
        return {
            _id: orderId,
            status: 'pending',
            totalAmount: 75.50,
            items: [
                { name: 'X-Burger', quantity: 2, price: 25.90 },
                { name: 'Batata Frita', quantity: 1, price: 15.90 },
                { name: 'Refrigerante Lata', quantity: 2, price: 6.90 }
            ],
            isPaid: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
}

// Função para obter pedidos por mesa
export async function getOrdersByTable(restaurantId: string, tableNumber: string | number): Promise<IOrder[]> {
    try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('guest_token');
        const response = await fetch(`${API_URL}/restaurant/${restaurantId}/table/${tableNumber}/orders`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos da mesa');
        }

        const data = await response.json();
        return data.orders || [];
    } catch (error) {
        console.error('Erro ao buscar pedidos da mesa:', error);
        return [];
    }
}

// Função para criar pedido
export async function createOrder(restaurantId: string, orderData: any) {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('guest_token');

    try {
        const response = await fetch(`${API_URL}/order/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                restaurantUnitId: restaurantId,
                ...orderData
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao criar pedido');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}

// Função para solicitar fechamento de conta
export async function requestTableCheckout(restaurantId: string, tableNumber: string, splitCount: number = 1) {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('guest_token');

    try {
        const response = await fetch(`${API_URL}/order/request-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                restaurantUnitId: restaurantId,
                tableNumber,
                splitCount
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao solicitar fechamento de conta');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao solicitar fechamento de conta:', error);
        throw error;
    }
}