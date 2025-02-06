import React from 'react'
import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"

interface simpleCardConfig extends LucideProps {
    icon: keyof typeof dynamicIconImports;
    title: string;
    description: string;
    backgroundColor: string;
}

export default function SimpleCard({ description, icon, title, backgroundColor }: simpleCardConfig) {
    const IconComponent = dynamic(dynamicIconImports[icon])

    return (
        <Card className='cursor-pointer'>
            <CardHeader>
                <div>
                    <button className={`flex items-center justify-center w-9 h-9 rounded-full ${backgroundColor}`}>
                        <IconComponent name={icon} color="#000000" />
                    </button>
                </div>
                <div className='pt-3'>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    )
}
