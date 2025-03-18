'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import { getRestaurantProducts, createOrder } from "@/services/restaurant/services";
import { CartItem as CartItemType, IProduct } from "@/services/restaurant/types";

interface CartClientProps {
    restaurantName: string;
    restaurantId: string;
}

export default function CartClient({ restaurantName, restaurantId }: CartClientProps) {
    const router = useRouter();
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [observations, setObservations] = useState("");
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Buscar produtos e carrinho
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar produtos do restaurante
                const productsData = await getRestaurantProducts(restaurantId);
                setProducts(productsData);

                // Buscar carrinho do localStorage
                const savedCart = localStorage.getItem(`cart-${restaurantName}`);
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }

                // Buscar número da mesa
                const savedTable = localStorage.getItem(`table-${restaurantName}`);
                if (savedTable) {
                    setTableNumber(savedTable);
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
            }
        };

        fetchData();
    }, [restaurantId, restaurantName]);

    // Atualizar localStorage quando o carrinho mudar
    useEffect(() => {
        localStorage.setItem(`cart-${restaurantName}`, JSON.stringify(cart));
    }, [cart, restaurantName]);

    // Função para atualizar a quantidade de um produto no carrinho
    const handleQuantityChange = (productId: string, quantity: number) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.productId === productId);

            if (existingItemIndex >= 0) {
                const updatedCart = [...prevCart];
                if (quantity === 0) {
                    updatedCart.splice(existingItemIndex, 1);
                } else {
                    updatedCart[existingItemIndex].quantity = quantity;
                }
                return updatedCart;
            }

            return prevCart;
        });
    };

    // Produtos do carrinho com detalhes
    const cartProducts = cart.map(item => {
        const product = products.find(p => p._id === item.productId);
        return product ? {
            ...product,
            quantity: item.quantity
        } : null;
    }).filter((item): item is (IProduct & { quantity: number }) => item !== null);

    // Calculando o valor total
    const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = subtotal * 0.10; // Taxa de serviço de 10%
    const total = subtotal + serviceFee;

    // Formatando valores para moeda brasileira
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Função para voltar ao cardápio
    const goBackToMenu = () => {
        router.push(`/${restaurantName}/menu`);
    };

    // Função para enviar o pedido
    const submitOrder = async () => {
        if (!tableNumber) {
            setError("Por favor, escaneie o QR code da mesa para fazer seu pedido.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Preparar dados do pedido
            const orderData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                table: parseInt(tableNumber),
                observations
            };

            // Enviar pedido
            await createOrder(restaurantId, orderData);

            // Limpar carrinho
            localStorage.removeItem(`cart-${restaurantName}`);
            setCart([]);

            setIsSubmitting(false);
            setSubmissionSuccess(true);

            // Após 3 segundos, retorna ao cardápio
            setTimeout(() => {
                router.push(`/${restaurantName}/menu`);
            }, 3000);
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            setIsSubmitting(false);
            setError("Ocorreu um erro ao enviar seu pedido. Por favor, tente novamente.");
        }
    };

    // Se não houver itens no carrinho e não estiver em estado de sucesso, voltar ao menu
    useEffect(() => {
        if (cart.length === 0 && !submissionSuccess && !isSubmitting) {
            router.push(`/${restaurantName}/menu`);
        }
    }, [cart, submissionSuccess, isSubmitting, router, restaurantName]);

    if (submissionSuccess) {
        return (
            <div className="container mx-auto px-4 py-10 max-w-2xl flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                            <Send size={24} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">Pedido enviado com sucesso!</h1>
                    <p className="text-gray-500 mb-6">Seu pedido foi recebido e está sendo preparado.</p>
                    {tableNumber && (
                        <p className="text-primary font-medium mb-2">Mesa {tableNumber}</p>
                    )}
                    <p className="text-gray-500">Em breve um atendente trará seu pedido.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl pb-32">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={goBackToMenu}
                >
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold text-primary">Seu pedido</h1>
            </div>

            {tableNumber && (
                <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-2">Mesa {tableNumber}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            {/* Lista de itens no carrinho */}
            <div className="space-y-2">
                {cartProducts.map((item) => (
                    <CartItem
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        imageUrl={item.image || "/api/placeholder/400/320"}
                        price={item.price}
                        quantity={item.quantity}
                        onQuantityChange={handleQuantityChange}
                    />
                ))}
            </div>

            {/* Campo de observações */}
            <div className="mt-6">
                <h3 className="font-medium text-primary mb-2">Observações</h3>
                <Textarea
                    placeholder="Alguma observação sobre seu pedido? (Ex: sem cebola, ponto da carne, etc)"
                    className="border-border"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                />
            </div>

            {/* Resumo do pedido */}
            <div className="mt-8 border-t border-border pt-4">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-primary">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Taxa de serviço (10%)</span>
                    <span className="text-primary">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-4">
                    <span className="text-primary">Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                </div>
            </div>

            {/* Botão de enviar pedido - fixo na parte inferior */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center">
                <Button
                    onClick={submitOrder}
                    disabled={isSubmitting || cartProducts.length === 0 || !tableNumber}
                    variant="default"
                    className="flex items-center gap-2 px-6 py-4 rounded-full bg-primary text-secondary shadow-lg w-full max-w-md"
                >
                    {isSubmitting ? (
                        "Enviando pedido..."
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Enviar pedido • {formatCurrency(total)}</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}