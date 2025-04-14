'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/toast/toastContext';
import SessionManager from '@/hooks/sessionManager';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <html>
            <body>
                <SessionProvider>
                    <SessionManager>
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </SessionManager>
                </SessionProvider>
            </body>
        </html>
    );
}