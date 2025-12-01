import * as React from "react"

interface DialogProps {
    open: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

export function Dialog({ open, children }: DialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            {children}
        </div>
    )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-md p-4 max-w-md w-full">
            {children}
        </div>
    )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-2">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-sm text-gray-600">{children}</p>
}
