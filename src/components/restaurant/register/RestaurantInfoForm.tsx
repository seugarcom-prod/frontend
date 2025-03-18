"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    formatCnpj,
    handleCnpjChange,
    handleCnpjPart1Change,
    handleCnpjPart2Change,
    handleCnpjPart3Change,
    handlePhoneChange,
    isValidCnpj,
} from '@/utils/formatCnpj';

interface RestaurantInfoFormProps {
    formData: {
        cnpjPart1: string;
        cnpjPart2: string;
        cnpjPart3: string;
        socialName: string;
        name: string;
        phone: string;
        specialty: string;
    };
    updateFormData: (data: Partial<{
        cnpjPart1: string;
        cnpjPart2: string;
        cnpjPart3: string;
        socialName: string;
        name: string;
        phone: string;
        specialty: string;
    }>) => void;
}

export default function RestaurantInfoForm({ formData, updateFormData }: RestaurantInfoFormProps) {
    const validateCnpj = () => {
        // Montar o CNPJ completo a partir dos três campos
        const cnpjPart1 = (formData.cnpjPart1 || '').replace(/\D/g, '');
        const cnpjPart2 = formData.cnpjPart2 || '';
        const cnpjPart3 = formData.cnpjPart3 || '';

        // Verificar se todos os campos estão preenchidos
        if (cnpjPart1.length === 8 && cnpjPart2.length === 4 && cnpjPart3.length === 2) {
            const fullCnpj = cnpjPart1 + cnpjPart2 + cnpjPart3;
            return isValidCnpj(fullCnpj);
        }

        return false;
    };

    const isCnpjComplete = () => {
        const cnpjPart1 = (formData.cnpjPart1 || '').replace(/\D/g, '');
        const cnpjPart2 = formData.cnpjPart2 || '';
        const cnpjPart3 = formData.cnpjPart3 || '';

        return cnpjPart1.length === 8 && cnpjPart2.length === 4 && cnpjPart3.length === 2;
    };

    const specialties = [
        { value: "acai", label: "Açaí" },
        { value: "pizza", label: "Pizza" },
        { value: "hamburger", label: "Hamburger" },
        { value: "japanese", label: "Japonesa" },
        { value: "brazilian", label: "Brasileira" },
        { value: "italian", label: "Italiana" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Informações da rede</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Informe os dados do seu negócio.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <Label htmlFor="cnpj" className="block mb-2">
                        CNPJ
                    </Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="cnpj-part1"
                            value={formData.cnpjPart1}
                            onChange={e => handleCnpjPart1Change}
                            placeholder="12.345.678"
                            className="w-full"
                        />
                        <span className="text-gray-500">/</span>
                        <Input
                            id="cnpj-part2"
                            value={formData.cnpjPart2}
                            onChange={e => handleCnpjPart2Change}
                            placeholder="0001"
                            className="w-24"
                        />
                        <span className="text-gray-500">-</span>
                        <Input
                            id="cnpj-part3"
                            value={formData.cnpjPart3}
                            onChange={e => handleCnpjPart3Change}
                            placeholder="90"
                            className="w-14"
                        />
                    </div>
                    {isCnpjComplete() && !validateCnpj() && (
                        <p className="text-red-500 text-sm mt-1">CNPJ inválido</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="socialName" className="block mb-2">
                        Razão social
                    </Label>
                    <Input
                        id="socialName"
                        value={formData.socialName}
                        onChange={(e) => updateFormData({ socialName: e.target.value })}
                        placeholder="Informe a razão social da loja"
                        className="w-full"
                    />
                </div>

                <div>
                    <Label htmlFor="name" className="block mb-2">
                        Nome da loja
                    </Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        placeholder="Exemplo: Lanchonete do Bio"
                        className="w-full"
                    />
                </div>

                <div>
                    <Label htmlFor="phone" className="block mb-2">
                        Telefone ou celular
                    </Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e => handlePhoneChange}
                        placeholder="Número de telefone ou celular da loja"
                        className="w-full"
                        maxLength={15}
                    />
                </div>

                <div>
                    <Label htmlFor="specialty" className="block mb-2">
                        Especialidade
                    </Label>
                    <Select
                        value={formData.specialty}
                        onValueChange={(value) => updateFormData({ specialty: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                            {specialties.map((specialty) => (
                                <SelectItem key={specialty.value} value={specialty.value}>
                                    {specialty.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}