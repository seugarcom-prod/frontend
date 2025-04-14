'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Componentes de formulário
import AdminInfoForm from '@/components/users/admin/AdminInfoForm';
import RestaurantInfoForm from './RestaurantInfoForm';
import RestaurantAddressForm from './RestaurantAddressForm';
import RestaurantScheduleForm from './RestaurantScheduleForm';
import AdminCredentialsForm from '@/components/users/admin/AdminCredentialsForm';
import { useRestaurantStore } from '@/stores';

export default function MobileRestaurantRegisterContainer() {
    const router = useRouter();
    const { registerAdminWithRestaurant } = useAuth();

    // Estado para controlar o passo atual
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estado para dados do formulário (igual ao desktop)
    const [formData, setFormData] = useState({
        // Dados do responsável (ADMIN)
        adminName: '',
        adminCpf: '',

        // Dados da loja (RESTAURANT)
        cnpjPart1: '',
        cnpjPart2: '',
        cnpjPart3: '',
        socialName: '',
        name: '',
        phone: '',
        specialty: '',

        // Endereço da loja
        zipCode: '',
        street: '',
        number: '',
        complement: '',

        // Horários de funcionamento
        schedules: [
            // Formatos iniciais com horários padrão
            {
                days: ['sex', 'sab', 'dom'],
                opens: '08:00',
                closes: '14:00'
            }
        ],

        // Credenciais de acesso
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Função genérica para atualizar o estado do formulário
    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    // Validação específica para cada passo
    const validateCurrentStep = (): boolean => {
        setError(null);

        switch (step) {
            case 1: // Responsável (Admin)
                if (!formData.adminName) {
                    setError("Nome do responsável é obrigatório");
                    return false;
                }
                if (!formData.adminCpf || formData.adminCpf.length < 14) {
                    setError("CPF inválido");
                    return false;
                }
                return true;

            case 2: // Informações da loja
                if (!formData.name) {
                    setError("Nome da loja é obrigatório");
                    return false;
                }

                // Validação simplificada do CNPJ para mobile
                const cnpjPart1 = formData.cnpjPart1.replace(/\D/g, '');
                if (!cnpjPart1 || cnpjPart1.length < 8) {
                    setError("CNPJ inválido");
                    return false;
                }

                return true;

            case 3: // Endereço
                if (!formData.zipCode || formData.zipCode.length < 9) {
                    setError("CEP inválido");
                    return false;
                }
                if (!formData.street) {
                    setError("Nome da rua é obrigatório");
                    return false;
                }
                return true;

            case 4: // Horários de funcionamento
                if (formData.schedules.length === 0) {
                    setError("Adicione pelo menos um horário de funcionamento");
                    return false;
                }
                return true;

            case 5: // Credenciais de acesso
                if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                    setError("Email inválido");
                    return false;
                }
                if (!formData.password || formData.password.length < 6) {
                    setError("A senha deve ter pelo menos 6 caracteres");
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError("As senhas não conferem");
                    return false;
                }
                return true;
        }

        return true;
    };

    // Função para avançar ao próximo passo
    const nextStep = () => {
        if (validateCurrentStep()) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    // Função para voltar ao passo anterior
    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    // Função para submeter o formulário completo
    // Modificação no handleSubmit do MobileRestaurantRegisterContainer.tsx
    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Preparar os dados para API de modo similar à versão desktop
            const firstName = formData.adminName.split(' ')[0];
            const lastName = formData.adminName.split(' ').slice(1).join(' ');

            // Montar CNPJ completo (simplificado para mobile)
            const cnpj = formData.cnpjPart1.replace(/\D/g, '') +
                (formData.cnpjPart2 || '') +
                (formData.cnpjPart3 || '');

            // Transformar os horários para o formato esperado pelo backend
            const businessHours = formData.schedules.map(schedule => {
                const dayMappings: Record<string, string> = {
                    dom: 'Domingo',
                    seg: 'Segunda',
                    ter: 'Terça',
                    qua: 'Quarta',
                    qui: 'Quinta',
                    sex: 'Sexta',
                    sab: 'Sábado'
                };

                const days = schedule.days.map(dayId => dayMappings[dayId] || dayId);

                return {
                    days,
                    open: schedule.opens,
                    close: schedule.closes
                };
            });

            // Preparar payload para a API
            const payload = {
                firstName,
                lastName,
                cpf: formData.adminCpf.replace(/\D/g, ''),
                email: formData.email,
                password: formData.password,
                name: formData.name,
                socialName: formData.socialName || formData.name,
                cnpj: cnpj.replace(/\D/g, ''),
                specialty: formData.specialty,
                phone: formData.phone,
                address: {
                    zipCode: formData.zipCode.replace(/\D/g, ''),
                    street: formData.street,
                    number: parseInt(formData.number) || 0,
                    complement: formData.complement || ''
                },
                businessHours
            };

            // Chamar a função de autenticação para registrar
            const result = await registerAdminWithRestaurant(payload);

            if (result.success) {
                // Obter o ID do restaurante do store
                const restaurantId = useRestaurantStore.getState().restaurantId;

                // Redirecionar para dashboard após sucesso
                if (restaurantId) {
                    router.push(`/restaurant/${restaurantId}/dashboard`);
                } else {
                    // Fallback para a resposta da API se o store não tiver o ID ainda
                    router.push(`/restaurant/${result.restaurant?._id}/dashboard`);
                }
            } else {
                setError(result.message);
            }
        } catch (error: any) {
            console.error('Erro ao registrar:', error);
            setError(error.message || 'Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    // Renderizar o formulário atual baseado no passo - adaptado para mobile
    const renderCurrentStep = () => {
        switch (step) {
            case 1:
                return (
                    <AdminInfoForm />
                );

            case 2:
                return (
                    <RestaurantInfoForm />
                );

            case 3:
                return (
                    <RestaurantAddressForm />
                );

            case 4:
                return (
                    <RestaurantScheduleForm />
                );

            case 5:
                return (
                    <AdminCredentialsForm />
                );

            default:
                return null;
        }
    };

    // Renderização condicional dos botões de navegação para mobile
    const renderMobileNavigationButtons = () => {
        return (
            <div className="mt-6 flex justify-between">
                {step === 1 ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/')}
                        className="text-gray-500"
                    >
                        Cancelar
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={prevStep}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </Button>
                )}

                <Button
                    size="sm"
                    onClick={step === 5 ? handleSubmit : nextStep}
                    disabled={isLoading}
                >
                    {isLoading ? "Processando..." : step === 5 ? "Finalizar" : "Próximo"}
                </Button>
            </div>
        );
    };

    // Layout mobile específico
    return (
        <div className="min-h-screen flex flex-col">
            {/* Cabeçalho com logo */}
            <div className="bg-black p-4 flex justify-center items-center">
                <Image
                    src="/Logo.svg"
                    alt="Sr. Garçom"
                    width={120}
                    height={40}
                    priority
                />
            </div>

            {/* Corpo do formulário */}
            <div className="flex-1 p-4">
                <h1 className="text-xl font-bold mb-4">Crie sua conta</h1>

                {/* Indicador de progresso */}
                <div className="flex justify-between mb-6">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div
                            key={num}
                            className={`w-2 h-2 rounded-full ${num <= step ? 'bg-black' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Formulário atual */}
                {renderCurrentStep()}

                {/* Mensagem de erro */}
                {error && (
                    <div className="mt-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Botões de navegação */}
                {renderMobileNavigationButtons()}
            </div>
        </div>
    );
}