"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { RestaurantUnit, Schedule } from "./AddRestaurantUnit";
import { Input } from "@/components/ui/input";

interface UnitScheduleFormProps {
    useMatrixSchedule: boolean;
    schedules: Schedule[];
    updateUnit: (data: Partial<RestaurantUnit>) => void;
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

// Grupos de dias pré-definidos para o exemplo
const dayGroups = [
    {
        days: ["qui", "sex", "sab"],
        opens: "08:00",
        closes: "14:00"
    },
    {
        days: ["seg", "qua"],
        opens: "08:00",
        closes: "14:00"
    },
    {
        days: ["ter", "qui"],
        opens: "08:00",
        closes: "14:00"
    },
    {
        days: ["dom"],
        opens: "08:00",
        closes: "14:00"
    }
];

export default function UnitScheduleForm({
    useMatrixSchedule,
    schedules,
    updateUnit,
}: UnitScheduleFormProps) {
    const [daySchedules, setDaySchedules] = useState(
        schedules.length > 0
            ? schedules.reduce((acc, schedule) => {
                const existingGroup = acc.find(
                    (g) => g.opens === schedule.opens && g.closes === schedule.closes
                );

                if (existingGroup) {
                    if (!existingGroup.days.includes(schedule.day)) {
                        existingGroup.days.push(schedule.day);
                    }
                } else {
                    acc.push({
                        days: [schedule.day],
                        opens: schedule.opens,
                        closes: schedule.closes,
                    });
                }

                return acc;
            }, [] as typeof dayGroups)
            : dayGroups
    );

    // Estado para rastrear os dias selecionados para o novo horário
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState("--:--");
    const [closeTime, setCloseTime] = useState("--:--");

    const handleToggleMatrixSchedule = (checked: boolean) => {
        updateUnit({ useMatrixSchedule: checked });
    };

    const handleToggleDay = (dayId: string) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleAddSchedule = () => {
        if (selectedDays.length > 0 && openTime !== "--:--" && closeTime !== "--:--") {
            setDaySchedules(prev => {
                const newSchedules = [...prev, {
                    days: [...selectedDays],
                    opens: openTime,
                    closes: closeTime
                }];

                updateSchedulesInParent(newSchedules);

                // Reset selection for next input
                setSelectedDays([]);
                setOpenTime("--:--");
                setCloseTime("--:--");

                return newSchedules;
            });
        }
    };

    const handleDeleteSchedule = (index: number) => {
        setDaySchedules(prev => {
            const newSchedules = [...prev];
            newSchedules.splice(index, 1);
            updateSchedulesInParent(newSchedules);
            return newSchedules;
        });
    };

    const updateSchedulesInParent = (groups: typeof dayGroups) => {
        const flatSchedules = groups.flatMap(group =>
            group.days.map(day => ({
                day,
                opens: group.opens,
                closes: group.closes
            }))
        );

        updateUnit({ schedules: flatSchedules });
    };

    const DayButton = ({ day, label, selected, onClick }: { day: string, label: string, selected: boolean, onClick: () => void }) => (
        <div
            onClick={onClick}
            className={`w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer text-md font-semibold
                hover:text-primary-foreground hover:bg-dark-background-default 
                ${selected ? 'bg-gray-200 border' : 'bg-white border-border text-dark-background-default'}`}
        >
            {label}
        </div>
    );

    const DayPill = ({ day }: { day: string }) => {
        const weekDay = weekDays.find(d => d.id === day);
        return (
            <div className="px-3 py-1 rounded-full text-sm bg-background text-secondary-foreground">
                {weekDay?.fullName}
            </div>
        );
    };

    return (
        <div className="space-y-6 w-full">

            <div className="space-y-4">
                <div className="mt-8 space-y-8 grid grid-cols-2 gap-8" >
                    {/* Lado esquerdo - Formulário de adição de horário */}
                    <div className="space-y-6 w-full pr-8 border-r border-border">
                        <div>
                            <h2 className="text-lg font-medium mb-1">Horário de funcionamento</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Informe os horários de funcionamento para que os clientes saibam quando acessar sua loja.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="matrix-schedule"
                                checked={useMatrixSchedule}
                                onCheckedChange={(checked) =>
                                    handleToggleMatrixSchedule(checked as boolean)
                                }
                            />
                            <Label htmlFor="matrix-schedule" className="text-sm font-normal cursor-pointer">
                                Utilizar horários da matriz
                            </Label>
                        </div>
                        <div className="space-y-6 pt-4">
                            <div className="flex w-full justify-between">
                                <div className="pr-2 w-full">
                                    <Label className="block mb-2">Abre</Label>
                                    <Input
                                        type="time"
                                        value={openTime}
                                        onChange={(e) => setOpenTime(e.target.value)}
                                        className="w-full p-2 border border-border rounded-md justify-between"
                                        placeholder="--:--"
                                    />
                                </div>

                                <div className="pl-2 w-full">
                                    <Label className="block mb-2">Fecha</Label>
                                    <Input
                                        type="time"
                                        value={closeTime}
                                        onChange={(e) => setCloseTime(e.target.value)}
                                        className="w-full p-2 border border-border rounded-md"
                                        placeholder="--:--"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-2 flex-wrap">
                                {weekDays.map(day => (
                                    <DayButton
                                        key={day.id}
                                        day={day.id}
                                        label={day.label}
                                        selected={selectedDays.includes(day.id)}
                                        onClick={() => handleToggleDay(day.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={handleAddSchedule}
                                className="w-52 text-sm py-2 border border-border shadow-sm"
                                disabled={selectedDays.length === 0 || openTime === "--:--" || closeTime === "--:--"}
                            >
                                Adicionar horário
                            </Button>
                        </div>
                    </div>

                    {/* Lado direito - Lista de horários */}
                    <div className="space-y-4">
                        {daySchedules.map((group, idx) => (
                            <div key={idx} className="border border-border rounded-md p-4 flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-1">
                                        {group.days.map(dayId => (
                                            <DayPill key={dayId} day={dayId} />
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-500">Abre às:</Label>
                                            <div className="text-sm font-medium">{group.opens}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Fecha às:</Label>
                                            <div className="text-sm font-medium">{group.closes}</div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteSchedule(idx)}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}