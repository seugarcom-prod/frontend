"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import UnitInfoForm from "./UnitInfoForm";
import UnitAddressForm from "./UnitAddressForm";
import UnitScheduleForm from "./UnitScheduleForm";
import UnitManagersForm from "./UnitManagersForm";
import UnitSuccessScreen from "./UnitSuccessScreen";

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
    const [step, setStep] = useState(1);
    const [unit, setUnit] = useState<RestaurantUnit>(initialUnit);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                // Outros campos conforme necessário
            };

            // Chamada da API para criar a unidade
            const response = await fetch("/restaurant/:id/units", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Avançar para a tela de sucesso
                setStep(5);
            } else {
                throw new Error("Failed to create restaurant unit");
            }
        } catch (error) {
            console.error("Error creating restaurant unit:", error);
            // Implementar tratamento de erro
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
                return <UnitInfoForm unit={unit} updateUnit={updateUnitInfo} />;
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