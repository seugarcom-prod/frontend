import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Tipo para dados de autenticação
export interface AuthData {
    isAuthenticated: boolean;
    isGuest: boolean;
    user?: {
        _id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'CLIENT';
        isGuest: boolean;
    };
    token?: string;
}

// Contexto de autenticação
const AuthContext = createContext<{
    auth: AuthData | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}>({
    auth: null,
    isLoading: true,
    login: async () => { },
    logout: () => { },
});

// Provider de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Verificar autenticação ao iniciar
    useEffect(() => {
        checkAuth();
    }, []);

    // Função para verificar autenticação
    const checkAuth = async () => {
        setIsLoading(true);

        try {
            // Verificar se há um token de autenticação normal
            const token = localStorage.getItem('auth_token');

            // Verificar se há autenticação de convidado
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));
            const hasTableNumber = !!tableKey;

            if (token) {
                // Usuário normal autenticado
                try {
                    // Fazer API call para validar token
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/validate`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();

                        setAuth({
                            isAuthenticated: true,
                            isGuest: false,
                            user: {
                                ...userData,
                                isGuest: false
                            },
                            token
                        });
                    } else {
                        // Token inválido, limpar
                        localStorage.removeItem('auth_token');

                        // Verificar se pode autenticar como convidado
                        if (hasTableNumber && tableKey) {
                            authenticateAsGuest(tableKey);
                        } else {
                            setAuth({
                                isAuthenticated: false,
                                isGuest: false
                            });
                        }
                    }
                } catch (error) {
                    console.error('Erro ao validar autenticação:', error);

                    // Falha na verificação, verificar se pode autenticar como convidado
                    if (hasTableNumber && tableKey) {
                        authenticateAsGuest(tableKey);
                    } else {
                        setAuth({
                            isAuthenticated: false,
                            isGuest: false
                        });
                    }
                }
            } else if (hasTableNumber && tableKey) {
                // Autenticar como convidado
                authenticateAsGuest(tableKey);
            } else {
                // Sem autenticação
                setAuth({
                    isAuthenticated: false,
                    isGuest: false
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Função para autenticar como convidado
    const authenticateAsGuest = (tableKey: string) => {
        // Extrair nome do restaurante do tableKey
        const restaurantName = tableKey.replace('table-', '');
        const tableNumber = localStorage.getItem(tableKey);

        // Criar um token temporário para convidado
        const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('guest_token', guestToken);

        // Configurar dados de autenticação como convidado
        setAuth({
            isAuthenticated: true,
            isGuest: true,
            user: {
                firstName: `Convidado Mesa ${tableNumber}`,
                role: 'CLIENT', // Definir role para convidados (geralmente será CLIENT)
                isGuest: true
            },
            token: guestToken
        });
    };

    // Função de login
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();

            // Salvar token
            localStorage.setItem('auth_token', data.token);

            // Atualizar estado de autenticação
            setAuth({
                isAuthenticated: true,
                isGuest: false,
                user: {
                    ...data.user,
                    isGuest: false
                },
                token: data.token
            });

            return data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    // Função de logout
    const logout = () => {
        // Limpar tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('guest_token');

        // Atualizar estado
        setAuth({
            isAuthenticated: false,
            isGuest: false
        });

        // Redirecionar para a página inicial
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ auth, isLoading, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
    return useContext(AuthContext);
}
// Hook para verificar autenticação (mantido para compatibilidade)
export function useAuthCheck(redirectToLogin = false) {
    const { auth, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !auth?.isAuthenticated && redirectToLogin) {
            router.push('/login');
        }
    }, [auth, isLoading, redirectToLogin, router]);

    return { data: auth, isLoading };
}

// Hook para obter informações da mesa
export function useTableInfo(restaurantName: string) {
    const [tableNumber, setTableNumber] = useState<string | null>(null);

    useEffect(() => {
        const storedTableNumber = localStorage.getItem(`table-${restaurantName}`);
        setTableNumber(storedTableNumber);
    }, [restaurantName]);

    return { tableNumber };
}