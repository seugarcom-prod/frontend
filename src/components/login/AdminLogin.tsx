"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore, useRestaurantStore } from '@/stores';

export function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setRestaurantId, setUserRole, setUserName } = useRestaurantStore();
    const { setToken, token } = useAuthStore(); // Adicionado para gerenciar o token

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Fazer login na API backend primeiro para obter os dados
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Credenciais inválidas');
                setIsLoading(false);
                return;
            }

            // 2. Fazer login no NextAuth
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error || 'Falha na autenticação');
                setIsLoading(false);
                return;
            }

            if (result?.status === 200) {
                // 3. Armazenar o token no Zustand
                const authToken = data.token; // Acesse o token retornado pela API
                if (authToken) {
                    useAuthStore.getState().setToken(authToken); // Armazena o token no Zustand
                } else {
                    console.error('Auth token is null');
                    setError('Token de autenticação não encontrado.');
                    setIsLoading(false);
                    return;
                }

                // 4. Configurar dados do usuário baseado na resposta
                if (data.user && data.user.restaurantId) {
                    // Caso usuário ADMIN
                    useAuthStore.getState().setRestaurantId(data.user.restaurantId); // Atualiza o estado no Zustand
                    useAuthStore.getState().setUserRole(data.user.role); // Atualiza o papel do usuário
                    // useAuthStore.getState().setUserName(data.user.firstName); // Atualiza o nome do usuário
                    router.push(`/restaurant/${data.user.restaurantId}/dashboard`);
                } else if (data.restaurant) {
                    // Caso login direto pelo restaurante
                    useAuthStore.getState().setRestaurantId(data.restaurant._id); // Atualiza o estado no Zustand
                    useAuthStore.getState().setUserRole('ADMIN'); // Define papel como ADMIN
                    // useAuthStore.getState().setUserName(data.restaurant.admin.fullName); // Atualiza o nome do admin
                    router.push(`/restaurant/${data.restaurant._id}/dashboard`);
                } else {
                    setError('Não foi possível obter os dados do restaurante');
                }
            } else {
                setError('Erro ao processar login. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao processar login:', error);
            setError('Erro ao conectar com o servidor. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Lado esquerdo - formulário */}
            <div className="w-full md:w-1/3 p-8 flex items-center justify-center bg-white">
                <div className="w-full max-w-md space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium block">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium block">Senha</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Link href="/recover-password" className="text-sm hover:underline">
                                Esqueceu sua senha?
                            </Link>
                            <Button
                                type="submit"
                                className="bg-black text-white hover:bg-gray-800"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-500">Não tem uma conta?</p>
                        <Link
                            href="/admin/register"
                            className="block mt-2 text-center text-sm py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 w-full"
                        >
                            Criar uma conta agora
                        </Link>
                    </div>
                </div>
            </div>

            {/* Lado direito - logo */}
            <div className="hidden md:flex md:w-2/3 bg-black items-center justify-center p-8 relative">
                <div className="text-center">
                    <Image
                        src="/Logo.svg"
                        alt="SR. GARÇOM"
                        width={400}
                        height={150}
                        className="mx-auto"
                    />
                </div>

                <div className="absolute bottom-4 text-center text-white text-xs px-8">
                    <p>
                        Ao entrar você concorda com os {' '}
                        <Link href="/termos" className="underline">
                            Termos de uso
                        </Link>
                        {' '}e as{' '}
                        <Link href="/privacidade" className="underline">
                            Política de privacidade
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}