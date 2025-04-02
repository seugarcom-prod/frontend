"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import UnitInfoForm from "./UnitInfoForm";
import UnitAddressForm from "./UnitAddressForm";
import UnitScheduleForm from "./UnitScheduleForm";
import UnitManagersForm from "./UnitManagersForm";
import UnitSuccessScreen from "./UnitSuccessScreen";
import { useToast } from "@/hooks/useToast";

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
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [unit, setUnit] = useState<RestaurantUnit>(initialUnit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [restaurant, setRestaurant] = useState<{ id: string, cnpj: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

        if (!restaurant?.id) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "ID do restaurante não encontrado."
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Formatar os dados para corresponder à API
            const payload = {
                cnpj: unit.cnpj,
                socialName: unit.socialName,
                manager: unit.managers[0], // Pegando o primeiro gerente como principal
                contact: unit.phone,
                address: {
                    zipCode: unit.address.zipCode,
                    street: unit.address.street,
                    number: parseInt(unit.address.number),
                    complement: unit.address.complement,
                },
            };

            const response = await fetch(`/restaurant/${restaurant.id}/unit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Avançar para a tela de sucesso
                setStep(5);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao criar unidade");
            }
        } catch (error: any) {
            console.error("Error creating restaurant unit:", error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message || "Ocorreu um erro ao criar a unidade."
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
                return <UnitInfoForm
                    unit={unit}
                    updateUnit={updateUnitInfo}
                    matrixCNPJ={restaurant?.cnpj}
                />;
            case 2:
                return <UnitAddressForm address={unit.address} updateAddress={updateUnitAddress} />;
            case 3:
                return (
                    <UnitScheduleForm
                        useMatrixSchedule={unit.useMatrixSchedule}
                        schedules={unit.schedules}
                        updateUnit={updateUnitInfo}
                    />
                );
            case 4:
                return (
                    <UnitManagersForm
                        selectedManagers={unit.managers}
                        updateUnit={updateUnitInfo}
                    />
                );
            case 5:
                return <UnitSuccessScreen />;
            default:
                return <UnitInfoForm unit={unit} updateUnit={updateUnitInfo} />;
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary rounded-full border-t-transparent mb-4 mx-auto"></div>
                    <p>Carregando informações...</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const fetchRestaurantInfo = async () => {
            try {
                setIsLoading(true);

                // Verificar token - este é apenas um exemplo de como verificar a autenticação
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    toast({
                        variant: "destructive",
                        title: "Acesso negado",
                        description: "Você precisa estar logado como administrador para criar unidades."
                    });
                    router.push('/login');
                    return;
                }

                // Buscar informações do restaurante do usuário logado
                const response = await fetch(`${API_URL}/validate`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                // Verificar se o usuário é um admin de restaurante e tem um restaurante associado
                if (data.isValid && data.user.role === 'ADMIN' && data.restaurant) {
                    // Buscar detalhes adicionais do restaurante se necessário
                    const restaurantDetails = await fetch(`${API_URL}/restaurant/${data.restaurant._id}`);
                    const restaurantData = await restaurantDetails.json();

                    setRestaurant({
                        id: data.restaurant._id,
                        cnpj: restaurantData.cnpj || ''
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Acesso negado",
                        description: "Você precisa ser administrador de um restaurante para criar unidades."
                    });
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error("Erro ao buscar informações do restaurante:", error);
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Ocorreu um erro ao verificar suas permissões."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurantInfo();
    }, [router, toast]);

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
                                    className="bg-black hover:bg-gray-800 text-primary px-4 py-2 rounded-md"
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