// components/ui/toast-context.tsx
"use client"

import { createContext, useReducer, ReactNode } from "react"

interface ToastType {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    [key: string]: any;
}

type ActionType = {
    ADD_TOAST: "ADD_TOAST"
    UPDATE_TOAST: "UPDATE_TOAST"
    DISMISS_TOAST: "DISMISS_TOAST"
    REMOVE_TOAST: "REMOVE_TOAST"
}

type Action =
    | {
        type: ActionType["ADD_TOAST"]
        toast: ToastType
    }
    | {
        type: ActionType["UPDATE_TOAST"]
        toast: Partial<ToastType>
    }
    | {
        type: ActionType["DISMISS_TOAST"]
        toastId?: string
    }
    | {
        type: ActionType["REMOVE_TOAST"]
        toastId?: string
    }

interface ToastContextProps {
    toasts: ToastType[] // Explicitly typed as ToastType array
    dispatch: React.Dispatch<Action>
}

export const ToastContext = createContext<ToastContextProps | undefined>(
    undefined
)

interface ToastState {
    toasts: ToastType[]
}

const initialState: ToastState = {
    toasts: [],
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

function toastReducer(state: ToastState, action: Action): ToastState {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, 5),
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action

            if (toastId === undefined) {
                return {
                    ...state,
                    toasts: state.toasts.map((t) => ({
                        ...t,
                        open: false,
                    })),
                }
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId ? { ...t, open: false } : t
                ),
            }
        }

        case actionTypes.REMOVE_TOAST: {
            const { toastId } = action

            if (toastId === undefined) {
                return {
                    ...state,
                    toasts: state.toasts.filter((t) => t.open !== false),
                }
            }

            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== toastId),
            }
        }
        default:
            return state
    }
}

interface ToastProviderProps {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [state, dispatch] = useReducer(toastReducer, initialState)

    return (
        <ToastContext.Provider value={{ toasts: state.toasts, dispatch }}>
            {children}
        </ToastContext.Provider>
    )
}