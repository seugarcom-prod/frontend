import { ReactNode } from 'react';

// Layout específico para o login
export default function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}