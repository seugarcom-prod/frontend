// utils/tokenUtils.ts
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

interface DecodedToken {
    userId: string;
    role: string;
    isExpired: boolean;
    expiresAt: Date;
}

/**
 * Salva o token de autenticação
 */
export const saveToken = (token: string) => {
    // Salvar no localStorage para uso interno na aplicação
    localStorage.setItem('auth_token', token);

    // Salvar como cookie para uso no middleware de roteamento
    // httpOnly: false permite que o middleware do Next.js acesse o cookie
    Cookies.set('auth_token', token, {
        expires: 7, // 7 dias
        path: '/',
        sameSite: 'strict'
    });
};

/**
 * Salva o token de convidado
 */
export const saveGuestToken = (token: string) => {
    localStorage.setItem('guest_token', token);

    // Salvar como cookie para uso no middleware de roteamento
    Cookies.set('guest_token', token, {
        expires: 1, // 1 dia
        path: '/',
        sameSite: 'strict'
    });
};

/**
 * Remove todos os tokens
 */
export const clearTokens = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('guest_token');

    Cookies.remove('auth_token');
    Cookies.remove('guest_token');
};

/**
 * Decodifica e verifica um token JWT
 */
export const decodeToken = (token: string): DecodedToken | null => {
    if (!token) return null;

    try {
        // Para tokens de convidado
        if (token.startsWith('guest_')) {
            return {
                userId: 'guest',
                role: 'CLIENT',
                isExpired: false,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
            };
        }

        // Para tokens JWT
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;

        return {
            userId: decoded.id,
            role: decoded.role,
            isExpired: decoded.exp < currentTime,
            expiresAt: new Date(decoded.exp * 1000)
        };
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
};

/**
 * Obtém o token atual
 */
export const getToken = (): string | null => {
    return localStorage.getItem('auth_token') || localStorage.getItem('guest_token') || null;
};

/**
 * Verifica se o usuário tem uma role específica
 */
export const hasRole = (requiredRoles: string[]): boolean => {
    const token = getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded || decoded.isExpired) return false;

    return requiredRoles.includes(decoded.role);
};

/**
 * Obtém a role do usuário atual
 */
export const getCurrentUserRole = (): string | null => {
    const token = getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded || decoded.isExpired) return null;

    return decoded.role;
};