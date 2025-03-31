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
import { useIsMobile } from "@/hooks/useMobile";
import {
    formatCnpj,
    handleCnpjChange,
    handleCnpjPart1Change,
    handleCnpjPart2Change,
    handleCnpjPart3Change,
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
    const isMobile = useIsMobile();

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

    // Modificar para corresponder às imagens
    const handleCnpjPart1ChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
        updateFormData({ cnpjPart1: formattedValue });
    };

    const handleCnpjPart2ChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = value.replace(/\D/g, '').slice(0, 4);
        updateFormData({ cnpjPart2: formattedValue });
    };

    const handleCnpjPart3ChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = value.replace(/\D/g, '').slice(0, 2);
        updateFormData({ cnpjPart3: formattedValue });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Aceita qualquer entrada, mas remove caracteres que não sejam dígitos, espaços, parênteses ou hífen
        const value = e.target.value.replace(/[^\d\s()-]/g, '');
        updateFormData({ phone: value });
    };

    // Formata ao sair do campo
    const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '');

        if (digits.length === 0) {
            // Campo vazio, não formatar
            return;
        }

        let formattedValue;
        if (digits.length <= 10) {
            // Telefone fixo
            formattedValue = digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            // Celular (11 dígitos)
            formattedValue = digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        updateFormData({ phone: formattedValue });
    };

    const isValidPhone = (phone: string): boolean => {
        // Remove tudo que não for dígito
        const digits = phone.replace(/\D/g, '');

        // Validação básica - número de dígitos
        // Telefone fixo: 10 dígitos (com DDD)
        // Celular: 11 dígitos (com DDD)
        return digits.length === 10 || digits.length === 11;
    };

    // Função para validar o número do telefone antes de enviar
    const validatePhone = () => {
        if (!formData.phone) return true; // Opcional, não valida se estiver vazio
        return isValidPhone(formData.phone);
    };

    const specialties = [
        { value: "acai", label: "Açaí" },
        { value: "pizza", label: "Pizza" },
        { value: "hamburger", label: "Hamburger" },
        { value: "japanese", label: "Japonesa" },
        { value: "brazilian", label: "Brasileira" },
        { value: "italian", label: "Italiana" },
        { value: "restaurant", label: "Restaurante" },
        { value: "cafeteria", label: "Cafeteria" },
        { value: "bakery", label: "Padaria" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Informações da loja</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Informe os dados do seu negócio.
                </p>
            </div>

            <div className="space-y-6">
                {/* No mobile, adaptar a visualização do CNPJ para ficar mais compacta */}
                {isMobile ? (
                    <div>
                        <Label htmlFor="cnpj" className="block mb-2">
                            CNPJ
                        </Label>
                        <Input
                            id="cnpj"
                            value={`${formData.cnpjPart1}/${formData.cnpjPart2}-${formData.cnpjPart3}`}
                            onChange={(e) => {
                                const value = e.target.value;
                                const cnpj = value.replace(/\D/g, '');

                                if (cnpj.length <= 8) {
                                    const formattedValue = cnpj.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
                                    updateFormData({
                                        cnpjPart1: formattedValue,
                                        cnpjPart2: '',
                                        cnpjPart3: ''
                                    });
                                } else if (cnpj.length <= 12) {
                                    const part1 = cnpj.substring(0, 8).replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
                                    const part2 = cnpj.substring(8);
                                    updateFormData({
                                        cnpjPart1: part1,
                                        cnpjPart2: part2,
                                        cnpjPart3: ''
                                    });
                                } else {
                                    const part1 = cnpj.substring(0, 8).replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
                                    const part2 = cnpj.substring(8, 12);
                                    const part3 = cnpj.substring(12, 14);
                                    updateFormData({
                                        cnpjPart1: part1,
                                        cnpjPart2: part2,
                                        cnpjPart3: part3
                                    });
                                }
                            }}
                            placeholder="12.345.678/0001-90"
                            className="w-full"
                        />
                    </div>
                ) : (
                    <div>
                        <Label htmlFor="cnpj" className="block mb-2">
                            CNPJ
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="cnpj-part1"
                                value={formData.cnpjPart1}
                                onChange={handleCnpjPart1ChangeWrapper}
                                placeholder="12.345.678"
                                className="w-full"
                            />
                            <span className="text-gray-500">/</span>
                            <Input
                                id="cnpj-part2"
                                value={formData.cnpjPart2}
                                onChange={handleCnpjPart2ChangeWrapper}
                                placeholder="0001"
                                className="w-24"
                            />
                            <span className="text-gray-500">-</span>
                            <Input
                                id="cnpj-part3"
                                value={formData.cnpjPart3}
                                onChange={handleCnpjPart3ChangeWrapper}
                                placeholder="90"
                                className="w-14"
                            />
                        </div>
                    </div>
                )}

                {isCnpjComplete() && !validateCnpj() && (
                    <p className="text-red-500 text-sm mt-1">CNPJ inválido</p>
                )}

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
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        placeholder="Número de telefone ou celular da loja"
                        className="w-full"
                        maxLength={15}
                    />
                    {formData.phone && !validatePhone() && (
                        <p className="text-red-500 text-sm mt-1">
                            Telefone inválido
                        </p>
                    )}
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