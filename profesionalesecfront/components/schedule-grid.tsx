"use client"

import { useEffect, useRef } from "react"
import { Check } from "lucide-react"

interface ScheduleGridProps {
  matrix: boolean[]
  onChange?: (newMatrix: boolean[]) => void
  readOnly?: boolean
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const hours = Array.from({ length: 24 }, (_, i) => i)

export default function ScheduleGrid({ matrix, onChange, readOnly = false }: ScheduleGridProps) {
  const scheduleScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial scroll to 8 AM
    if (scheduleScrollRef.current) {
      scheduleScrollRef.current.scrollTop = 224 // Approx 8 AM
    }
  }, [])

  const toggleAvailability = (dayIdx: number, hour: number) => {
    if (readOnly || !onChange) return
    const newMatrix = [...matrix]
    const index = dayIdx * 24 + hour
    newMatrix[index] = !newMatrix[index]
    onChange(newMatrix)
  }

  const toggleDayAvailability = (dayIdx: number) => {
    if (readOnly || !onChange) return
    const newMatrix = [...matrix]
    const dayStartIndex = dayIdx * 24
    const dayFull = matrix.slice(dayStartIndex, dayStartIndex + 24).every(v => v)
    
    for (let h = 0; h < 24; h++) {
      newMatrix[dayStartIndex + h] = !dayFull
    }
    onChange(newMatrix)
  }

  return (
    <div className="space-y-4">
      <div className={`relative border border-border/50 rounded-xl overflow-hidden shadow-sm ${readOnly ? 'bg-white text-gray-500' : 'bg-card text-muted-foreground'}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[700px]">
            {/* Header: Days */}
            <div className={`grid grid-cols-[80px_repeat(7,1fr)] border-b border-border sticky top-0 z-20 ${readOnly ? 'bg-white' : 'bg-card'}`}>
              <div className="p-3 border-r border-border" />
              {days.map((day, idx) => (
                <div key={day} className="p-3 text-center border-r border-border last:border-r-0">
                  <button
                    type="button"
                    onClick={() => toggleDayAvailability(idx)}
                    disabled={readOnly}
                    className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${readOnly ? 'text-gray-400' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    {day.slice(0, 3)}
                  </button>
                </div>
              ))}
            </div>

            {/* "All Day" Indicator Row */}
            <div className={`grid grid-cols-[80px_repeat(7,1fr)] border-b border-border ${readOnly ? 'bg-gray-50/50' : 'bg-secondary/5'}`}>
              <div className={`p-2 text-[9px] font-bold uppercase flex items-center justify-center border-r border-border ${readOnly ? 'text-gray-400' : 'text-muted-foreground/50'}`}>
                todo el día
              </div>
              {days.map((_, dIdx) => {
                const dayStartIndex = dIdx * 24;
                const dayFull = matrix.slice(dayStartIndex, dayStartIndex + 24).every(v => v);
                return (
                  <div key={dIdx} className="p-1 border-r border-border last:border-r-0">
                    <button
                      type="button"
                      onClick={() => toggleDayAvailability(dIdx)}
                      disabled={readOnly}
                      className={`w-full h-4 rounded-sm transition-colors ${
                        dayFull 
                          ? (readOnly ? 'bg-black/10 border border-gray-200' : 'bg-primary/20') 
                          : 'bg-transparent hover:bg-secondary/20'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Scrollable Hours Grid */}
            <div 
              ref={scheduleScrollRef}
              className="max-h-[400px] overflow-y-auto custom-scrollbar scroll-smooth pt-3"
            >
              {hours.map((h) => (
                <div key={h} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border last:border-b-0 hover:bg-secondary/5 transition-colors relative">
                  {/* Tick-style Hour Labels */}
                  <div className={`relative border-r border-border h-7 ${readOnly ? 'bg-gray-50/30' : 'bg-secondary/5'}`}>
                    <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-end pr-3">
                      <span className={`text-[8px] font-bold tracking-tighter whitespace-nowrap ${readOnly ? 'text-gray-400' : 'text-muted-foreground/60'}`}>
                        {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                      </span>
                    </div>
                  </div>

                  {/* Availability Cells */}
                  {days.map((_, dIdx) => {
                    const isSelected = matrix[(dIdx * 24) + h];
                    return (
                      <div key={dIdx} className="p-0.5 border-r border-border last:border-r-0 group/cell">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(dIdx, h)}
                          disabled={readOnly}
                          className={`w-full h-6 rounded-md transition-all duration-200 border flex items-center justify-center relative overflow-hidden ${
                            isSelected 
                              ? (readOnly ? "bg-black/10 border-black/20 shadow-sm" : "bg-primary/10 border-primary/50 shadow-sm") 
                              : "bg-transparent border-transparent hover:border-border hover:bg-secondary/10"
                          }`}
                        >
                          {isSelected && (
                            <>
                              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${readOnly ? 'bg-black/40' : 'bg-primary'}`} />
                              <Check className={`${readOnly ? 'text-black/60' : 'text-primary'} size-3 ${!readOnly && 'opacity-80'}`} />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Final tick for midnight */}
              <div className="grid grid-cols-[80px_repeat(7,1fr)] relative h-0">
                <div className="relative border-r border-border h-0">
                  <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-end pr-3">
                    <span className={`text-[8px] font-bold tracking-tighter ${readOnly ? 'text-gray-400' : 'text-muted-foreground/60'}`}>12 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`flex items-center gap-6 text-[11px] font-medium p-4 rounded-xl border border-border w-fit ${readOnly ? 'bg-gray-50/50' : 'bg-secondary/5'}`}>
        <div className="flex items-center gap-2">
          <div className={`size-4 rounded shadow-sm border ${readOnly ? 'bg-black/10 border-black/20' : 'bg-primary/10 border-primary/50'}`} />
          <span className={readOnly ? 'text-gray-700' : 'text-foreground'}>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 bg-transparent border border-border rounded" />
          <span className={readOnly ? 'text-gray-400' : 'text-muted-foreground'}>No disponible</span>
        </div>
      </div>
    </div>
  )
}
