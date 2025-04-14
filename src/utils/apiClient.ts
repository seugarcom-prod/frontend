// src/utils/apiClient.ts
import { useAuthStore } from '@/stores/index';
import { signOut, getSession } from 'next-auth/react';

interface FetchOptions extends RequestInit {
    disableRetry?: boolean;
}

// Singleton para manter um cache do token
class TokenCache {
    private static instance: TokenCache;
    private tokenPromise: Promise<string | null> | null = null;
    private tokenTimestamp: number = 0;
    private readonly TOKEN_TTL = 60000; // 1 minuto em ms

    private constructor() { }

    public static getInstance(): TokenCache {
        if (!TokenCache.instance) {
            TokenCache.instance = new TokenCache();
        }
        return TokenCache.instance;
    }

    // Método para obter o token mais atual, com cache para evitar chamadas repetidas
    public async getToken(): Promise<string | null> {
        const now = Date.now();

        // Se já temos um token fresco, use-o
        if (this.tokenPromise && (now - this.tokenTimestamp) < this.TOKEN_TTL) {
            return this.tokenPromise;
        }

        // Caso contrário, obtenha um novo token
        this.tokenTimestamp = now;
        this.tokenPromise = this.fetchToken();
        return this.tokenPromise;
    }

    private async fetchToken(): Promise<string | null> {
        // Primeiro, verificar o Zustand store
        const storeToken = useAuthStore.getState().token;
        if (storeToken) {
            console.log("Usando token do AuthStore");
            return storeToken;
        }

        // Se não encontrar no store, buscar da sessão
        try {
            const session = await getSession();
            if (session?.token) {
                console.log("Usando token da sessão NextAuth");
                useAuthStore.getState().setToken(session.token);
                return session.token;
            }
        } catch (error) {
            console.error("Erro ao buscar sessão:", error);
        }

        console.log("Nenhum token encontrado");
        return null;
    }

    // Método para invalidar o cache de token (útil após logout ou erros de autorização)
    public invalidateToken(): void {
        this.tokenPromise = null;
        this.tokenTimestamp = 0;
    }
}

export const tokenCache = TokenCache.getInstance();

/**
 * Função para fazer requisições autenticadas
 */
export async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
    const { disableRetry = false, ...fetchOptions } = options;

    // Obter o token mais atualizado
    const token = await tokenCache.getToken();

    // Configurar as opções da requisição com o token
    const requestOptions: RequestInit = {
        ...fetchOptions,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...fetchOptions.headers,
        },
    };

    try {
        // Executar a requisição
        const response = await fetch(url, requestOptions);

        // Tratamento de erros de autenticação
        if (response.status === 401 && !disableRetry) {
            console.warn("Token inválido ou expirado, tentando atualizar a sessão...");

            // Invalidar o cache de token
            tokenCache.invalidateToken();

            // Tentar obter um novo token da sessão
            const newToken = await tokenCache.getToken();

            if (newToken) {
                console.log("Novo token obtido, repetindo a requisição");
                // Repetir a requisição com o novo token
                return fetchWithAuth(url, { ...options, disableRetry: true });
            } else {
                console.error("Falha ao obter novo token, redirecionando para login");
                // Se não conseguir um novo token, fazer logout
                await signOut({ redirect: true, callbackUrl: '/login' });
                throw new Error("Sessão expirada. Por favor, faça login novamente.");
            }
        }

        return response;
    } catch (error) {
        console.error(`Erro na requisição para ${url}:`, error);
        throw error;
    }
}

/**
 * Método para fazer uma requisição GET autenticada
 */
export function get(url: string, options: FetchOptions = {}) {
    return fetchWithAuth(url, { ...options, method: 'GET' });
}

/**
 * Método para fazer uma requisição POST autenticada
 */
export function post(url: string, data: any, options: FetchOptions = {}) {
    return fetchWithAuth(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Método para fazer uma requisição PUT autenticada
 */
export function put(url: string, data: any, options: FetchOptions = {}) {
    return fetchWithAuth(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Método para fazer uma requisição DELETE autenticada
 */
export function del(url: string, options: FetchOptions = {}) {
    return fetchWithAuth(url, { ...options, method: 'DELETE' });
}

export default {
    get,
    post,
    put,
    delete: del,
    fetchWithAuth,
};