"use client";

import React from 'react';
import { CircleDollarSign, TrendingUp } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Chart } from '../charts';

// Configuração do gráfico
export const chartConfig = {
    month: {
        label: "Mês anterior",
        color: "#3b82f6", // blue-500
    },
};

interface ChartCardProps {
    icon: string;
    percentValue: string;
    totalReceipt: string;
}

export default function ChartCard({
    icon,
    percentValue,
    totalReceipt,
}: ChartCardProps) {
    const faturamentoData = [
        { name: "Abr", value: 437.90 },
        { name: "Mai", value: 100.98 },
        { name: "Jun", value: 387.79 },
        { name: "Jul", value: 303.75 },
        { name: "Ago", value: 200.00 },
        { name: "Set", value: 100.98 }
    ];

    return (
        <Card className="overflow-hidden border h-full border-border bg-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
                        <CircleDollarSign size={22} color="#FFFFFF" />
                    </div>
                    <CardTitle className="text-base font-medium text-primary">Faturamento</CardTitle>
                </div>
                <button className="text-sm text-gray-500 transition-colors hover:text-primary hover:underline">
                    Ver detalhes
                </button>
            </CardHeader>
            <CardContent className="px-2">
                <div className="flex justify-between items-center p-2 border-y border-border">
                    <div>
                        <p className="text-sm text-gray-500">Em relação ao mês passado</p>
                        <p className="flex items-center gap-1 text-green-500 font-medium">
                            <TrendingUp size={16} />
                            {percentValue}%
                        </p>
                    </div>
                    <div className="h-8 border-r border-border"></div>
                    <div>
                        <p className="text-sm text-gray-500 text-right">Receita total (R$)</p>
                        <p className="text-green-500 font-medium text-right">
                            R$ {totalReceipt}
                        </p>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-sm font-medium mb-2">Faturamento dos últimos 6 meses</p>
                    <div className="h-56 w-full">
                        <Chart data={faturamentoData} barColor="#14b8a6" highlightColor="#f97316" valuePrefix='R$' />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}