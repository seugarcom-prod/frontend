"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RestaurantUnit } from "./AddRestaurantUnit";

interface Manager {
    id: string;
    name: string;
}

interface UnitManagersFormProps {
    selectedManagers: string[];
    updateUnit: (data: Partial<RestaurantUnit>) => void;
}

export default function UnitManagersForm({
    selectedManagers,
    updateUnit,
}: UnitManagersFormProps) {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulando uma chamada de API para buscar gerentes
        setIsLoading(true);
        setTimeout(() => {
            // Dados simulados
            setManagers([
                { id: "1", name: "Matheus Queiroz" },
                { id: "2", name: "Vinícius dos Santos" },
                { id: "3", name: "João da Silva" },
                { id: "4", name: "Raíssa Vieira" },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleToggleManager = (managerId: string) => {
        const newSelectedManagers = [...selectedManagers];
        const index = newSelectedManagers.indexOf(managerId);

        if (index === -1) {
            newSelectedManagers.push(managerId);
        } else {
            newSelectedManagers.splice(index, 1);
        }

        updateUnit({ managers: newSelectedManagers });
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
                {managers.map((manager) => (
                    <div
                        key={manager.id}
                        className="flex items-center gap-3 border border-border rounded-md p-4"
                    >
                        <Checkbox
                            id={`manager-${manager.id}`}
                            checked={selectedManagers.includes(manager.id)}
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