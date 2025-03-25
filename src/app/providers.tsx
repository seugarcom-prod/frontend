// app/providers.tsx
'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}

// Como usar no layout.tsx principal:
// import { Providers } from './providers';
//
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="pt-BR">
//       <body>
//         <Providers>
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }