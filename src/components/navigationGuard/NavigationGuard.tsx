'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface RouteGuardProps {
    children: React.ReactNode;
}

// Mapeamento de rotas para permissões necessárias
const routePermissions: Record<string, string[]> = {
    '/dashboard': ['view_dashboard'],
    '/dashboard/users': ['manage_users'],
    '/dashboard/restaurants': ['manage_restaurants'],
    '/dashboard/orders': ['manage_orders', 'view_orders'],
    '/dashboard/reports': ['view_reports'],
    '/dashboard/settings': ['edit_settings'],
};

// Mapeamento de rotas para roles permitidas
const routeRoles: Record<string, string[]> = {
    '/admin': ['ADMIN'],
    '/dashboard/admin': ['ADMIN'],
    '/dashboard/manager': ['ADMIN', 'MANAGER'],
    '/dashboard/attendant': ['ADMIN', 'MANAGER', 'ATTENDANT'],
};

export default function NavigationGuard({ children }: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { auth, isLoading } = useAuth();
    const { hasPermission, hasRole } = usePermissions();

    useEffect(() => {
        // Ignorar durante o carregamento inicial
        if (isLoading) return;

        // Se não estiver autenticado e a rota não é pública
        if (!auth?.isAuthenticated && !isPublicRoute(pathname)) {
            router.push('/login');
            return;
        }

        // Verificar permissões baseadas em rota
        if (auth?.isAuthenticated && pathname) {
            // Verificar permissões para a rota exata
            const requiredPermissions = getRequiredPermissions(pathname);
            if (requiredPermissions.length > 0) {
                const hasAllPermissions = requiredPermissions.every(permission =>
                    hasPermission(permission)
                );

                if (!hasAllPermissions) {
                    router.push('/unauthorized');
                    return;
                }
            }

            // Verificar roles para a rota exata
            const allowedRoles = getAllowedRoles(pathname);
            if (allowedRoles.length > 0) {
                if (!hasRole(allowedRoles)) {
                    router.push('/unauthorized');
                    return;
                }
            }
        }
    }, [pathname, auth, isLoading, router, hasPermission, hasRole]);

    // Verificar se é uma rota pública
    const isPublicRoute = (path: string): boolean => {
        const publicRoutes = ['/', '/login', '/register', '/forgot-password'];

        // Verificar rotas exatas
        if (publicRoutes.includes(path)) return true;

        // Verificar rotas que começam com padrões públicos
        if (path.startsWith('/restaurant/') ||
            path.startsWith('/menu/') ||
            path.startsWith('/table/')) {
            return true;
        }

        return false;
    };

    // Obter permissões necessárias para uma rota
    const getRequiredPermissions = (path: string): string[] => {
        // Verificar correspondência exata
        if (routePermissions[path]) {
            return routePermissions[path];
        }

        // Verificar correspondência parcial (padrões de rota)
        for (const route in routePermissions) {
            if (path.startsWith(route)) {
                return routePermissions[route];
            }
        }

        return [];
    };

    // Obter roles permitidas para uma rota
    const getAllowedRoles = (path: string): string[] => {
        // Verificar correspondência exata
        if (routeRoles[path]) {
            return routeRoles[path];
        }

        // Verificar correspondência parcial (padrões de rota)
        for (const route in routeRoles) {
            if (path.startsWith(route)) {
                return routeRoles[route];
            }
        }

        return [];
    };

    // Mostrar tela de carregamento enquanto verifica autenticação
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
    }

    // Se todas as verificações passaram, renderizar o conteúdo
    return <>{children}</>;
}

// Uso no layout principal da aplicação:
//
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="pt-BR">
//       <body>
//         <Providers>
//           <NavigationGuard>
//             {children}
//           </NavigationGuard>
//         </Providers>
//       </body>
//     </html>
//   );
// }