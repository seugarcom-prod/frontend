"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useRestaurantStore } from '@/stores';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import UnitInfoForm from "./UnitInfoForm";
import UnitAddressForm from "./UnitAddressForm";
import UnitScheduleForm from "./UnitScheduleForm";
import UnitManagersForm from "./UnitManagersForm";
import UnitSuccessScreen from "./UnitSuccessScreen";
import { useToast } from "@/hooks/useToast";
import { useRestaurantId } from "@/hooks/useRestaurantId";
import useFetchRestaurantInfo from "@/hooks/fetchRestaurantInfo";

export interface Schedule {
    day: string;
    opens: string;
    closes: string;
}

export interface RestaurantUnit {
    cnpj: string;
    socialName: string;
    name: string;
    phone: string;
    specialty: string;
    useMatrixCNPJ: boolean;
    address: {
        zipCode: string;
        street: string;
        number: string;
        complement: string;
    };
    useMatrixSchedule: boolean;
    schedules: Schedule[];
    managers: string[];
}

const initialUnit: RestaurantUnit = {
    cnpj: "",
    socialName: "",
    name: "",
    phone: "",
    specialty: "",
    useMatrixCNPJ: false,
    address: {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
    },
    useMatrixSchedule: false,
    schedules: [],
    managers: [],
};

export default function AddRestaurantUnit() {
    useFetchRestaurantInfo();
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [unit, setUnit] = useState<RestaurantUnit>(initialUnit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [restaurant, setRestaurant] = useState<{ id: string, cnpj: string } | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleClose = () => {
        router.push("/restaurant/unit");
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const restaurantId = useRestaurantStore.getState().restaurantId; // Obtém o ID do restaurante do Zustand
            if (!restaurantId) {
                throw new Error("ID do restaurante não encontrado");
            }

            const token = useAuthStore.getState().token; // Obtém o token do authStore
            if (!token) {
                throw new Error("Token não encontrado");
            }

            // Formatar os dados conforme esperado pelo backend
            const payload = {
                name: unit.name,
                socialName: unit.socialName,
                cnpj: unit.cnpj,
                phone: unit.phone,
                specialty: unit.specialty,
                address: {
                    street: unit.address.street,
                    number: unit.address.number,
                    complement: unit.address.complement,
                    zipCode: unit.address.zipCode,
                },
                businessHours: unit.schedules.map(schedule => ({
                    day: schedule.day,
                    opens: schedule.opens,
                    closes: schedule.closes
                })),
                status: 'active'
            };

            const response = await fetch(`${API_URL}/restaurant/${restaurantId}/units/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Usa o token do authStore
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            setStep(5); // Avança para tela de sucesso
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao criar unidade",
                description: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateUnitInfo = (data: Partial<RestaurantUnit>) => {
        setUnit((prev) => ({ ...prev, ...data }));
    };

    const updateUnitAddress = (address: Partial<RestaurantUnit["address"]>) => {
        setUnit((prev) => ({
            ...prev,
            address: { ...prev.address, ...address },
        }));
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <UnitInfoForm />;
            case 2:
                return <UnitAddressForm />;
            case 3:
                return (
                    <UnitScheduleForm />
                );
            case 4:
                return (
                    <UnitManagersForm />
                );
            case 5:
                return <UnitSuccessScreen />;
            default:
                return <UnitInfoForm />;
        }
    };

    return (
        <div className="h-screen">
            <div className="flex flex-col w-full mx-auto bg-transparent">
                <div className="mt-8 mb-8 relative mx-auto w-full p-8">
                    <div className="flex flex-row justify-between items-center mb-7">
                        <h2 className="text-2xl font-medium">Adicionar nova unidade</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="mb-8">{renderStepContent()}</div>

                    {step !== 5 && (
                        <div className="mt-14">
                            <Progress
                                value={(step / 4) * 100}
                                className="h-2 bg-gray-300 mb-6"
                            />
                            <div className="flex justify-between">
                                {step > 1 ? (
                                    <Button
                                        variant="outline"
                                        onClick={handlePrevious}
                                        className="px-4 py-2 rounded-md border border-border"
                                    >
                                        <span>
                                            <ChevronLeft className="h-4 w-4 inline mr-1" />
                                            Voltar para:
                                            {step === 2 && " Informações da unidade"}
                                            {step === 3 && " Endereço da unidade"}
                                            {step === 4 && " Horário de funcionamento"}
                                        </span>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={handleClose}
                                        className="px-4 py-2 rounded-md border border-border"
                                    >
                                        Cancelar
                                    </Button>
                                )}

                                <Button
                                    onClick={step < 4 ? handleNext : handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-secondary hover:bg-gray-800 text-primary px-4 py-2 rounded-md"
                                >
                                    {step < 4 ? (
                                        <>
                                            Próximo
                                            <ChevronRight className="ml-2 h-4 w-4 inline" />
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4 inline" />
                                            Finalizar cadastro
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="mt-8">
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/admin")}
                                    className="w-full"
                                >
                                    Voltar para o menu inicial
                                </Button>
                                <Button
                                    className="w-full bg-black hover:bg-gray-800 text-white"
                                    onClick={() => router.push(`/restaurant/unit/${unit.cnpj}`)}
                                >
                                    Visualizar unidade
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

