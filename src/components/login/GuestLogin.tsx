// components/login/GuestLogin.tsx
"use client"

import { useState } from 'react';
import { useGuestLogin } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { formatCpf } from '@/utils';

interface GuestLoginProps {
    onLoginSuccess?: () => void;
}

export function GuestLogin({ onLoginSuccess }: GuestLoginProps) {
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const { mutate, isPending, error } = useGuestLogin();

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCpf(e.target.value);
        setCpf(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('GuestLogin - Enviando formulário de login como convidado:', { cpf, email });

        try {
            // Verificar se há informações de mesa armazenadas
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));

            if (!tableKey) {
                throw new Error('Informações da mesa não encontradas. Por favor, escaneie o QR Code novamente.');
            }

            await mutate(
                { cpf, email },
                {
                    onSuccess: () => {
                        console.log('Login como convidado bem-sucedido');
                        if (onLoginSuccess) {
                            onLoginSuccess();
                        }
                    }
                }
            );
        } catch (err) {
            // O erro já está sendo capturado pelo useGuestLogin hook
            console.error('GuestLogin - Erro tratado no componente:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error.message || 'Falha ao fazer login como convidado. Por favor, verifique suas informações.'}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    required
                />
            </div>

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

            <Button
                type="submit"
                className="w-full"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                    </>
                ) : (
                    'Continuar como convidado'
                )}
            </Button>

            <p className="text-xs text-gray-500 mt-2">
                Usaremos seu CPF e email apenas para identificação durante sua visita.
            </p>
        </form>
    );
}