"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeneficiosInputProps {
  beneficios: string[]
  onChange: (beneficios: string[]) => void
  maxItems?: number
}

export function BeneficiosInput({
  beneficios,
  onChange,
  maxItems = 20,
}: BeneficiosInputProps) {
  const [newBeneficio, setNewBeneficio] = useState("")

  const addBeneficio = () => {
    const trimmed = newBeneficio.trim()
    if (!trimmed) return
    if (beneficios.length >= maxItems) return
    if (beneficios.includes(trimmed)) {
      setNewBeneficio("")
      return
    }
    onChange([...beneficios, trimmed])
    setNewBeneficio("")
  }

  const removeBeneficio = (index: number) => {
    onChange(beneficios.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addBeneficio()
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Beneficios</Label>

      {/* Current beneficios list */}
      {beneficios.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg min-h-[48px]">
          {beneficios.map((beneficio, index) => (
            <div
              key={`${beneficio}-${index}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background border rounded-full text-sm animate-in fade-in slide-in-from-left-1 duration-200"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
              <span className="text-foreground">{beneficio}</span>
              <button
                type="button"
                onClick={() => removeBeneficio(index)}
                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Eliminar beneficio: ${beneficio}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input for new beneficio */}
      <div className="flex gap-2">
        <Input
          value={newBeneficio}
          onChange={(e) => setNewBeneficio(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Descuentos en capacitaciones"
          disabled={beneficios.length >= maxItems}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addBeneficio}
          disabled={!newBeneficio.trim() || beneficios.length >= maxItems}
          aria-label="Agregar beneficio"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Helper text */}
      <p className={cn("text-xs text-muted-foreground", beneficios.length >= maxItems && "text-destructive")}>
        {beneficios.length}/{maxItems} beneficios agregados
        {beneficios.length >= maxItems && " (límite alcanzado)"}
      </p>
    </div>
  )
}
