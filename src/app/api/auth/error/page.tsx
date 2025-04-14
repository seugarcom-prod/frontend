'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            switch (errorParam) {
                case 'CredentialsSignin':
                    setError('Email ou senha inválidos');
                    break;
                case 'SessionRequired':
                    setError('Login necessário para acessar esta página');
                    break;
                default:
                    setError(`Erro de autenticação: ${errorParam}`);
                    break;
            }
        } else {
            setError('Ocorreu um erro durante a autenticação');
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de autenticação</h1>
                <p className="text-gray-700 mb-6">{error}</p>
                <Link
                    href="/login"
                    className="block w-full py-2 px-4 text-center bg-black text-white rounded hover:bg-gray-800"
                >
                    Voltar para o login
                </Link>
            </div>
        </div>
    );
}