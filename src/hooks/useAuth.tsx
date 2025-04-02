// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// API URL - Ajustado para garantir o URL base correto
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:3333';

// Tipo para credenciais de login
interface LoginCredentials {
    email: string;
    password: string;
}

// Tipo para dados de registro de convidado
interface GuestData {
    cpf: string;
    email: string;
}

// Tipo para dados de autenticação
export interface AuthUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'CLIENT';
    isGuest: boolean;
}

// Tipo para informações do restaurante
export interface RestaurantInfo {
    restaurant?: {
        _id: string;
        name: string;
    };
    unit?: {
        _id: string;
        name: string;
    };
}

// Interface para estado de autenticação
export interface AuthState {
    isAuthenticated: boolean;
    isGuest: boolean;
    user: AuthUser | null;
    restaurantInfo: RestaurantInfo | null;
    token: string | null;
}

// Interface para contexto de autenticação
export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<any>;
    guestLogin: (data: GuestData) => Promise<any>;
    adminLogin: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    registerClient: (userData: any) => Promise<any>;
    registerAdminWithRestaurant: (data: any) => Promise<any>;
    authenticateAsGuest: (tableId: string, restaurantId: string, restaurantName: string) => void;
    isRole: (role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'CLIENT') => boolean;
    isAdminOrManager: () => boolean;
    loading: boolean;
}

// Criar contexto com valores padrão
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isGuest: false,
    user: null,
    restaurantInfo: null,
    token: null,
    login: async () => ({}),
    guestLogin: async () => ({}),
    adminLogin: async () => ({}),
    logout: async () => { },
    registerClient: async () => ({}),
    registerAdminWithRestaurant: async () => ({}),
    authenticateAsGuest: () => { },
    isRole: () => false,
    isAdminOrManager: () => false,
    loading: true
});

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Hook para login de usuários
export const userLogin = () => {
    const { login } = useAuth();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (credentials: LoginCredentials, options?: { onSuccess?: () => void }) => {
        setIsPending(true);
        setError(null);

        try {
            const result = await login(credentials);
            options?.onSuccess?.();
            return result;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, isPending, error };
};

// Hook para login de convidados
export const useGuestLogin = () => {
    const { guestLogin } = useAuth();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (data: { cpf: string, email: string }, options?: { onSuccess?: () => void }) => {
        setIsPending(true);
        setError(null);

        try {
            const result = await guestLogin(data);
            if (options?.onSuccess) {
                options.onSuccess();
            }
            return result;
        } catch (err: any) {
            setError(err instanceof Error ? err : new Error(err.message || 'Erro desconhecido'));
            throw err;
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, isPending, error };
};

// Provider para o contexto de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isGuest: false,
        user: null,
        restaurantInfo: null,
        token: null
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Verificar autenticação ao iniciar
    useEffect(() => {
        // Em useAuth.tsx, função checkAuth
        const checkAuth = async () => {
            setLoading(true);

            try {
                const token = localStorage.getItem('auth_token');
                console.log("Token encontrado:", !!token);

                if (!token) {
                    setAuthState({
                        isAuthenticated: false,
                        isGuest: false,
                        user: null,
                        restaurantInfo: null,
                        token: null
                    });
                    return;
                }

                // Tente validar o token no backend
                try {
                    const response = await fetch(`${API_URL}/validate`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();

                        if (data.user.role === 'ADMIN') {
                            setAuthState({
                                isAuthenticated: true,
                                isGuest: false,
                                user: {
                                    _id: data.restaurant?._id,
                                    firstName: data.restaurant?.name || "Admin",
                                    email: data.restaurant?.admin?.email,
                                    role: 'ADMIN',
                                    isGuest: false
                                },
                                restaurantInfo: {
                                    restaurant: data.restaurant,
                                    unit: data.units?.[0]
                                },
                                token
                            });
                        } else {
                            setAuthState({
                                isAuthenticated: true,
                                isGuest: false,
                                user: {
                                    ...data.user,
                                    isGuest: false
                                },
                                restaurantInfo: data.restaurantInfo,
                                token
                            });
                        }
                    } else {
                        // Token inválido, limpar e definir como não autenticado
                        localStorage.removeItem('auth_token');
                        setAuthState({
                            isAuthenticated: false,
                            isGuest: false,
                            user: null,
                            restaurantInfo: null,
                            token: null
                        });
                    }
                } catch (error) {
                    console.error("Erro ao validar token:", error);
                    localStorage.removeItem('auth_token');
                    setAuthState({
                        isAuthenticated: false,
                        isGuest: false,
                        user: null,
                        restaurantInfo: null,
                        token: null
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        const checkGuestAuth = async () => {
            // Verificar se há um token de convidado
            const guestToken = localStorage.getItem('guest_token');

            if (guestToken) {
                // Verificar se tem informações da mesa
                const storageKeys = Object.keys(localStorage);
                const tableKey = storageKeys.find(key => key.startsWith('table-'));

                if (tableKey) {
                    const restaurantName = tableKey.replace('table-', '');
                    const tableId = localStorage.getItem(tableKey);

                    // Buscar o ID do restaurante com base no nome
                    try {
                        const response = await fetch(`${API_URL}/restaurant/by-slug/${restaurantName}`);

                        if (response.ok) {
                            const restaurant = await response.json();

                            // Validar o token de convidado
                            const validateResponse = await fetch(`${API_URL}/validate/guest`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    guestToken,
                                    tableId,
                                    restaurantId: restaurant._id
                                })
                            });

                            if (validateResponse.ok) {
                                setAuthState({
                                    isAuthenticated: true,
                                    isGuest: true,
                                    user: {
                                        firstName: `Mesa ${tableId}`,
                                        isGuest: true
                                    },
                                    restaurantInfo: {
                                        restaurant: {
                                            _id: restaurant._id,
                                            name: restaurant.name
                                        }
                                    },
                                    token: guestToken
                                });
                                return;
                            }
                        }
                    } catch (error) {
                        console.error('Erro ao validar token de convidado:', error);
                    }
                }
            }

            // Se chegou aqui, não há autenticação válida
            setAuthState({
                isAuthenticated: false,
                isGuest: false,
                user: null,
                restaurantInfo: null,
                token: null
            });
        };

        checkAuth();
    }, []);

    // Função para login de usuários normais
    const login = async ({ email, password }: LoginCredentials) => {
        try {
            console.log('Tentando login com:', { email });
            const response = await fetch(`${API_URL}/login/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao fazer login');
            }

            const data = await response.json();

            // Salvar token no localStorage
            localStorage.setItem('auth_token', data.token);

            // Atualizar estado de autenticação
            setAuthState({
                isAuthenticated: true,
                isGuest: false,
                user: {
                    ...data.user,
                    isGuest: false
                },
                restaurantInfo: data.restaurantInfo,
                token: data.token
            });

            return data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    // Função para login de convidados
    const guestLogin = async ({ cpf, email }: { cpf: string, email: string }) => {
        try {
            console.log('Tentando login de convidado com CPF:', cpf);

            // Verificar se tem informações da mesa
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));

            if (!tableKey) {
                throw new Error('Informações da mesa não encontradas. Por favor, escaneie o QR Code novamente.');
            }

            const restaurantName = tableKey.replace('table-', '');
            const tableId = localStorage.getItem(tableKey);

            // Criar um token de convidado
            const guestToken = `guest_${Date.now()}_${cpf.replace(/\D/g, '')}`;
            localStorage.setItem('guest_token', guestToken);

            // Buscar restaurante
            try {
                const response = await fetch(`${API_URL}/restaurant/by-slug/${restaurantName}`);

                if (response.ok) {
                    const restaurant = await response.json();

                    // Atualizar estado de autenticação
                    setAuthState({
                        isAuthenticated: true,
                        isGuest: true,
                        user: {
                            firstName: `Mesa ${tableId}`,
                            email: email, // Armazenar email do convidado
                            isGuest: true
                        },
                        restaurantInfo: {
                            restaurant: {
                                _id: restaurant._id,
                                name: restaurant.name
                            }
                        },
                        token: guestToken
                    });

                    return { success: true };
                } else {
                    throw new Error('Restaurante não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar restaurante:', error);
                throw new Error('Erro ao obter informações do restaurante');
            }
        } catch (error: any) {
            console.error('Erro ao fazer login como convidado:', error);
            throw error instanceof Error ? error : new Error(error.message || 'Erro desconhecido');
        }
    };

    // Função para login de administrador
    const adminLogin = async (email: string, password: string) => {
        try {
            console.log("Enviando requisição de login para:", `${API_URL}/login/admin`);
            console.log("Dados:", { email: email, password: "***" });
            const response = await fetch(`${API_URL}/login/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, role: 'ADMIN' })
            });

            console.log("Status da resposta:", response.status);
            const responseData = await response.json();
            console.log("Resposta:", responseData);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao fazer login como administrador');
            }

            const data = await response.json();

            // Salvar token no localStorage
            localStorage.setItem('auth_token', data.token);

            // Atualizar estado de autenticação
            setAuthState({
                isAuthenticated: true,
                isGuest: false,
                user: {
                    _id: data.restaurant?._id,
                    firstName: data.restaurant?.name || 'Admin',
                    lastName: '',
                    email: data.restaurant?.admin?.email,
                    role: 'ADMIN',
                    isGuest: false
                },
                restaurantInfo: {
                    restaurant: data.restaurant,
                    unit: data.unit
                },
                token: data.token
            });

            return data;
        } catch (error) {
            console.error('Erro ao fazer login como administrador:', error);
            throw error;
        }
    };

    // Função para logout
    const logout = async () => {
        try {
            // Fazer logout no backend se estiver autenticado com JWT
            if (authState.token && !authState.isGuest) {
                await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState.token}`
                    }
                });
            }

            // Limpar tokens e dados de autenticação
            localStorage.removeItem('auth_token');
            localStorage.removeItem('guest_token');

            // Não remover as informações de mesa para permitir retornar como convidado

            // Atualizar estado
            setAuthState({
                isAuthenticated: false,
                isGuest: false,
                user: null,
                restaurantInfo: null,
                token: null
            });

            // Redirecionar para a página inicial
            router.push('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Função para registro de cliente
    const registerClient = async (userData: any) => {
        try {
            const response = await fetch(`${API_URL}/register/client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar usuário');
            }

            // Se o registro incluir um token, salvar e autenticar
            if (data.token) {
                localStorage.setItem('auth_token', data.token);

                // Atualizar estado de autenticação
                setAuthState({
                    isAuthenticated: true,
                    isGuest: false,
                    user: {
                        ...data.user,
                        isGuest: false
                    },
                    restaurantInfo: null,
                    token: data.token
                });
            }

            return data;
        } catch (error) {
            console.error('Erro ao registrar cliente:', error);
            throw error;
        }
    };

    // Função para registro de restaurante com admin
    const registerAdminWithRestaurant = async (data: any) => {
        try {
            console.log('Iniciando cadastro de admin com restaurante:', {
                email: data.email,
                name: data.name
            });

            const response = await fetch(`${API_URL}/register/restaurant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao registrar restaurante');
            }

            const responseData = await response.json();
            console.log('Resposta do cadastro:', responseData);

            // Salvar token no localStorage
            if (responseData.token) {
                console.log('Token recebido, salvando no localStorage');
                localStorage.setItem('auth_token', responseData.token);

                // Atualizar estado de autenticação
                setAuthState({
                    isAuthenticated: true,
                    isGuest: false,
                    user: {
                        _id: responseData.restaurant?._id,
                        firstName: responseData.restaurant?.name || "Admin",
                        email: responseData.restaurant?.admin?.email,
                        role: 'ADMIN',
                        isGuest: false
                    },
                    restaurantInfo: {
                        restaurant: responseData.restaurant
                    },
                    token: responseData.token
                });

                // ADICIONE ESTE CÓDIGO: Redirecionamento explícito para a página admin
                console.log('Redirecionando para a página de admin');

                // Se você tem acesso ao router do Next.js aqui:
                setTimeout(() => {
                    window.location.href = '/admin'; // Isso forçará um reload completo da página
                }, 100);
            }

            return responseData;
        } catch (error) {
            console.error('Erro ao registrar restaurante:', error);
            throw error;
        }
    };

    // Função para autenticar como convidado
    const authenticateAsGuest = (tableId: string, restaurantId: string, restaurantName: string) => {
        // Criar token de convidado (formato: guest_timestamp_tableId_restaurantId)
        const guestToken = `guest_${Date.now()}_${tableId}_${restaurantId}`;
        localStorage.setItem('guest_token', guestToken);

        // Salvar informações da mesa
        localStorage.setItem(`table-${restaurantName}`, tableId);

        // Atualizar estado
        setAuthState({
            isAuthenticated: true,
            isGuest: true,
            user: {
                firstName: `Mesa ${tableId}`,
                isGuest: true
            },
            restaurantInfo: {
                restaurant: {
                    _id: restaurantId,
                    name: restaurantName
                }
            },
            token: guestToken
        });
    };

    // Funções auxiliares para verificar roles
    const isRole = (role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'CLIENT') => {
        return authState.user?.role === role;
    };

    const isAdminOrManager = () => {
        return authState.user?.role === 'ADMIN' || authState.user?.role === 'MANAGER';
    };

    const contextValue: AuthContextType = {
        ...authState,
        login,
        guestLogin,
        adminLogin,
        logout,
        registerClient,
        registerAdminWithRestaurant,
        authenticateAsGuest,
        isRole,
        isAdminOrManager,
        loading
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};