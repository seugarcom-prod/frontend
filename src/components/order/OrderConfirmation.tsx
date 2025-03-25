import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Clock } from 'lucide-react';
import { formatCurrency } from '@/services/restaurant/services';

interface OrderConfirmationProps {
    orderId: string;
    restaurantId: string;
    restaurantName: string;
    splitCount?: number;
    onBackToMenu: () => void;
    onBackToHome: () => void;
    orderData?: {
        status: string;
        totalAmount: number;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
    };
}

export default function OrderConfirmation({
    orderId,
    restaurantId,
    restaurantName,
    splitCount = 1,
    onBackToMenu,
    onBackToHome,
    orderData
}: OrderConfirmationProps) {
    // Usar dados mockados se orderData não for fornecido
    const order = orderData || {
        status: 'pending',
        totalAmount: 75.50,
        items: [
            { name: 'X-Burger', quantity: 2, price: 25.90 },
            { name: 'Batata Frita', quantity: 1, price: 15.90 },
            { name: 'Refrigerante Lata', quantity: 2, price: 6.90 }
        ]
    };

    // Valor por pessoa quando a conta é dividida
    const totalPerPerson = splitCount > 1 ? order.totalAmount / splitCount : order.totalAmount;

    // Formatar ID do pedido
    const displayOrderId = orderId.startsWith('order_')
        ? orderId.substring(6, 14).toUpperCase()
        : orderId.substring(0, 8).toUpperCase();

    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            {/* Cabeçalho com check */}
            <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">Pedido Confirmado!</h1>
                <p className="text-gray-600">
                    Seu pedido foi recebido e está sendo preparado.
                </p>
            </div>

            {/* Detalhes do pedido */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <h2 className="text-lg font-bold mb-4">Detalhes do Pedido</h2>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Número do Pedido:</span>
                        <span className="font-medium">ORDER_{displayOrderId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Restaurante:</span>
                        <span>{restaurantName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-orange-500 flex items-center font-medium">
                            <Clock size={16} className="mr-1" /> Pendente
                        </span>
                    </div>

                    <div className="flex justify-between items-center font-bold pt-2 mt-2 border-t border-gray-100">
                        <span>Total:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                    </div>

                    {splitCount > 1 && (
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Valor por pessoa ({splitCount}):</span>
                            <span>{formatCurrency(totalPerPerson)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Itens do pedido */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <h2 className="text-lg font-bold mb-4">Itens do Pedido</h2>

                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                    {item.quantity}x {formatCurrency(item.price)}
                                </div>
                            </div>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
                <Button
                    onClick={onBackToMenu}
                    variant="default"
                    className="w-full bg-primary text-white py-2 h-12"
                >
                    Fazer Outro Pedido
                </Button>

                <Button
                    onClick={onBackToHome}
                    variant="outline"
                    className="w-full py-2 h-12 flex items-center justify-center"
                >
                    <Home size={18} className="mr-2" />
                    Voltar para a Página Inicial
                </Button>
            </div>
        </div>
    );
}