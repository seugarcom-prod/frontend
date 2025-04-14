'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';

// Este componente funciona como um adaptador para o componente de login de cliente existente
export default function CustomerLoginAdapter() {
    const [isAdapterReady, setIsAdapterReady] = useState(false);
    const params = useParams();
    const restaurantName = params.restaurantName as string;

    useEffect(() => {
        // Interceptar o formulário de login existente
        const interceptLoginForm = () => {
            const loginForm = document.querySelector('form');

            if (loginForm) {
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    // Obter os campos de email e senha
                    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

                    if (emailInput && passwordInput) {
                        const email = emailInput.value;
                        const password = passwordInput.value;

                        try {
                            // Usar o customerLogin do hook useAuth
                            await customerLogin({
                                email,
                                password,
                                restaurantName, // Incluir informações do restaurante atual
                                isCustomerFlow: true // Indicar que é um login de cliente, não administrativo
                            });
                            // O redirecionamento já é feito dentro do customerLogin
                        } catch (error: any) {
                            // Mostrar mensagem de erro
                            // Verificar se existe um elemento para exibir erros
                            const errorElement = document.querySelector('[data-error-message]');
                            if (errorElement) {
                                errorElement.textContent = error.message || 'Erro no login';
                                errorElement.classList.remove('hidden');
                            } else {
                                // Se não existir, criar um
                                const form = emailInput.closest('form');
                                if (form) {
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'text-red-500 text-sm mt-2';
                                    errorDiv.setAttribute('data-error-message', 'true');
                                    errorDiv.textContent = error.message || 'Erro no login';

                                    // Inserir antes do primeiro input ou botão
                                    const firstElement = form.querySelector('input, button');
                                    if (firstElement) {
                                        form.insertBefore(errorDiv, firstElement);
                                    } else {
                                        form.prepend(errorDiv);
                                    }
                                }
                            }
                        }
                    }

                    return false;
                });

                setIsAdapterReady(true);
            }
        };

        // Executar após a montagem do componente
        interceptLoginForm();

        // Se não conseguir encontrar o formulário imediatamente, tentar novamente após um curto delay
        if (!isAdapterReady) {
            const timeoutId = setTimeout(() => {
                interceptLoginForm();
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [customerLogin, isAdapterReady, restaurantName]);

    // Este componente não renderiza nada visualmente,
    // apenas adiciona a funcionalidade ao formulário existente
    return null;
}