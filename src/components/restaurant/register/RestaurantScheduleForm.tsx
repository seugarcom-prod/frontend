"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/useMobile";

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
    const isMobile = useIsMobile();
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState("08:00");
    const [closeTime, setCloseTime] = useState("14:00");

    const handleToggleDay = (dayId: string) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleAddSchedule = () => {
        if (selectedDays.length > 0) {
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
        }
    };

    const handleDeleteSchedule = (index: number) => {
        const newSchedules = [...formData.schedules];
        newSchedules.splice(index, 1);
        updateFormData({ schedules: newSchedules });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-1">Horários de funcionamento</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Informe os horários de funcionamento para que os clientes saibam quando acessar sua loja.
                </p>
            </div>

            {isMobile ? (
                // Layout para Mobile (mais compacto)
                <div className="space-y-6">
                    {/* Inputs de horário para mobile */}
                    <div className="space-y-4">
                        <div>
                            <Label className="block mb-2">Abre</Label>
                            <Input
                                type="time"
                                value={openTime}
                                onChange={(e) => setOpenTime(e.target.value)}
                                placeholder="--:--"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className="block mb-2">Fecha</Label>
                            <Input
                                type="time"
                                value={closeTime}
                                onChange={(e) => setCloseTime(e.target.value)}
                                placeholder="--:--"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Grid de dias da semana para mobile */}
                    <div className="grid grid-cols-7 gap-1 w-full my-4">
                        {weekDays.map(day => (
                            <div
                                key={day.id}
                                className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer text-sm
                                    ${selectedDays.includes(day.id)
                                        ? 'bg-gray-200 font-medium'
                                        : 'bg-white border border-gray-300 text-gray-600'}`}
                                onClick={() => handleToggleDay(day.id)}
                            >
                                {day.label}
                            </div>
                        ))}
                    </div>

                    {/* Botão para adicionar horário no mobile */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSchedule}
                        className="w-full py-2 border-dashed text-gray-500"
                        disabled={selectedDays.length === 0}
                    >
                        Adicionar horário
                    </Button>

                    {/* Lista de horários configurados para mobile */}
                    <div className="space-y-3 mt-4">
                        {formData.schedules.map((schedule, index) => (
                            <div key={index} className="border rounded-md p-3 relative">
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {schedule.days.map(dayId => {
                                        const day = weekDays.find(d => d.id === dayId);
                                        return day ? (
                                            <div
                                                key={dayId}
                                                className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs"
                                            >
                                                {day.fullName}
                                            </div>
                                        ) : null;
                                    })}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500">Abre às:</div>
                                        <div className="text-sm font-medium">{schedule.opens}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-gray-500">Fecha às:</div>
                                        <div className="text-sm font-medium">{schedule.closes}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSchedule(index)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Layout para Desktop (como nas imagens)
                <div className="space-y-6">
                    <div className="flex">
                        {/* Lado esquerdo - Configurador de horários */}
                        <div className="w-1/2 pr-6 border-r border-gray-200">
                            <div className="space-y-6">
                                {/* Inputs de horário e dias da semana */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block mb-2">Abre</Label>
                                        <Input
                                            type="time"
                                            value={openTime}
                                            onChange={(e) => setOpenTime(e.target.value)}
                                            placeholder="--:--"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label className="block mb-2">Fecha</Label>
                                        <Input
                                            type="time"
                                            value={closeTime}
                                            onChange={(e) => setCloseTime(e.target.value)}
                                            placeholder="--:--"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Visualização da seleção dos dias da semana em grid */}
                                <div className="grid grid-cols-7 gap-2 w-full text-center my-4">
                                    {weekDays.map(day => (
                                        <div key={day.id} className="text-center text-sm">{day.label}</div>
                                    ))}
                                </div>

                                {/* Seleção de dias para novo horário */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {weekDays.map(day => (
                                        <button
                                            key={day.id}
                                            type="button"
                                            onClick={() => handleToggleDay(day.id)}
                                            className={`px-3 py-1 text-sm rounded-full border ${selectedDays.includes(day.id)
                                                ? 'bg-gray-100 border-gray-400 font-medium'
                                                : 'bg-white border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {day.fullName}
                                        </button>
                                    ))}
                                </div>

                                {/* Botão para adicionar novo horário */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddSchedule}
                                    className="w-full py-2 border-dashed text-gray-500"
                                    disabled={selectedDays.length === 0}
                                >
                                    Adicionar horário
                                </Button>
                            </div>
                        </div>

                        {/* Lado direito - Lista de horários configurados */}
                        <div className="w-1/2 pl-6 space-y-4">
                            {formData.schedules.map((schedule, index) => (
                                <div key={index} className="border rounded-md p-4 relative">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {schedule.days.map(dayId => {
                                            const day = weekDays.find(d => d.id === dayId);
                                            return day ? (
                                                <div
                                                    key={dayId}
                                                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
                                                >
                                                    {day.fullName}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-gray-500">Abre às:</div>
                                            <div className="font-medium">{schedule.opens}</div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-500">Fecha às:</div>
                                            <div className="font-medium">{schedule.closes}</div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSchedule(index)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {formData.schedules.length === 0 && (
                                <div className="text-center py-6 text-gray-500">
                                    Nenhum horário configurado
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}