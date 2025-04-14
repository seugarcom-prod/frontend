'use client';

import { useEffect, useState } from 'react';
import { AdminLogin } from '@/components/login/AdminLogin';
import { useAuthCheck } from '@/hooks/sessionManager';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { isAuthenticated, isAdminOrManager, isLoading, session } = useAuthCheck();
    const [checkingRedirect, setCheckingRedirect] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Verificar autenticação após carregar completamente
        const timer = setTimeout(() => {
            if (isAuthenticated && isAdminOrManager && session?.user?.restaurantId) {
                // Redirecionamento se estiver autenticado como admin/manager
                router.push(`/restaurant/${session.user.restaurantId}/dashboard`);
            } else {
                // Finalizado a verificação, pode mostrar o login
                setCheckingRedirect(false);
            }
        }, 800); // Delay para evitar redirecionamentos prematuros

        return () => clearTimeout(timer);
    }, [isAuthenticated, isAdminOrManager, session, router]);

    // Mostrar loader durante verificação inicial
    if (isLoading || checkingRedirect) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Mostrar o componente de login
    return <AdminLogin />;
}