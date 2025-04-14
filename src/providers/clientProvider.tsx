'use client';

import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Providers } from "@/providers/queryProvider";
import { ToastProvider } from "@/components/toast/toastContext";

export function ClientProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    // Evita rendering no servidor
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Durante o SSR e antes da hidratação, renderize apenas um espaço reservado
    // Isso evita discrepâncias de hidratação
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <SessionProvider>
            <Providers>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </Providers>
        </SessionProvider>
    );
}