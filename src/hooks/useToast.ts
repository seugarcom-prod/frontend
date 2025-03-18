// hooks/useToast.ts
import { useContext } from "react"
import { ToastActionElement, ToastProps } from "@/components/ui/toast"
import { ToastContext } from "@/components/toast/toastContext"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | {
        type: ActionType["ADD_TOAST"]
        toast: ToasterToast
    }
    | {
        type: ActionType["UPDATE_TOAST"]
        toast: Partial<ToasterToast>
    }
    | {
        type: ActionType["DISMISS_TOAST"]
        toastId?: string
    }
    | {
        type: ActionType["REMOVE_TOAST"]
        toastId?: string
    }

interface ToastState {
    toasts: ToasterToast[]
}

export type Toast = Omit<ToasterToast, "id">

function toastReducer(state: ToastState, action: Action): ToastState {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
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

            // If no toast id is provided, dismiss all
            if (toastId === undefined) {
                return {
                    ...state,
                    toasts: state.toasts.map((t) => ({
                        ...t,
                        open: false,
                    })),
                }
            }

            // Find the toast index and set it to open: false
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId ? { ...t, open: false } : t
                ),
            }
        }

        case actionTypes.REMOVE_TOAST: {
            const { toastId } = action

            // If no toast id is provided, remove all closed toasts
            if (toastId === undefined) {
                return {
                    ...state,
                    toasts: state.toasts.filter((t) => t.open !== false),
                }
            }

            // Find the toast index and remove it
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== toastId),
            }
        }
    }
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }

    // Expose both toasts array and dispatch functions
    const { toasts, dispatch } = context

    function toast({ ...props }: Toast) {
        const id = genId()

        const update = (props: Toast) =>
            dispatch({
                type: actionTypes.UPDATE_TOAST,
                toast: { ...props, id },
            })

        const dismiss = () =>
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

        dispatch({
            type: actionTypes.ADD_TOAST,
            toast: {
                ...props,
                id,
                open: true,
                onOpenChange: (open: boolean) => {
                    if (!open) dismiss()
                },
            },
        })

        return {
            id,
            dismiss,
            update,
        }
    }

    function dismissToast(toastId?: string) {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
    }

    return {
        toast,
        dismiss: dismissToast,
        toasts, // Explicitly expose the toasts array
    }
}