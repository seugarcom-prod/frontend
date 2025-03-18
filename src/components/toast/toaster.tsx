// components/ui/toaster.tsx
"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/useToast"
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast"
import { JSX } from "react"

type ToastType = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: any;
}

export function Toaster() {
    const { toast, toasts = [] } = useToast()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }: ToastType) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}