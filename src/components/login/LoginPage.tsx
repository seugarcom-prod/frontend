'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserLogin } from '@/components/login/UserLogin';
import { GuestLogin } from '@/components/login/GuestLogin';
import { useSaveTableInfo } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const saveTableInfo = useSaveTableInfo();

    // Obter parâmetros da URL
    const restaurantId = searchParams.get('restaurantId');
    const tableId = searchParams.get('tableId');

    // Usar um efeito para salvar informações quando os parâmetros estiverem disponíveis
    useEffect(() => {
        if (restaurantId && tableId) {
            saveTableInfo(restaurantId, tableId);
        }
    }, [restaurantId, tableId, saveTableInfo]);

    // Função para continuar como convidado sem login
    const continueWithoutLogin = () => {
        if (restaurantId) {
            // Criar um token de convidado genérico
            const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem('guest_token', guestToken);
            localStorage.setItem('guest_data', JSON.stringify({
                firstName: `Mesa ${tableId || 'Desconhecida'}`,
                isGuest: true
            }));

            // Redirecionar para o menu
            router.push(`/restaurant/${restaurantId}/menu`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-secondary">
            {/* Lado esquerdo - formulário de login */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6">Bem-vindo</h1>

                    {/* Mostrar informações da mesa se vier de um QR code */}
                    {restaurantId && tableId && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm">
                                <span className="font-medium">Restaurante ID:</span> {restaurantId}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Mesa:</span> {tableId}
                            </p>
                        </div>
                    )}

                    <Tabs defaultValue="user" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="user">Usuário</TabsTrigger>
                            <TabsTrigger value="guest">Convidado</TabsTrigger>
                        </TabsList>

                        <TabsContent value="user">
                            <UserLogin />
                        </TabsContent>

                        <TabsContent value="guest">
                            <GuestLogin />
                        </TabsContent>
                    </Tabs>

                    {/* Botão para continuar sem login se veio do QR code */}
                    {restaurantId && tableId && (
                        <div className="mt-6">
                            <button
                                onClick={continueWithoutLogin}
                                className="w-full py-2 text-gray-600 text-sm underline hover:text-gray-900"
                            >
                                Continuar sem login
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            Não tem uma conta?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Lado direito - imagem ou logo */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="h-full flex flex-col items-center justify-center text-white p-8">
                    <h2 className="text-3xl font-bold mb-4">Sr. Garçom</h2>
                    <p className="text-xl max-w-md text-center">
                        Faça seus pedidos de forma rápida e prática, sem complicações!
                    </p>
                </div>
            </div>
        </div>
    );
}