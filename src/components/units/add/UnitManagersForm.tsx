"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { useRestaurantUnitFormStore } from "@/stores";

interface Manager {
    id: string;
    name: string;
}

export default function UnitManagersForm() {
    const { unitData, updateUnitData } = useRestaurantUnitFormStore();
    const [availableManagers, setAvailableManagers] = useState<Manager[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetch(`${API_URL}/managers`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });

                if (!response.ok) throw new Error('Falha ao carregar gerentes');

                const data = await response.json();
                setAvailableManagers(data);
            } catch (error) {
                toast.toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Não foi possível carregar a lista de gerentes"
                });
            }
        };

        fetchManagers();
    }, []);

    const handleToggleManager = (managerId: string) => {
        const newSelectedManagers = [...unitData.managers];
        const index = newSelectedManagers.findIndex(manager => manager.id === managerId);

        if (index === -1) {
            const managerToAdd = availableManagers.find(manager => manager.id === managerId);
            if (managerToAdd) {
                newSelectedManagers.push(managerToAdd);
            }
        } else {
            newSelectedManagers.splice(index, 1);
        }

        updateUnitData({ managers: newSelectedManagers });
    };

    if (isLoading) {
        return <div className="py-8 text-center">Carregando gerentes...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Responsáveis da unidade</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Selecione os usuários que irão gerenciar a unidade. Esses usuários poderão ser editados posteriormente.
                </p>
            </div>

            <div className="space-y-2">
                {unitData.managers.map((manager) => (
                    <div
                        key={unitData.managers[0].id}
                        className="flex items-center gap-3 border border-border rounded-md p-4"
                    >
                        <Checkbox
                            id={`manager-${manager.id}`}
                            checked={unitData.managers.includes({ ...manager, id: manager.id })}
                            onCheckedChange={() => handleToggleManager(manager.id)}
                        />
                        <Label
                            htmlFor={`manager-${manager.id}`}
                            className="font-normal cursor-pointer flex-1"
                        >
                            {manager.name}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

