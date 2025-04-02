'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}