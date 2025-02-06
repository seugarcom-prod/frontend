"use client"
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export const chartConfig = {
    desktop: {
        label: "Month",
        color: "#2563eb",
    },
} satisfies ChartConfig

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        const handleResize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return size;
};

export const Chart = ({ config, className, variant = 'default' }: {
    config: ChartConfig,
    className?: string,
    variant?: 'default' | 'compact'
}) => {
    const [width] = useWindowSize();
    const isMobile = width < 768;

    const heightClass = variant === 'compact'
        ? isMobile ? "h-[100px]" : "h-[200px]"
        : isMobile ? "h-[150px]" : "h-[300px]";

    const barSizeValue = variant === 'compact' ? 20 : 30;

    return (
        <ChartContainer
            config={config}
            className={`${className} ${heightClass} w-full`}
        >
            <BarChart accessibilityLayer data={chartData}>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop-color)"
                    radius={4}
                    barSize={barSizeValue}
                    isAnimationActive={false}
                />
            </BarChart>
        </ChartContainer>
    );
};
