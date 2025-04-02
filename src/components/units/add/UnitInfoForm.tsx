"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RestaurantUnit } from "./AddRestaurantUnit";

interface UnitInfoFormProps {
  unit: RestaurantUnit;
  updateUnit: (data: Partial<RestaurantUnit>) => void;
  matrixCNPJ?: string; // Adicionar CNPJ da matriz como prop
}

export default function UnitInfoForm({ unit, updateUnit, matrixCNPJ }: UnitInfoFormProps) {
  const [cnpjPart1, setCnpjPart1] = useState(unit.cnpj.split('/')[0] || "");
  const [cnpjPart2, setCnpjPart2] = useState(
    unit.cnpj.includes('/') ? unit.cnpj.split('/')[1].split('-')[0] : ""
  );
  const [cnpjPart3, setCnpjPart3] = useState(
    unit.cnpj.includes('-') ? unit.cnpj.split('-')[1] : ""
  );

  // Efeito para atualizar os campos de CNPJ quando matrixCNPJ mudar ou quando useMatrixCNPJ for marcado
  useEffect(() => {
    if (unit.useMatrixCNPJ && matrixCNPJ) {
      // Formatar o CNPJ da matriz para os campos separados
      const formattedCNPJ = matrixCNPJ.replace(/[^\d]/g, '');
      if (formattedCNPJ.length >= 14) {
        const part1 = formattedCNPJ.substring(0, 8);
        const part2 = formattedCNPJ.substring(8, 12);
        const part3 = formattedCNPJ.substring(12, 14);

        setCnpjPart1(formatCnpjPart1(part1));
        setCnpjPart2(part2);
        setCnpjPart3(part3);

        // Atualizar o CNPJ completo no estado do componente pai
        updateCnpj(part1, part2, part3);
      }
    }
  }, [unit.useMatrixCNPJ, matrixCNPJ]);

  const handleCnpjPart1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!unit.useMatrixCNPJ) { // Somente permitir edição se não estiver usando CNPJ da matriz
      const value = e.target.value.replace(/\D/g, '');
      if (value.length <= 10) {
        setCnpjPart1(value);
        updateCnpj(value, cnpjPart2, cnpjPart3);
      }
    }
  };

  const handleCnpjPart2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!unit.useMatrixCNPJ) {
      const value = e.target.value.replace(/\D/g, '');
      if (value.length <= 4) {
        setCnpjPart2(value);
        updateCnpj(cnpjPart1, value, cnpjPart3);
      }
    }
  };

  const handleCnpjPart3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!unit.useMatrixCNPJ) {
      const value = e.target.value.replace(/\D/g, '');
      if (value.length <= 2) {
        setCnpjPart3(value);
        updateCnpj(cnpjPart1, cnpjPart2, value);
      }
    }
  };

  const updateCnpj = (part1: string, part2: string, part3: string) => {
    // Format: XX.XXX.XXX/YYYY-ZZ
    const part1Formatted = formatCnpjPart1(part1);
    const fullCnpj = `${part1Formatted}/${part2}-${part3}`;
    updateUnit({ cnpj: fullCnpj });
  };

  const formatCnpjPart1 = (value: string) => {
    // Format: XX.XXX.XXX
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
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
    <div className="flex flex-col w-full space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Informações da unidade</h2>
        <p className="text-sm text-gray-500 mb-4">
          Informe os dados do seu negócio.
        </p>
      </div>

      <div className="space-y-4">
        {/* Primeira linha: CNPJ e Razão social */}
        <div className="grid grid-cols-2 gap-4">
          {/* CNPJ */}
          <div>
            <Label htmlFor="cnpj" className="block mb-4">
              CNPJ
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="cnpj-part1"
                value={cnpjPart1}
                onChange={handleCnpjPart1Change}
                placeholder="12.345.678"
                className="w-[370px] h-10"
                disabled={unit.useMatrixCNPJ}
              />
              <span className="text-gray-500">/</span>
              <Input
                id="cnpj-part2"
                value={cnpjPart2}
                onChange={handleCnpjPart2Change}
                placeholder="0001"
                className="w-[80px] h-10"
                disabled={unit.useMatrixCNPJ}
              />
              <span className="text-gray-500">-</span>
              <Input
                id="cnpj-part3"
                value={cnpjPart3}
                onChange={handleCnpjPart3Change}
                placeholder="90"
                className="w-14 h-10"
                disabled={unit.useMatrixCNPJ}
              />
            </div>
            <div className="my-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="matrix-cnpj"
                  checked={unit.useMatrixCNPJ}
                  onCheckedChange={(checked) =>
                    updateUnit({ useMatrixCNPJ: checked as boolean })
                  }
                />
                <Label htmlFor="matrix-cnpj" className="text-sm font-normal cursor-pointer">
                  CNPJ baseado na matriz
                </Label>
              </div>
            </div>
          </div>

          {/* Razão social */}
          <div>
            <Label htmlFor="socialName" className="block mb-4">
              Razão social
            </Label>
            <Input
              id="socialName"
              value={unit.socialName}
              onChange={(e) => updateUnit({ socialName: e.target.value })}
              placeholder="Informe a razão social da loja"
              className="w-full h-10"
            />
          </div>
        </div>

        {/* Segunda linha: Nome da unidade, Telefone e Especialidade */}
        <div className="grid grid-cols-3 gap-4">
          {/* Nome da unidade */}
          <div>
            <Label htmlFor="unitName" className="block mb-4">
              Nome da unidade
            </Label>
            <Input
              id="unitName"
              value={unit.name}
              onChange={(e) => updateUnit({ name: e.target.value })}
              placeholder="Exemplo: Lanchonete do Bio"
              className="w-full h-10"
            />
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="phone" className="block mb-4">
              Telefone ou celular
            </Label>
            <Input
              id="phone"
              value={unit.phone}
              onChange={(e) => updateUnit({ phone: e.target.value })}
              placeholder="Número de telefone ou celular da unidade"
              className="w-full h-10"
            />
          </div>

          {/* Especialidade */}
          <div>
            <Label htmlFor="specialty" className="block mb-4">
              Especialidade
            </Label>
            <Select
              value={unit.specialty}
              onValueChange={(value) => updateUnit({ specialty: value })}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Açaí" />
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
    </div>
  );
}