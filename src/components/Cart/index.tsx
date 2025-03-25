'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    IProduct,
    getCartItems,
    updateCartItem,
    removeFromCart,
    calculateCartTotal,
    formatCurrency,
    getRestaurantById
} from '@/services/restaurant/services';

export default function CartPage() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;
    const router = useRouter();

    // Estados
    const [restaurant, setRestaurant] = useState<any>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [cart, setCart] = useState<{ productId: string, quantity: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tableNumber, setTableNumber] = useState<string | null>(null);

    // Estados para informações do pedido
    const [orderType, setOrderType] = useState<'local' | 'takeaway'>('local');
    const [observations, setObservations] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        const loadCartData = async () => {
            try {
                setIsLoading(true);

                // 1. Carregar dados do restaurante
                const restaurantData = await getRestaurantById(restaurantId);
                setRestaurant(restaurantData);

                // 2. Carregar carrinho
                const cartItems = getCartItems(restaurantId);
                setCart(cartItems);

                // Se carrinho vazio, redirecionar para menu
                if (cartItems.length === 0) {
                    router.push(`/restaurant/${restaurantId}/menu`);
                    return;
                }

                // 3. Carregar produtos mock
                setProducts([
                    {
                        _id: 'prod1',
                        name: 'X-Burger',
                        description: 'Hambúrguer com queijo, alface e tomate',
                        price: 25.90,
                        quantity: 0,
                        image: '/xtudo.jpg',
                        category: 'Hambúrgueres',
                        isAvailable: true
                    },
                    {
                        _id: 'prod2',
                        name: 'X-Bacon',
                        description: 'Hambúrguer com queijo, bacon, alface e tomate',
                        quantity: 0,
                        price: 28.90,
                        image: '/burger.jpg',
                        category: 'Hambúrgueres',
                        isAvailable: true
                    },
                    {
                        _id: 'prod3',
                        name: 'Batata Frita',
                        description: 'Porção de batatas fritas crocantes',
                        quantity: 0,
                        price: 15.90,
                        image: '/batatafrita.jpg',
                        category: 'Acompanhamentos',
                        isAvailable: true
                    },
                    {
                        _id: 'prod4',
                        name: 'Refrigerante Lata',
                        description: 'Lata 350ml',
                        quantity: 0,
                        price: 6.90,
                        image: '/cocacola.jpg',
                        category: 'Bebidas',
                        isAvailable: true
                    },
                    {
                        _id: 'prod5',
                        name: 'Suco Natural',
                        description: '300ml de suco de fruta natural',
                        quantity: 0,
                        price: 9.90,
                        image: '/suconatural.jpg',
                        category: 'Bebidas',
                        isAvailable: true
                    },
                    {
                        _id: 'prod6',
                        name: 'Pudim',
                        description: 'Delicioso pudim de leite condensado',
                        quantity: 0,
                        price: 12.90,
                        image: '/pudim.jpg',
                        category: 'Sobremesas',
                        isAvailable: true
                    }
                ]);

                // 4. Verificar número da mesa
                const tableNum = localStorage.getItem(`table-${restaurantId}`);
                setTableNumber(tableNum);

            } catch (error: any) {
                console.error("Erro ao carregar dados do carrinho:", error);
                setError(error.message || "Ocorreu um erro ao carregar o carrinho");
            } finally {
                setIsLoading(false);
            }
        };

        if (restaurantId) {
            loadCartData();
        }
    }, [restaurantId, router]);

    // Atualizar quantidade de um item
    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
        } else {
            const updatedCart = updateCartItem(restaurantId, productId, newQuantity);
            setCart(updatedCart);
        }
    };

    // Remover um item do carrinho
    const handleRemoveItem = (productId: string) => {
        const updatedCart = removeFromCart(restaurantId, productId);
        setCart(updatedCart);

        // Se o carrinho ficar vazio, redirecionar para o menu
        if (updatedCart.length === 0) {
            router.push(`/restaurant/${restaurantId}/menu`);
        }
    };

    // Obter informações de um produto pelo ID
    const getProductById = (productId: string): IProduct | undefined => {
        return products.find(product => product._id === productId);
    };

    // Calcular total do carrinho
    const getCartTotal = () => {
        return calculateCartTotal(restaurantId, products);
    };

    // Voltar para o menu
    const goBackToMenu = () => {
        router.push(`/restaurant/${restaurantId}/menu`);
    };

    // Finalizar pedido
    const handleCheckout = () => {
        setIsSubmitting(true);

        // Simular chamada API
        setTimeout(() => {
            // Criar um ID de pedido falso
            const orderId = `order_${Date.now()}`;

            // Limpar carrinho
            localStorage.removeItem(`cart-${restaurantId}`);

            // Redirecionar para confirmação
            router.push(`/restaurant/${restaurantId}/order/${orderId}`);
        }, 1500);
    };

    // Renderização de estados de carregamento e erro
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>

                    <div className="space-y-4 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-6 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-40 bg-gray-200 rounded mb-8"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-2">Erro</h2>
                    <p>{error}</p>
                </div>
                <Button onClick={goBackToMenu}>Voltar ao Menu</Button>
            </div>
        );
    }

    // Renderização principal
    return (
        <div className="container mx-auto px-4 py-6 pb-24">
            {/* Cabeçalho */}
            <div className="mb-6">
                <Button variant="ghost" onClick={goBackToMenu} className="mb-2">
                    <ArrowLeft size={16} className="mr-1" /> Voltar ao Menu
                </Button>
                <h1 className="text-2xl font-bold">Seu Pedido</h1>
                {restaurant && (
                    <p className="text-gray-600">
                        {restaurant.name}
                        {tableNumber && ` - Mesa ${tableNumber}`}
                    </p>
                )}
            </div>

            {/* Lista de itens do carrinho */}
            <div className="space-y-4 mb-8">
                {cart.map((item) => {
                    const product = getProductById(item.productId);

                    // Se não encontrar o produto, não mostra o item
                    if (!product) return null;

                    return (
                        <Card key={item.productId}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                        >
                                            <Minus size={14} />
                                        </Button>

                                        <span className="w-8 text-center">{item.quantity}</span>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                        >
                                            <Plus size={14} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => handleRemoveItem(item.productId)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-2 text-right">
                                    <span className="font-medium">
                                        {formatCurrency(product.price * item.quantity)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Opções de atendimento */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Tipo de Pedido</h3>

                    <RadioGroup
                        value={orderType}
                        onValueChange={(value: string) => setOrderType(value as 'local' | 'takeaway')}
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="local" id="local" />
                            <Label htmlFor="local" className="font-medium">Consumir no local</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="takeaway" id="takeaway" />
                            <Label htmlFor="takeaway" className="font-medium">Para viagem</Label>
                        </div>
                    </RadioGroup>

                </CardContent>
            </Card>

            {/* Observações */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Observações</h3>
                    <Textarea
                        placeholder="Alguma observação para seu pedido? (Ex: sem cebola, sem alho, etc)"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        className="w-full"
                    />
                </CardContent>
            </Card>

            {/* Resumo do pedido */}
            <Card className="mb-8">
                <CardContent className="p-4">
                    <h3 className="font-medium mb-4">Resumo</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span>{formatCurrency(getCartTotal())}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botão de finalizar pedido */}
            <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center">
                <Button
                    onClick={handleCheckout}
                    className="w-full max-w-md py-6 h-12 text-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processando..." : `Finalizar Pedido • ${formatCurrency(getCartTotal())}`}
                </Button>
            </div>
        </div>
    );
}