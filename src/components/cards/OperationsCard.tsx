import React from 'react'
import dynamic from 'next/dynamic'
import { LucideProps, TrendingUp } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { ChartConfig } from '@/components/ui/chart';

export const chartConfig = {
    month: {
        label: "Month",
        color: "#2563eb",
    },
    actualMonth: {
        label: "Actual Month",
        color: "#db2777",
    },
} satisfies ChartConfig

interface simpleCardConfig extends LucideProps {
    icon: keyof typeof dynamicIconImports;
    title: string;
    chartDescription?: string;
    backgroundColor: string;
    canceled: number;
    quantity: number;
    inProduction: number;
    hasChart?: boolean;
}

export default function InformativeCard({
    icon,
    title,
    canceled,
    quantity,
    inProduction,
    chartDescription,
    backgroundColor,
    hasChart = false
}: simpleCardConfig) {
    const IconComponent = dynamic(dynamicIconImports[icon])

    return (
        <Card className='flex flex-col flex-wrap w-full h-fit'>
            <CardHeader className='w-full flex flex-row justify-between items-center align-center'>
                <div className='flex flex-row items-center align-center gap-2'>
                    <button className={`flex items-center justify-center w-10 h-10 rounded-full ${backgroundColor}`}>
                        <IconComponent size={30} name={icon} color="#000000" />
                    </button>
                    <CardTitle>{title}</CardTitle>
                </div>
                <CardTitle className='mr-2 text-lg'>Ver detalhes</CardTitle>
            </CardHeader>
            <CardDescription className='w-full flex flex-row p-4 justify-between'>
                <div className='flex flex-col px-4'>
                    <span className='text-lg text-zinc-400 text-start'>
                        Realizados hoje
                    </span>
                    <p className='flex flex-row justify-end gap-1 text-lime-500 font-semibold text-lg'>
                        <TrendingUp />
                        {quantity}
                    </p>
                </div>
                <div className='border-r border-zinc-700' />
                <div className='flex flex-col px-4'>
                    <span className='text-lg text-zinc-400 flex justify-end'>
                        Cancelados
                    </span>
                    <p className='flex flex-row gap-1 justify-end text-lime-500 font-semibold text-lg'>
                        <TrendingUp />
                        {canceled}
                    </p>
                </div>
                <div className='border-r border-zinc-700' />
                <div className='flex flex-col px-4'>
                    <span className='text-lg text-zinc-400 text-start'>
                        Em produção
                    </span>
                    <p className='flex flex-row justify-end gap-1 text-lime-500 font-semibold text-lg'>
                        <TrendingUp />
                        {inProduction}
                    </p>
                </div>
            </CardDescription>
        </Card>
    )
}
