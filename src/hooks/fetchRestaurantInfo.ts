import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useRestaurantStore } from '@/stores/index'; // Importa o authStore para obter o token
import { useToast } from '@/hooks/useToast';

const useFetchRestaurantInfo = () => {
    const router = useRouter();
    const { setRestaurantId, setUserRole, restaurantId } = useRestaurantStore();
    const { token } = useAuthStore.getState(); // Obtém o token do authStore
    const toast = useToast();

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    toast.toast({
                        variant: "destructive",
                        title: "Acesso negado",
                        description: "Você precisa estar logado como administrador para criar unidades."
                    });
                    router.push('/login');
                    return;
                }

                const response = await fetch(`${API_URL}/validate`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    throw new Error("Token inválido ou expirado.");
                }

                const data = await response.json();

                if (data && data.user.role === 'ADMIN') {
                    setUserRole(data.user.role); // Armazena o papel do usuário
                    const restaurantDetails = await fetch(`${API_URL}/restaurant/${restaurantId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const restaurantData = await restaurantDetails.json();

                    setRestaurantId(restaurantData.id); // Atualiza o ID do restaurante no store

                    toast.toast({
                        variant: "default",
                        title: "Sucesso",
                        description: "Informações do restaurante carregadas."
                    });
                } else {
                    toast.toast({
                        variant: "destructive",
                        title: "Acesso negado",
                        description: "Você precisa ser administrador de um restaurante para criar unidades."
                    });
                    router.push(`/restaurant/${restaurantId}/dashboard`);
                }
            } catch (error) {
                console.error("Erro ao buscar informações do restaurante:", error);
                toast.toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Ocorreu um erro ao verificar suas permissões."
                });
            }
        };

        fetchData();
    }, [token, router, setRestaurantId, setUserRole]); // Adicione dependências
};

export default useFetchRestaurantInfo;