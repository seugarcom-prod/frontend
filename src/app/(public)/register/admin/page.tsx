"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminInfoForm from '@/components/users/admin/AdminInfoForm';
import RestaurantInfoForm from '@/components/restaurant/register/RestaurantInfoForm';
import RestaurantAddressForm from '@/components/restaurant/register/RestaurantAddressForm';
import RestaurantScheduleForm from '@/components/restaurant/register/RestaurantScheduleForm';
import AdminCredentialsForm from '@/components/users/admin/AdminCredentialsForm';
import Logo from "@/../public/Logo.svg";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Schedule {
    days: string[];
    opens: string;
    closes: string;
}

interface FormData {
    // Admin data
    adminName: string;
    adminCpf: string;
    email: string;
    password: string;
    confirmPassword: string;

    // Restaurant data
    cnpjPart1: string;
    cnpjPart2: string;
    cnpjPart3: string;
    socialName: string;
    name: string;
    phone: string;
    specialty: string;

    // Address data
    zipCode: string;
    street: string;
    number: string;
    complement: string;

    // Schedule data
    schedules: Schedule[];
}

export default function RegistrationFlow() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        // Admin data
        adminName: '',
        adminCpf: '',
        email: '',
        password: '',
        confirmPassword: '',

        // Restaurant data
        cnpjPart1: '',
        cnpjPart2: '',
        cnpjPart3: '',
        socialName: '',
        name: '',
        phone: '',
        specialty: '',

        // Address data
        zipCode: '',
        street: '',
        number: '',
        complement: '',

        // Schedule data
        schedules: [
            {
                days: ['qui', 'sex', 'sab'],
                opens: '08:00',
                closes: '14:00'
            },
            {
                days: ['seg', 'qua'],
                opens: '08:00',
                closes: '14:00'
            },
            {
                days: ['ter', 'qui'],
                opens: '08:00',
                closes: '14:00'
            },
            {
                days: ['dom'],
                opens: '08:00',
                closes: '14:00'
            }
        ]
    });

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Format the data for the API
            const cnpj = `${formData.cnpjPart1}/${formData.cnpjPart2}-${formData.cnpjPart3}`;

            // Create user (admin) first
            const userData = {
                firstName: formData.adminName.split(' ')[0],
                lastName: formData.adminName.split(' ').slice(1).join(' '),
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: "ADMIN"
            };

            const userResponse = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!userResponse.ok) {
                throw new Error('Failed to create admin user');
            }

            const userResult = await userResponse.json();

            // Then create restaurant
            const restaurantData = {
                name: formData.name,
                socialName: formData.socialName,
                cnpj: cnpj,
                logo: 'default-logo.png', // Default logo
                address: {
                    zipCode: formData.zipCode,
                    street: formData.street,
                    number: parseInt(formData.number),
                    complement: formData.complement
                },
                specialty: formData.specialty,
                phone: formData.phone,
                admin: {
                    fullName: formData.adminName,
                    cpf: formData.adminCpf
                },
                units: []
            };

            const restaurantResponse = await fetch('/api/restaurants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(restaurantData),
            });

            if (!restaurantResponse.ok) {
                throw new Error('Failed to create restaurant');
            }

            // Redirect to admin dashboard
            router.push('/dashboard');

        } catch (error) {
            console.error('Registration error:', error);
            // Implementar tratamento de erro para o usuário
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBackButtonText = () => {
        switch (currentStep) {
            case 1: return 'Cancelar';
            case 2: return 'Voltar para: Responsável da loja';
            case 3: return 'Voltar para: Informações da loja';
            case 4: return 'Voltar para: Endereço da loja';
            case 5: return 'Voltar para: Horários de funcionamento';
            default: return 'Voltar';
        }
    };

    const renderForm = () => {
        switch (currentStep) {
            case 1:
                return <AdminInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 2:
                return <RestaurantInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 3:
                return <RestaurantAddressForm
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 4:
                return <RestaurantScheduleForm
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 5:
                return <AdminCredentialsForm
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left side - Form */}
            <div className="w-1/2 p-6">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-semibold mb-6">Crie sua conta</h1>

                    {renderForm()}

                    {/* Progress indicator and navigation */}
                    <div className="mt-12">
                        <div className="w-full bg-gray-200 h-1 mb-6 flex">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                    key={step}
                                    className={`h-full ${step <= currentStep ? 'bg-black' : 'bg-gray-200'}`}
                                    style={{ width: '20%' }}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                onClick={currentStep === 1 ? () => router.push('/') : handleBack}
                                className="flex items-center text-sm border border-border rounded-md px-4 py-2"
                                disabled={isSubmitting}
                            >
                                {currentStep > 1 && (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                )}
                                {getBackButtonText()}
                            </Button>

                            {currentStep < 5 ? (
                                <Button
                                    onClick={handleNext}
                                    className="flex items-center bg-black text-white rounded-md px-4 py-2"
                                    disabled={isSubmitting}
                                >
                                    Próximo
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    className="flex items-center bg-black text-white rounded-md px-4 py-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>Processando...</span>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Finalizar
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Logo */}
            <div className="w-full md:w-2/3 bg-black flex flex-col items-center justify-center p-8">
                <div className="flex-1 flex items-center justify-center">
                    <Image
                        priority
                        src={Logo}
                        alt="SR. GARÇOM"
                        width={400}
                        height={120}
                    />
                </div>
                <div className="text-white text-center text-sm mt-auto">
                    <p>
                        Ao entrar você concorda com os <Link href="#" className="underline text-white">Termos de uso</Link> e as <Link href="#" className="underline text-white">Política de privacidade</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}