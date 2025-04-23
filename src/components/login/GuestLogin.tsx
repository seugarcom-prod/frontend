// components/login/GuestLogin.tsx
"use client"

import { useState } from 'react';
import { useAuthCheck } from '@/hooks/sessionManager';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface GuestLoginProps {
    onLoginSuccess?: () => void;
}

export function GuestLogin({ onLoginSuccess }: GuestLoginProps) {
    const [name, setName] = useState('');
    const { authenticateAsGuest, isLoading, error } = useAuthCheck();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('GuestLogin - Enviando formulário de login como convidado:', { name });

        try {
            // Verificar se há informações de mesa armazenadas
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));

            if (!tableKey) {
                throw new Error('Informações da mesa não encontradas. Por favor, escaneie o QR Code novamente.');
            }

            // Extrair restaurantName e tableId
            const restaurantName = tableKey.replace('table-', '');
            const tableId = localStorage.getItem(tableKey);

            if (!tableId) {
                throw new Error('Número da mesa não encontrado. Por favor, escaneie o QR Code novamente.');
            }

            // Usar o novo método authenticateAsGuest
            const result = await authenticateAsGuest(tableId, '', restaurantName);

            if (result.success) {
                console.log('Login como convidado bem-sucedido');

                // Armazenar o nome do convidado para uso posterior
                localStorage.setItem('guest_name', name);

                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            }
        } catch (err: any) {
            console.error('GuestLogin - Erro tratado no componente:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error || 'Falha ao fazer login como convidado. Por favor, verifique suas informações.'}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    'Continuar como convidado'
                )}
            </Button>

            <p className="text-xs text-gray-500 mt-2">
                Usaremos seu nome apenas para identificação durante sua visita.
            </p>
        </form>
    );
}