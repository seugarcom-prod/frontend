'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

export function AdminLogin() {
    const router = useRouter();
    const { toast } = useToast();
    const { adminLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Em AdminLogin.tsx
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Usar a função adminLogin do hook useAuth
            const result = await adminLogin(formData.email, formData.password);

            toast({
                title: 'Login realizado com sucesso',
                description: 'Você será redirecionado para o painel administrativo'
            });

            router.push('/admin');
        } catch (error: any) {
            console.error('Erro no login:', error);
            setError(error.message || 'Ocorreu um erro ao tentar fazer login. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-full md:w-1/3 p-8 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Digite seu e-mail"
                                className="w-full"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Digite sua senha"
                                className="w-full"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-between items-center">
                            <Link
                                href="/recover-password"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Esqueceu sua senha?
                            </Link>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    <>
                                        Entrar <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-sm text-gray-500">Não tem uma conta?</p>
                        <Link
                            href="/restaurant/register"
                            className="block mt-2 text-sm py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Criar uma conta para meu restaurante
                        </Link>
                    </div>
                </div>
            </div>

            {/* Logo e imagem de fundo */}
            <div className="hidden md:flex md:w-2/3 bg-black items-center justify-center p-8">
                <div className="text-center">
                    <Image
                        src="/Logo.svg"
                        alt="Sr. Garçom"
                        width={300}
                        height={100}
                        style={{ margin: '0 auto' }}
                    />

                    <div className="mt-8 text-xs text-white">
                        <p>
                            Ao entrar você concorda com os{' '}
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
        </div>
    );
}