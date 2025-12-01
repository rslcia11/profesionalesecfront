"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Tipo del formulario
interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("[v0] Login form submitted:", formData)
    alert("Iniciando sesión...")
    onOpenChange(false)
  }

  const handleOpenRegistration = () => {
    onOpenChange(false)
    window.location.href = "/registro-profesional"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription className="text-center">
            Ingresa a tu cuenta de profesional
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">
              Correo electrónico <span className="text-red-500">*</span>
            </Label>
            <Input
              id="login-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="ejemplo@correo.com"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">
              Contraseña <span className="text-red-500">*</span>
            </Label>
            <Input
              id="login-password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="h-12"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    rememberMe: Boolean(checked),
                  })
                }
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Recordarme
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() =>
                alert(
                  "Funcionalidad de recuperación de contraseña próximamente"
                )
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" size="lg" className="w-full h-12">
            Iniciar Sesión
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={handleOpenRegistration}
              className="text-primary hover:underline font-medium"
            >
              Crear Perfil Profesional
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
