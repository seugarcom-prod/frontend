"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import CartItem from "./CartItem";

// Tipo para representar um produto
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

// Tipo para representar um item no carrinho
interface CartItem {
    productId: string;
    quantity: number;
}

export default function CartPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tableNumber = searchParams.get('table') || "desconhecida";
    const cartParam = searchParams.get('cart') || "[]";

    const [cart, setCart] = useState<CartItem[]>([]);
    const [observations, setObservations] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Dados de exemplo - em uma aplicação real, você buscaria isso do backend
    const products: Product[] = [
        {
            id: "1",
            name: "X-Tudo",
            description: "Hambúrguer artesanal, queijo cheddar, bacon, alface, tomate, cebola caramelizada e molho especial da casa.",
            price: 29.90,
            imageUrl: "/api/placeholder/400/320",
            category: "Hambúrgueres"
        },
        {
            id: "2",
            name: "Batata Frita com Cheddar e Bacon",
            description: "Porção de batatas fritas crocantes cobertas com cheddar cremoso e bacon crocante.",
            price: 19.90,
            imageUrl: "/api/placeholder/400/320",
            category: "Acompanhamentos"
        },
        {
            id: "3",
            name: "Coca-Cola 350ml",
            description: "Lata de Coca-Cola gelada.",
            price: 6.50,
            imageUrl: "/api/placeholder/400/320",
            category: "Bebidas"
        },
        {
            id: "4",
            name: "Cheesecake de Frutas Vermelhas",
            description: "Delicioso cheesecake com cobertura de frutas vermelhas frescas.",
            price: 15.90,
            imageUrl: "/api/placeholder/400/320",
            category: "Sobremesas"
        }
    ];

    // Parse do parâmetro do carrinho quando a página é carregada
    useEffect(() => {
        try {
            const parsedCart = JSON.parse(decodeURIComponent(cartParam));
            if (Array.isArray(parsedCart)) {
                setCart(parsedCart);
            }
        } catch (error) {
            console.error("Erro ao analisar os dados do carrinho:", error);
        }
    }, [cartParam]);

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
        const product = products.find(p => p.id === item.productId);
        return {
            ...product,
            quantity: item.quantity
        };
    }).filter(item => item !== undefined) as (Product & { quantity: number })[];

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
        router.push(`/menu?table=${tableNumber}`);
    };

    // Função para enviar o pedido
    const submitOrder = () => {
        setIsSubmitting(true);

        // Simulando envio para API
        setTimeout(() => {
            // Dados que seriam enviados para a API
            const orderData = {
                tableNumber,
                items: cartProducts.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price
                })),
                observations,
                subtotal,
                serviceFee,
                total,
                timestamp: new Date().toISOString()
            };

            console.log("Pedido enviado:", orderData);

            setIsSubmitting(false);
            setSubmissionSuccess(true);

            // Após 3 segundos, retorna ao cardápio
            setTimeout(() => {
                router.push(`/menu?table=${tableNumber}`);
            }, 3000);
        }, 2000);
    };

    // Se não houver itens no carrinho e não estiver em estado de sucesso, voltar ao menu
    useEffect(() => {
        if (cart.length === 0 && !submissionSuccess) {
            router.push(`/menu?table=${tableNumber}`);
        }
    }, [cart, submissionSuccess]);

    if (submissionSuccess) {
        return (
            <div className="container mx-auto px-4 py-10 max-w-2xl flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                            <Send size={24} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">Pedido enviado com sucesso!</h1>
                    <p className="text-gray-500 mb-6">Seu pedido foi recebido e está sendo preparado.</p>
                    <p className="text-primary font-medium mb-2">Mesa {tableNumber}</p>
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

            <div className="mb-6">
                <p className="text-gray-500 text-sm mb-2">Mesa {tableNumber}</p>
            </div>

            {/* Lista de itens no carrinho */}
            <div className="space-y-2">
                {cartProducts.map((item) => (
                    <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        imageUrl={item.imageUrl}
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
                    onChange={(e: any) => setObservations(e.target.value)}
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
                    disabled={isSubmitting || cart.length === 0}
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