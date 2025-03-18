"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RestaurantAddressFormProps {
    formData: {
        zipCode: string;
        street: string;
        number: string;
        complement: string;
    };
    updateFormData: (data: Partial<{
        zipCode: string;
        street: string;
        number: string;
        complement: string;
    }>) => void;
}

export default function RestaurantAddressForm({ formData, updateFormData }: RestaurantAddressFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const formatCep = (cep: string) => {
        // Remove tudo que não for número
        cep = cep.replace(/\D/g, "");

        // Formato: XXXXX-XXX
        if (cep.length > 5) {
            cep = `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
        }

        return cep;
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawCep = e.target.value.replace(/\D/g, "");
        const formattedCep = formatCep(rawCep);

        updateFormData({ zipCode: formattedCep });

        // Se o CEP tiver 8 dígitos, buscar endereço
        if (rawCep.length === 8) {
            try {
                setIsLoading(true);
                const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    updateFormData({
                        street: data.logradouro,
                        // O número e complemento precisam ser preenchidos pelo usuário
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Endereço da loja</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Preencha as informações de endereço da sua loja.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <Label htmlFor="cep" className="block mb-2">
                        CEP
                    </Label>
                    <Input
                        id="cep"
                        value={formData.zipCode}
                        onChange={handleCepChange}
                        placeholder="Digite seu CEP"
                        maxLength={9}
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="street" className="block mb-2">
                            Rua
                        </Label>
                        <Input
                            id="street"
                            value={formData.street}
                            onChange={(e) => updateFormData({ street: e.target.value })}
                            placeholder="Digite o nome da rua"
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>

                    <div className="w-24">
                        <Label htmlFor="number" className="block mb-2">
                            Número
                        </Label>
                        <Input
                            id="number"
                            value={formData.number}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                updateFormData({ number: value });
                            }}
                            placeholder="Número"
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="complement" className="block mb-2">
                        Complemento
                    </Label>
                    <Input
                        id="complement"
                        value={formData.complement}
                        onChange={(e) => updateFormData({ complement: e.target.value })}
                        placeholder="Ex. Res. Burguer"
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}