'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, ShoppingCart, Minus, Plus, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import CartItem from "@/components/cart/CartItem";
import { createOrder, formatCurrency } from "@/services/restaurant/services";

// Definir interfaces necessárias caso não estejam disponíveis no projeto
interface CartItemType {
    productId: string;
    quantity: number;
}

interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    isAvailable: boolean;
    restaurant?: string;
    quantity?: number;
}

interface CartClientProps {
    restaurantId: string;
    restaurantName: string;
    products: IProduct[];
}

export default function CartClient({ restaurantId, restaurantName, products }: CartClientProps) {
    const router = useRouter();
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [observations, setObservations] = useState("");
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderType, setOrderType] = useState<'local' | 'takeaway'>('local');

    // Estado para controlar o diálogo de finalização
    const [showFinishDialog, setShowFinishDialog] = useState(false);
    const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

    // Estado para divisão de conta
    const [splitCount, setSplitCount] = useState(1);

    // Buscar carrinho e informações da mesa
    useEffect(() => {
        const loadCart = () => {
            try {
                // Buscar carrinho do localStorage - podemos usar restaurantId ou restaurantName como chave
                const savedCart = localStorage.getItem(`cart-${restaurantId}`);
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }

                // Buscar número da mesa - podemos usar restaurantId ou restaurantName como chave
                const savedTable = localStorage.getItem(`table-${restaurantId}`);
                if (savedTable) {
                    setTableNumber(savedTable);
                } else {
                    // Tentar com o nome do restaurante como fallback
                    const tableByName = localStorage.getItem(`table-${restaurantName}`);
                    if (tableByName) {
                        setTableNumber(tableByName);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar carrinho:", error);
                setError("Não foi possível carregar seu carrinho. Tente novamente.");
            }
        };

        loadCart();
    }, [restaurantId, restaurantName]);

    // Atualizar localStorage quando o carrinho mudar
    useEffect(() => {
        localStorage.setItem(`cart-${restaurantId}`, JSON.stringify(cart));
    }, [cart, restaurantId]);

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

    // Função para atualizar o número de pessoas para dividir a conta
    const handleSplitCountChange = (newCount: number) => {
        // Não permitir valores menores que 1
        if (newCount < 1) newCount = 1;
        setSplitCount(newCount);
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
    const serviceFee = orderType === 'local' ? subtotal * 0.10 : 0; // Taxa de serviço de 10% apenas para consumo local
    const total = subtotal + serviceFee;

    // Valor por pessoa quando a conta é dividida
    const totalPerPerson = splitCount > 1 ? total / splitCount : total;

    // Função para voltar ao cardápio
    const goBackToMenu = () => {
        router.push(`/restaurant/${restaurantId}/${restaurantName}/menu`);
    };

    // Função para enviar o pedido (sem finalizar a conta)
    const submitOrder = async () => {
        if (!tableNumber) {
            setError("Por favor, escaneie o QR code da mesa para fazer seu pedido.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Formatar itens para o pedido
            const orderItems = cartProducts.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            // Calcular valor total
            const totalAmount = total;

            // Preparar dados do pedido
            const orderData = {
                restaurantUnitId: restaurantId,
                // Se for um pedido de convidado (sem login)
                isGuest: true,
                guestInfo: {
                    name: `Mesa ${tableNumber}`,
                    // Se tiver mais informações, podem ser adicionadas aqui
                },
                items: orderItems,
                totalAmount,
                observations,
                orderType,
                tableNumber: parseInt(tableNumber),
                splitCount // Adicionando informação de divisão da conta
            };

            // Enviar pedido para a API
            const response = await createOrder(restaurantId, orderData);

            // Limpar carrinho após enviar com sucesso
            localStorage.removeItem(`cart-${restaurantId}`);
            setCart([]);

            // Indicar sucesso e manter as observações limpas para o próximo pedido
            setObservations("");
            setIsSubmitting(false);
            setSubmissionSuccess(true);

            // Após 3 segundos, redirecionar para o cardápio
            setTimeout(() => {
                setSubmissionSuccess(false);
                router.push(`/restaurant/${restaurantId}/${restaurantName}/menu`);
            }, 3000);
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            setIsSubmitting(false);
            setError("Ocorreu um erro ao enviar seu pedido. Por favor, tente novamente.");
        }
    };

    // Função para finalizar a conta (chamar atendente/manager)
    const finalizeOrder = async () => {
        if (!tableNumber) {
            setError("Não foi possível identificar sua mesa.");
            return;
        }

        setIsFinalizingOrder(true);

        try {
            // Aqui você pode implementar a chamada à API para finalizar o pedido
            // Por exemplo, mudando o status de todos os pedidos da mesa para "pending_payment"

            // Simulando uma chamada de API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Fechar diálogo
            setShowFinishDialog(false);

            // Limpar carrinho e redirecionar para página de agradecimento
            localStorage.removeItem(`cart-${restaurantId}`);
            setCart([]);

            // Redirecionar para página de confirmação incluindo informação de divisão
            router.push(`/restaurant/${restaurantId}/${restaurantName}/payment-requested?table=${tableNumber}&split=${splitCount}`);
        } catch (error) {
            console.error("Erro ao finalizar conta:", error);
            setError("Ocorreu um erro ao solicitar o fechamento. Por favor, chame um atendente.");
        } finally {
            setIsFinalizingOrder(false);
        }
    };

    // Se não houver itens no carrinho e não estiver em estado de sucesso, voltar ao menu
    useEffect(() => {
        if (cart.length === 0 && !submissionSuccess && !isSubmitting) {
            router.push(`/restaurant/${restaurantId}/${restaurantName}/menu`);
        }
    }, [cart, submissionSuccess, isSubmitting, router, restaurantId, restaurantName]);

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
                    <p className="text-gray-500 mb-4">{orderType === 'local' ? 'Um atendente trará seu pedido em breve.' : 'Seu pedido para viagem estará pronto em breve.'}</p>
                    <p className="text-sm text-gray-400">Você pode fazer mais pedidos a qualquer momento!</p>
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
            <div className="space-y-2 mb-6">
                {cartProducts.length > 0 ? (
                    cartProducts.map((item) => (
                        <CartItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            imageUrl={item.image || "/api/placeholder/400/320"}
                            price={item.price}
                            quantity={item.quantity || 0}
                            onQuantityChange={handleQuantityChange}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="mx-auto mb-3 text-gray-300" size={40} />
                        <p>Seu carrinho está vazio</p>
                        <Button
                            variant="link"
                            onClick={goBackToMenu}
                            className="mt-2"
                        >
                            Adicionar itens
                        </Button>
                    </div>
                )}
            </div>

            {cartProducts.length > 0 && (
                <>
                    {/* Tipo de pedido */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                        <h3 className="font-medium text-primary mb-3">Tipo de Pedido</h3>
                        <RadioGroup
                            value={orderType}
                            onValueChange={(value) => setOrderType(value as 'local' | 'takeaway')}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="local" id="local" />
                                <Label htmlFor="local" className="cursor-pointer">Consumir no local</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="takeaway" id="takeaway" />
                                <Label htmlFor="takeaway" className="cursor-pointer">Para viagem</Label>
                            </div>
                        </RadioGroup>

                        {orderType === 'local' && (
                            <div className="mt-2 text-xs text-gray-500">
                                Taxa de serviço de 10% será aplicada para consumo no local.
                            </div>
                        )}
                    </div>

                    {/* Campo de divisão de conta */}
                    {orderType === 'local' && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                            <h3 className="font-medium text-primary mb-3 flex items-center">
                                <Users size={18} className="mr-2" />
                                Dividir a conta
                            </h3>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Número de pessoas:</span>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleSplitCountChange(splitCount - 1)}
                                        disabled={splitCount <= 1}
                                    >
                                        <Minus size={14} />
                                    </Button>

                                    <span className="w-8 text-center font-medium">{splitCount}</span>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleSplitCountChange(splitCount + 1)}
                                    >
                                        <Plus size={14} />
                                    </Button>
                                </div>
                            </div>

                            {splitCount > 1 && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Cada pessoa pagará aproximadamente {formatCurrency(totalPerPerson)}.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Campo de observações */}
                    <div className="mb-6">
                        <h3 className="font-medium text-primary mb-2">Observações</h3>
                        <Textarea
                            placeholder="Alguma observação sobre seu pedido? (Ex: sem cebola, ponto da carne, etc)"
                            className="border-gray-200"
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                        />
                    </div>

                    {/* Resumo do pedido */}
                    <div className="border-t border-gray-200 pt-4 mb-24">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-primary">{formatCurrency(subtotal)}</span>
                        </div>

                        {orderType === 'local' && (
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Taxa de serviço (10%)</span>
                                <span className="text-primary">{formatCurrency(serviceFee)}</span>
                            </div>
                        )}

                        <div className="flex justify-between font-medium text-lg mt-4">
                            <span className="text-primary">
                                {splitCount > 1 ? `Total (por pessoa)` : `Total`}
                            </span>
                            <span className="text-primary">
                                {splitCount > 1
                                    ? `${formatCurrency(totalPerPerson)} × ${splitCount}`
                                    : formatCurrency(total)}
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* Botões de ação - fixos na parte inferior */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 gap-2">
                {cartProducts.length > 0 && (
                    <>
                        {orderType === 'local' && (
                            <Button
                                onClick={() => setShowFinishDialog(true)}
                                variant="outline"
                                className="px-4 py-3 rounded-full shadow-sm w-2/5"
                            >
                                Pedir a conta
                            </Button>
                        )}

                        <Button
                            onClick={submitOrder}
                            disabled={isSubmitting || cartProducts.length === 0 || !tableNumber}
                            variant="default"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-secondary shadow-lg flex-1"
                        >
                            {isSubmitting ? (
                                "Enviando..."
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>{orderType === 'local' ? 'Fazer pedido' : 'Finalizar'} • {formatCurrency(splitCount > 1 ? totalPerPerson : total)}</span>
                                </>
                            )}
                        </Button>
                    </>
                )}

                {cartProducts.length === 0 && !submissionSuccess && (
                    <Button
                        onClick={goBackToMenu}
                        variant="default"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-secondary shadow-lg w-full max-w-md"
                    >
                        Voltar ao cardápio
                    </Button>
                )}
            </div>

            {/* Diálogo de confirmação para finalizar a conta */}
            <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Finalizar pedido?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ao solicitar o fechamento da conta, um atendente virá até sua mesa para o pagamento.
                            {cartProducts.length > 0 && (
                                <p className="mt-2 text-sm">
                                    Você ainda tem itens no carrinho. Deseja enviá-los antes de finalizar?
                                </p>
                            )}
                            {splitCount > 1 && (
                                <p className="mt-2 text-sm font-medium">
                                    A conta será dividida entre {splitCount} pessoas ({formatCurrency(totalPerPerson)} cada).
                                </p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isFinalizingOrder}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={finalizeOrder}
                            disabled={isFinalizingOrder}
                            className="bg-primary text-white hover:bg-primary/90"
                        >
                            {isFinalizingOrder ? "Solicitando..." : "Solicitar conta"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}