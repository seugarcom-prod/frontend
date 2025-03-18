"use client";

import React, { useState } from "react";
import { Plus, Settings, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import UnitCard, { UnitStatus } from "./UnitCard";

// Tipo para representar uma unidade
interface Unit {
  id: string;
  name: string;
  manager: string;
  cnpj: string;
  status: UnitStatus;
  isTopSeller?: boolean;
}

export default function UnitsList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Dados de exemplo
  const units: Unit[] = [
    {
      id: "1",
      name: "Unidade bancários",
      manager: "Matheus Queiroz",
      cnpj: "12.345.678/0001-99",
      status: "active",
      isTopSeller: true
    },
    {
      id: "2",
      name: "Unidade Altiplano",
      manager: "Matheus Queiroz",
      cnpj: "12.345.678/0001-99",
      status: "outOfHours"
    },
    {
      id: "3",
      name: "Unidade Valentina",
      manager: "Matheus Queiroz",
      cnpj: "12.345.678/0001-99",
      status: "inactive"
    }
  ];

  // Filtrar unidades com base no termo de pesquisa
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.cnpj.includes(searchTerm)
  );

  // Função para alternar a seleção de uma unidade
  const toggleUnitSelection = (id: string) => {
    setSelectedUnits(prev =>
      prev.includes(id)
        ? prev.filter(unitId => unitId !== id)
        : [...prev, id]
    );
  };

  // Função para selecionar ou desselecionar todas as unidades
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(filteredUnits.map(unit => unit.id));
    }
    setSelectAll(!selectAll);
  };

  // Função para desabilitar as unidades selecionadas
  const disableSelectedUnits = () => {
    console.log("Desabilitar unidades:", selectedUnits);
    // Implementação real aqui
  };

  // Função para excluir as unidades selecionadas
  const deleteSelectedUnits = () => {
    console.log("Excluir unidades:", selectedUnits);
    // Implementação real aqui
  };

  const handleRegisterRestaurantUnit = () => {
    router.push("/restaurant/unit/register");
  };

  return (
    <div className={`w-full flex flex-col p-3 ${selectedUnits.length > 0 && 'border-b border-border'}`}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="default"
          className="font-medium cursor-pointer bg-secondary text-primary border border-border hover:bg-primary hover:text-secondary"
          onClick={handleRegisterRestaurantUnit}
        >
          <Label className="cursor-pointer">Criar nova unidade</Label>
          <Plus className="ml-2" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-sm h-10 w-10 border border-border hover:bg-primary hover:text-secondary">
          <Settings size={22} />
        </Button>
      </div >

      <div className="flex flex-row justify-center items-center mt-6 gap-4">
        <div className="w-full relative space-y-2">
          <Input
            type="text"
            placeholder="Placeholder"
            className="w-full h-10 border-border rounded-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-sm h-10 w-10 border border-border hover:bg-primary hover:text-secondary">
          <Settings2 />
        </Button>
      </div>

      <div className="flex flex-row w-full justify-end items-center gap-4 py-4">
        <label htmlFor="select-all" className="text-sm text-primary">
          Selecionar todas
        </label>
        <Checkbox
          id="select-all"
          checked={selectAll}
          onCheckedChange={toggleSelectAll}
          className="h-5 w-5 rounded-none data-[state=checked]:bg-primary data-[state=checked]:border-border border-border"
        />
      </div>

      <div className="space-y-4">
        {filteredUnits.map((unit) => (
          <UnitCard
            key={unit.id}
            id={unit.id}
            name={unit.name}
            manager={unit.manager}
            cnpj={unit.cnpj}
            status={unit.status}
            isTopSeller={unit.isTopSeller}
            isSelected={selectedUnits.includes(unit.id)}
            onToggleSelection={toggleUnitSelection}
          />
        ))}
      </div>

      {selectedUnits.length > 0 && (
        <div className="fixed justify-center items-center bottom-10 right-1/4 flex gap-8">
          <Button
            variant="outline"
            onClick={disableSelectedUnits}
            className="rounded-sm text-primary text-sm h-9 px-4 border-border bg-background hover:bg-primary hover:text-primary-foreground"
          >
            Desabilitar unidades
          </Button>
          <Button
            variant="outline"
            onClick={deleteSelectedUnits}
            className="rounded-sm text-primary text-sm h-9 px-4 border-border bg-background hover:bg-primary hover:text-primary-foreground"
          >
            Excluir unidades
          </Button>
        </div>
      )}
    </div>
  );
}