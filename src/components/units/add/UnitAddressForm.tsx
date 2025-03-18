"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RestaurantUnit } from "./AddRestaurantUnit";

interface UnitAddressFormProps {
    address: RestaurantUnit["address"];
    updateAddress: (address: Partial<RestaurantUnit["address"]>) => void;
}

export default function UnitAddressForm({
    address,
    updateAddress,
}: UnitAddressFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [ruaEncontrada, setRuaEncontrada] = useState(false);

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

        updateAddress({ zipCode: formattedCep });

        // Se o campo de CEP for alterado, resetamos o estado de validação
        setRuaEncontrada(false);

        // Se o CEP tiver 8 dígitos, buscar endereço
        if (rawCep.length === 8) {
            try {
                setIsLoading(true);
                const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    // Verificamos se a API retornou um logradouro (rua)
                    if (data.logradouro) {
                        updateAddress({
                            street: data.logradouro,
                        });
                        setRuaEncontrada(true);
                    }
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
                <h2 className="text-lg font-medium mb-1">Endereço da unidade</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Preencha as informações de endereço da sua loja.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="cep" className="block mb-4">
                        CEP
                    </Label>
                    <Input
                        className="h-10"
                        id="cep"
                        value={address.zipCode}
                        onChange={handleCepChange}
                        placeholder="Digite seu CEP"
                        maxLength={9}
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <Label htmlFor="street" className="block mb-4">
                            Rua
                        </Label>
                        <Input
                            className="h-10"
                            id="street"
                            value={address.street}
                            onChange={(e) => updateAddress({ street: e.target.value })}
                            placeholder="Digite o nome da rua"
                            disabled={isLoading || ruaEncontrada}
                        />
                    </div>

                    <div>
                        <Label htmlFor="number" className="block mb-4">
                            Número
                        </Label>
                        <Input
                            className="h-10"
                            id="number"
                            value={address.number}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                updateAddress({ number: value });
                            }}
                            placeholder="Número"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="complement" className="block mb-4">
                        Complemento
                    </Label>
                    <Input
                        className="h-10"
                        id="complement"
                        value={address.complement}
                        onChange={(e) => updateAddress({ complement: e.target.value })}
                        placeholder="Ex. Res. Burguer"
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}