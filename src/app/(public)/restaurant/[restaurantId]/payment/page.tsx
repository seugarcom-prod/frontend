'use client';

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Home } from "lucide-react";

export default function PaymentPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const restaurantId = params.restaurantId as string;
    const restaurantName = params.restaurantName as string;
    const tableNumber = searchParams.get('table');
    const splitCount = searchParams.get('split') ? parseInt(searchParams.get('split')!) : 1;
    const router = useRouter();

    // Formatar o nome do restaurante para exibição
    const formattedRestaurantName = restaurantName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Redirecionar para o menu
    const goToMenu = () => {
        router.push(`/restaurant/${restaurantId}/${restaurantName}/menu`);
    };

    // Voltar para a página inicial
    const goToHomepage = () => {
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center">
                <div className="inline-block p-5 bg-primary/10 rounded-full mb-6">
                    <CreditCard size={40} className="text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-primary mb-3">
                    Pagamento solicitado
                </h1>

                <p className="text-gray-600 mb-2">
                    {tableNumber ? `Um atendente virá até a mesa ${tableNumber} em breve para processar seu pagamento.` : 'Um atendente virá em breve para processar seu pagamento.'}
                </p>

                {splitCount > 1 && (
                    <p className="text-gray-600 mb-2">
                        A conta será dividida entre {splitCount} pessoas conforme solicitado.
                    </p>
                )}

                <p className="text-gray-500 mb-8 text-sm">
                    Agradecemos sua preferência{formattedRestaurantName ? ` no ${formattedRestaurantName}` : ''}!
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={goToMenu}
                        variant="outline"
                        className="w-full py-6"
                    >
                        Voltar ao menu
                    </Button>

                    <Button
                        onClick={goToHomepage}
                        variant="default"
                        className="w-full py-6 flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        <span>Página inicial</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}