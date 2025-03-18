"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Schedule {
    days: string[];
    opens: string;
    closes: string;
}

interface RestaurantScheduleFormProps {
    formData: {
        schedules: Schedule[];
    };
    updateFormData: (data: Partial<{
        schedules: Schedule[];
    }>) => void;
}

const weekDays = [
    { id: "dom", label: "D", fullName: "Domingo" },
    { id: "seg", label: "S", fullName: "Segunda" },
    { id: "ter", label: "T", fullName: "Terça" },
    { id: "qua", label: "Q", fullName: "Quarta" },
    { id: "qui", label: "Q", fullName: "Quinta" },
    { id: "sex", label: "S", fullName: "Sexta" },
    { id: "sab", label: "S", fullName: "Sábado" },
];

export default function RestaurantScheduleForm({ formData, updateFormData }: RestaurantScheduleFormProps) {
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState("--:--");
    const [closeTime, setCloseTime] = useState("--:--");
    const [useMatrixSchedule, setUseMatrixSchedule] = useState(false);

    const handleToggleDay = (dayId: string) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleToggleMatrixSchedule = (checked: boolean) => {
        setUseMatrixSchedule(checked);
    };

    const handleAddSchedule = () => {
        if (selectedDays.length > 0 && openTime !== "--:--" && closeTime !== "--:--") {
            const newSchedules = [
                ...formData.schedules,
                {
                    days: [...selectedDays],
                    opens: openTime,
                    closes: closeTime
                }
            ];

            updateFormData({ schedules: newSchedules });

            // Reset selection for next input
            setSelectedDays([]);
            setOpenTime("--:--");
            setCloseTime("--:--");
        }
    };

    const handleDeleteSchedule = (index: number) => {
        const newSchedules = [...formData.schedules];
        newSchedules.splice(index, 1);
        updateFormData({ schedules: newSchedules });
    };

    // Render a single day selection button
    const DayButton = ({ day }: { day: typeof weekDays[0] }) => (
        <div
            onClick={() => handleToggleDay(day.id)}
            className={`w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer text-sm 
        ${selectedDays.includes(day.id) ? 'bg-gray-200 border-border' : 'bg-white border-border text-gray-600'}`}
        >
            {day.label}
        </div>
    );

    return (
        <div className="space-y-6 w-full">

            <div className="flex">
                {/* Lado esquerdo - Configurador de horários */}
                <div className="w-2/3 pr-4 border-r border-border">
                    <div>
                        <h2 className="text-lg font-medium mb-1">Horários de funcionamento</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Informe os horários de funcionamento para que os clientes saibam quando acessar sua loja.
                        </p>
                    </div>
                    <div className="space-y-6 pt-4 w-full">
                        <div className="flex w-full justify-between">
                            <div className="pr-2">
                                <Label className="block mb-2">Abre</Label>
                                <Input
                                    type="time"
                                    value={openTime}
                                    onChange={(e) => setOpenTime(e.target.value)}
                                    placeholder="--:--"
                                    className="w-full p-2 border border-border rounded-md"
                                />
                            </div>

                            <div className="pl-2">
                                <Label className="block mb-2">Fecha</Label>
                                <Input
                                    type="time"
                                    value={closeTime}
                                    onChange={(e) => setCloseTime(e.target.value)}
                                    placeholder="--:--"
                                    className="w-full p-2 border border-border rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between w-full">
                            {weekDays.map(day => (
                                <div
                                    key={day.id}
                                    onClick={() => handleToggleDay(day.id)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md border cursor-pointer text-sm
                    ${selectedDays.includes(day.id)
                                            ? 'bg-gray-200 border-border font-medium'
                                            : 'bg-white border-border text-gray-600'}`}
                                >
                                    {day.label}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleAddSchedule}
                                className="w-full py-2 text-sm text-gray-600 border border-border rounded-md bg-white hover:bg-gray-50"
                            >
                                Adicionar horário
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lado direito - Lista de horários configurados */}
                <div className="w-1/2 pl-4 space-y-4">
                    {formData.schedules.map((schedule, index) => (
                        <div key={index} className="border border-border rounded-md p-4 relative">
                            <div className="flex flex-wrap gap-1 mb-4">
                                {schedule.days.map(dayId => {
                                    const day = weekDays.find(d => d.id === dayId);
                                    return day ? (
                                        <div key={dayId} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                                            {day.fullName}
                                        </div>
                                    ) : null;
                                })}
                            </div>

                            <div className="grid grid-cols-2">
                                <div>
                                    <Label className="text-xs text-gray-500 block">Abre às:</Label>
                                    <div className="text-sm font-medium">{schedule.opens}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 block">Fecha às:</Label>
                                    <div className="text-sm font-medium">{schedule.closes}</div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteSchedule(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}