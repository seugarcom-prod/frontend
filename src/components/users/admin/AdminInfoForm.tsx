"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCpf } from "@/utils";

interface AdminInfoFormProps {
    formData: {
        adminName: string;
        adminCpf: string;
    };
    updateFormData: (data: Partial<{
        adminName: string;
        adminCpf: string;
    }>) => void;
}

export default function AdminInfoForm({ formData, updateFormData }: AdminInfoFormProps) {
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCpf = formatCpf(e.target.value);
        updateFormData({ adminCpf: formattedCpf });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Responsável pela rede</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Informes os dados da pessoa que tem o nome no contrato social da empresa.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <Label htmlFor="name" className="block mb-2">
                        Nome completo
                    </Label>
                    <Input
                        id="name"
                        value={formData.adminName}
                        onChange={(e) => updateFormData({ adminName: e.target.value })}
                        placeholder="Nome do responsável legal"
                        className="w-full"
                    />
                </div>

                <div>
                    <Label htmlFor="cpf" className="block mb-2">
                        CPF
                    </Label>
                    <Input
                        id="cpf"
                        value={formData.adminCpf}
                        onChange={handleCpfChange}
                        placeholder="Digite o CPF do responsável"
                        maxLength={14}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}