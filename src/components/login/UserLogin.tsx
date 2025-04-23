"use client"

import { useState } from 'react';
import { useAuthCheck } from '@/hooks/sessionManager';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface UserLoginProps {
    onLoginSuccess?: () => void;
}

export function UserLogin({ onLoginSuccess }: UserLoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthCheck();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('UserLogin - Enviando formulário de login:', email);

        try {
            // Usar o método login do hook useAuthCheck
            const result = await login(email, password);

            if (result && result.success) {
                console.log('Login de usuário bem-sucedido');
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            }
        } catch (err) {
            console.error('UserLogin - Erro tratado no componente:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error || 'Falha ao fazer login. Por favor, verifique suas credenciais.'}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <a
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Esqueceu a senha?
                    </a>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                    </>
                ) : (
                    'Entrar'
                )}
            </Button>
        </form>
    );
}