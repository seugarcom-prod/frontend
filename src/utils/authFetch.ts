// src/utils/fetchUtils.ts
import { useAuthStore } from '@/stores/index';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export interface FetchOptions extends RequestInit {
    requireAuth?: boolean;
    timeout?: number;
}

/**
 * Função de fetch aprimorada que gerencia tokens, timeouts e erros
 */
export async function fetchApi<T = any>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { requireAuth = true, timeout = 10000, ...fetchOptions } = options;

    // Usar cabeçalhos padrão ou os fornecidos
    const headers = useAuthStore.getState().getHeaders();

    // Permitir que os cabeçalhos sejam substituídos se fornecidos nas opções
    const mergedHeaders = {
        ...headers,
        ...(fetchOptions.headers || {}),
    };

    // Configurar o controlador de aborto para o timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        const response = await fetch(url, {
            ...fetchOptions,
            headers: mergedHeaders,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Processar erros comuns
        if (response.status === 401) {
            // Token expirado ou inválido
            console.error('Token de autenticação expirado ou inválido');

            // Se for client-side, podemos redirecionar para login
            if (typeof window !== 'undefined') {
                // Opcional: limpar o store e redirecionar para login
                useAuthStore.getState().clear();
                window.location.href = '/login';
            }

            throw new Error('Token inválido ou expirado');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
        }

        // Para respostas sem conteúdo
        if (response.status === 204) {
            return {} as T;
        }

        // Processar resposta normal
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`A requisição excedeu o tempo limite de ${timeout}ms`);
            }
            throw error;
        }

        throw new Error('Erro desconhecido na requisição');
    }
}

/**
 * Hook personalizado para componentes que precisam fazer solicitações autenticadas
 */
export function useApiClient() {
    return {
        get: <T = any>(endpoint: string, options?: Omit<FetchOptions, 'method'>) =>
            fetchApi<T>(endpoint, { ...options, method: 'GET' }),

        post: <T = any>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) =>
            fetchApi<T>(endpoint, {
                ...options,
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined
            }),

        put: <T = any>(endpoint: string, data?: any, options?: Omit<FetchOptions, 'method' | 'body'>) =>
            fetchApi<T>(endpoint, {
                ...options,
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined
            }),

        delete: <T = any>(endpoint: string, options?: Omit<FetchOptions, 'method'>) =>
            fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
    };
}