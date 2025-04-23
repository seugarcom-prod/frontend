"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { useRestaurantUnitFormStore } from "@/stores";

const weekDays = [
    { id: "dom", label: "D", fullName: "Domingo" },
    { id: "seg", label: "S", fullName: "Segunda" },
    { id: "ter", label: "T", fullName: "Terça" },
    { id: "qua", label: "Q", fullName: "Quarta" },
    { id: "qui", label: "Q", fullName: "Quinta" },
    { id: "sex", label: "S", fullName: "Sexta" },
    { id: "sab", label: "S", fullName: "Sábado" },
];

export default function UnitScheduleForm() {
    const { unitData, updateUnitData } = useRestaurantUnitFormStore();
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState("--:--");
    const [closeTime, setCloseTime] = useState("--:--");
    const toast = useToast();

    const handleToggleMatrixSchedule = (checked: boolean) => {
        updateUnitData({ useMatrixSchedule: checked });
    };

    const handleToggleDay = (dayId: string) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleAddSchedule = () => {
        if (selectedDays.length > 0) {
            const newSchedule = {
                days: selectedDays,
                opens: openTime,
                closes: closeTime,
            };

            updateUnitData({ schedules: [...unitData.schedules, newSchedule] });
            setSelectedDays([]);
            setOpenTime("--:--");
            setCloseTime("--:--");
        }
    };

    const handleDeleteSchedule = (index: number) => {
        const newSchedules = [...unitData.schedules];
        newSchedules.splice(index, 1);
        updateUnitData({ schedules: newSchedules });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Adicionar nova unidade</h1>
                <button className="text-gray-500">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Coluna da esquerda */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Horário de funcionamento</h2>
                        <p className="text-sm text-gray-500">
                            Informe os horários de funcionamento para que os clientes saibam quando acessar sua loja.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <Checkbox
                            checked={unitData.useMatrixSchedule}
                            onCheckedChange={handleToggleMatrixSchedule}
                            className="data-[state=checked]:bg-black"
                        />
                        <Label className="text-sm">Utilizar horários da matriz</Label>
                    </div>

                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Abre</Label>
                                <Input
                                    type="time"
                                    value={openTime}
                                    onChange={(e) => setOpenTime(e.target.value)}
                                    placeholder="--:--"
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label>Fecha</Label>
                                <Input
                                    type="time"
                                    value={closeTime}
                                    onChange={(e) => setCloseTime(e.target.value)}
                                    placeholder="--:--"
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {weekDays.map((day) => (
                            <button
                                key={day.id}
                                onClick={() => handleToggleDay(day.id)}
                                className={`
                                h-10 w-10 rounded-lg flex items-center justify-center text-sm
                                ${selectedDays.includes(day.id)
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'bg-white border border-gray-200 text-gray-600'
                                    }
                            `}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleAddSchedule}
                        className="w-full border-dashed"
                        disabled={selectedDays.length === 0}
                    >
                        Adicionar horário
                    </Button>
                </div>

                {/* Coluna da direita */}
                <div className="space-y-4">
                    {unitData.schedules.map((schedule, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-wrap gap-1">
                                    {schedule.days.map(dayId => {
                                        const day = weekDays.find(d => d.id === dayId);
                                        return day && (
                                            <span
                                                key={dayId}
                                                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                            >
                                                {day.fullName}
                                            </span>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteSchedule(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 text-sm text-gray-500">
                                <div>
                                    <p>Abre às:</p>
                                    <p className="text-gray-900">{schedule.opens}</p>
                                </div>
                                <div>
                                    <p>Fecha às:</p>
                                    <p className="text-gray-900">{schedule.closes}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}