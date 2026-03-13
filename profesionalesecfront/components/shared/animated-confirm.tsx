"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, XCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "success" | "info" | "warning"
}

let confirmPromise: { resolve: (value: boolean) => void } | null = null

export function useAnimatedConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "Confirmar",
    message: "¿Estás seguro?",
    variant: "info"
  })

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts)
    setIsOpen(true)
    return new Promise((resolve) => {
      confirmPromise = { resolve }
    })
  }, [])

  const handleConfirm = () => {
    setIsOpen(false)
    confirmPromise?.resolve(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    confirmPromise?.resolve(false)
  }

  return {
    confirm,
    isOpen,
    options,
    handleConfirm,
    handleCancel
  }
}

export function AnimatedConfirm({
  isOpen,
  options,
  onConfirm,
  onCancel
}: {
  isOpen: boolean
  options: ConfirmOptions
  onConfirm: () => void
  onCancel: () => void
}) {
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const icons = {
    danger: <XCircle className="w-12 h-12 text-red-500" />,
    success: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
    warning: <AlertCircle className="w-12 h-12 text-amber-500" />
  }

  const colors = {
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-emerald-500 hover:bg-emerald-600",
    info: "bg-blue-500 hover:bg-blue-600",
    warning: "bg-amber-500 hover:bg-amber-600"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8"
          >
            <button
              onClick={onCancel}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-6"
              >
                {icons[options.variant || "info"]}
              </motion.div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">
                {options.title}
              </h3>
              <p className="text-gray-500 font-light leading-relaxed mb-8">
                {options.message}
              </p>

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-14 rounded-2xl border-gray-100 font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all uppercase text-[10px] tracking-widest"
                >
                  {options.cancelText || "Cancelar"}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={`flex-1 h-14 rounded-2xl font-black text-white transition-all active:scale-95 uppercase text-[10px] tracking-widest shadow-lg ${
                    colors[options.variant || "info"]
                  }`}
                >
                  {options.confirmText || "Confirmar"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
