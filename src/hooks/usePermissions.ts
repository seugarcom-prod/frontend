// hooks/usePermissions.ts
import { useAuth } from './useAuth';

// Mapeamento de permissões por role
const rolePermissions = {
    'ADMIN': [
        'view_dashboard',
        'manage_users',
        'manage_restaurants',
        'manage_products',
        'manage_orders',
        'view_reports',
        'edit_settings',
        'delete_data'
    ],
    'MANAGER': [
        'view_dashboard',
        'manage_restaurant_units',
        'manage_products',
        'manage_orders',
        'view_reports',
        'edit_unit_settings'
    ],
    'ATTENDANT': [
        'view_orders',
        'update_order_status',
        'view_products'
    ],
    'CLIENT': [
        'place_orders',
        'view_own_orders',
        'edit_profile'
    ]
};

// Hook para verificar permissões
export function usePermissions() {
    const { auth } = useAuth();

    // Verificar se o usuário tem uma permissão específica
    const hasPermission = (permission: string): boolean => {
        // Se não estiver autenticado, não tem permissão
        if (!auth?.isAuthenticated || !auth.user) {
            return false;
        }

        // Role do usuário
        const userRole = auth.user.role;
        if (!userRole) {
            return false;
        }

        // Verificar se a role tem a permissão
        return rolePermissions[userRole as keyof typeof rolePermissions]?.includes(permission) || false;
    };

    // Verificar se o usuário tem uma role específica
    const hasRole = (roles: string[]): boolean => {
        if (!auth?.isAuthenticated || !auth.user || !auth.user.role) {
            return false;
        }

        return roles.includes(auth.user.role);
    };

    // Verificar se o usuário é dono do recurso
    const isOwner = (resourceUserId: string | undefined): boolean => {
        if (!auth?.isAuthenticated || !auth.user || !auth.user._id) {
            return false;
        }

        return auth.user._id === resourceUserId;
    };

    // Verificar se o usuário é administrador
    const isAdmin = (): boolean => {
        if (!auth?.isAuthenticated || !auth.user || !auth.user.role) {
            return false;
        }

        return auth.user.role === 'ADMIN';
    };

    // Verificar se o usuário é gerente
    const isManager = (): boolean => {
        if (!auth?.isAuthenticated || !auth.user || !auth.user.role) {
            return false;
        }

        return auth.user.role === 'MANAGER' || auth.user.role === 'ADMIN';
    };

    // Verificar se o usuário é atendente ou superior
    const isAttendantOrHigher = (): boolean => {
        if (!auth?.isAuthenticated || !auth.user || !auth.user.role) {
            return false;
        }

        return ['ATTENDANT', 'MANAGER', 'ADMIN'].includes(auth.user.role);
    };

    return {
        hasPermission,
        hasRole,
        isOwner,
        isAdmin,
        isManager,
        isAttendantOrHigher
    };
}