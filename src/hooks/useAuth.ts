// hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface LoginCredentials {
    email: string;
    password: string;
}

interface GuestLoginCredentials {
    cpf: string;
    email: string;
}

interface LoginResponse {
    redirectRoute: string;
    sessionToken?: string;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }
}

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Credenciais inválidas');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Store the session token
            if (data.sessionToken) {
                localStorage.setItem('session', data.sessionToken);
            }

            // Redirect to the route specified by the API
            router.push(data.redirectRoute);
        },
    });
}

export function useGuestLogin() {
    const router = useRouter();

    return useMutation({
        mutationKey: ['guestLogin'],
        mutationFn: async (credentials: GuestLoginCredentials): Promise<LoginResponse> => {
            const response = await fetch(`${API_URL}/guest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erro no login de convidado');
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Store the session token
            if (data.sessionToken) {
                localStorage.setItem('session', data.sessionToken);
            }

            // Redirect to the route specified by the API
            router.push(data.redirectRoute);
        },
    });
}

export function useLogout() {
    const router = useRouter();

    return useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer logout');
            }

            return response.json();
        },
        onSuccess: () => {
            // Clear session storage
            localStorage.removeItem('session');

            // Redirect to login page
            router.push('/');
        },
    });
}