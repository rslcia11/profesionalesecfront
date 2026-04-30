"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { citasApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
    professional: {
        id: number
        name: string
        slug?: string
        specialty?: string
    }
    schedule?: boolean[] | null
}

export default function BookingForm({ professional, schedule }: BookingFormProps) {
    const [formData, setFormData] = useState({
        nombres_completos: "",
        correo: "",
        telefono: "",
        fecha_cita: "",
        hora_cita: "",
        comentario: "",
    })
    const [loading, setLoading] = useState(false)
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [availabilityWarning, setAvailabilityWarning] = useState<string | null>(null)
    const { toast } = useToast()

    // Real-time validation
    const validateAvailability = (fecha: string, hora: string) => {
        if (!schedule || !fecha || !hora) {
            setAvailabilityWarning(null)
            return
        }

        try {
            // Get day of week (0-6, where 0 is Sunday)
            // Note: date input is YYYY-MM-DD. We use UTC to avoid timezone shifts for the check.
            const dateObj = new Date(fecha + "T12:00:00Z");
            const dayOfWeek = dateObj.getUTCDay(); // 0: Sun, 1: Mon... 6: Sat
            
            // Map to our matrix (0: Mon, 6: Sun)
            const matrixDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            
            // Get hour (0-23)
            const hour = parseInt(hora.split(":")[0], 10);
            
            const matrixIndex = (matrixDayIndex * 24) + hour;
            const isAvailable = schedule[matrixIndex];

            if (!isAvailable) {
                setAvailabilityWarning("El profesional no tiene disponibilidad configurada para esta hora. Puedes intentar agendar, pero es posible que la cita sea rechazada.");
            } else {
                setAvailabilityWarning(null)
            }
        } catch (err) {
            setAvailabilityWarning(null)
        }
    }

    const isDateDisabled = (date: Date) => {
        if (!schedule) return false; // si no hay schedule, dejamos abierto
        
        // 0: Sun, 1: Mon... 6: Sat
        const dayOfWeek = date.getDay();
        // matrix: 0: Mon ... 6: Sun
        const matrixDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        // Return true (disabled) if there are NO available slots in this day
        // meaning every hour is false
        const startIdx = matrixDayIndex * 24;
        const endIdx = startIdx + 24;
        
        let hasAvailability = false;
        for (let i = startIdx; i < endIdx; i++) {
            if (schedule[i] === true) {
                hasAvailability = true;
                break;
            }
        }
        
        return !hasAvailability;
    }

    const availableHours = useMemo(() => {
        if (!schedule || !formData.fecha_cita) return [];
        
        const dateObj = new Date(formData.fecha_cita + "T12:00:00Z");
        const dayOfWeek = dateObj.getUTCDay();
        const matrixDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        const startIdx = matrixDayIndex * 24;
        const endIdx = startIdx + 24;
        
        const hours: { value: string, label: string }[] = [];
        for (let i = startIdx; i < endIdx; i++) {
            if (schedule[i] === true) {
                const hourNum = i - startIdx;
                const formattedHour = `${String(hourNum).padStart(2, '0')}:00`;
                
                const ampm_start = hourNum >= 12 ? 'pm' : 'am';
                const hour12_start = hourNum % 12 || 12;
                
                const nextHourNum = hourNum + 1;
                const ampm_end = nextHourNum >= 12 && nextHourNum % 24 !== 0 ? 'pm' : 'am';
                const hour12_end = nextHourNum % 12 || 12;
                
                const label = `${hour12_start} ${ampm_start} a ${hour12_end} ${ampm_end}`;
                
                hours.push({ value: formattedHour, label });
            }
        }
        return hours;
    }, [schedule, formData.fecha_cita]);

    const handleFieldChange = (field: string, value: string) => {
        const newFormData = { ...formData, [field]: value }
        setFormData(newFormData)
        
        if (field === "fecha_cita" || field === "hora_cita") {
            validateAvailability(
                field === "fecha_cita" ? value : formData.fecha_cita,
                field === "hora_cita" ? value : formData.hora_cita
            )
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await citasApi.agendarPublico({
                profesional_id: professional.id,
                profesional_slug: professional.slug,
                ...formData,
            })
            setSuccessModalOpen(true)
            setFormData({
                nombres_completos: "",
                correo: "",
                telefono: "",
                fecha_cita: "",
                hora_cita: "",
                comentario: "",
            })
            setAvailabilityWarning(null)
        } catch (err: any) {
            const message = err.message || "Error al agendar la cita. Por favor intente nuevamente."
            setError(message)
            toast({
                title: "No se pudo agendar la cita",
                description: message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            {/* Nombre */}
            <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre *</label>
                <input
                    type="text"
                    required
                    value={formData.nombres_completos}
                    onChange={(e) => handleFieldChange("nombres_completos", e.target.value)}
                    className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent"
                    placeholder="Tu nombre completo"
                />
            </div>

            {/* Contacto Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Teléfono *</label>
                    <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => handleFieldChange("telefono", e.target.value)}
                        className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent"
                        placeholder="099..."
                        maxLength={10}
                        pattern="[0-9]{10}"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Correo electrónico *</label>
                    <input
                        type="email"
                        required
                        value={formData.correo}
                        onChange={(e) => handleFieldChange("correo", e.target.value)}
                        className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            {/* Fecha y Hora Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col mt-0">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha de agendamiento *</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent text-left flex justify-between items-center outline-none ring-0",
                                    !formData.fecha_cita && "text-gray-400"
                                )}
                            >
                                {formData.fecha_cita ? (
                                    <span className="text-gray-800">
                                        {format(new Date(`${formData.fecha_cita}T12:00:00`), "dd 'de' MMMM, yyyy", { locale: es })}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 font-normal">Seleccionar fecha</span>
                                )}
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={formData.fecha_cita ? new Date(`${formData.fecha_cita}T12:00:00`) : undefined}
                                startMonth={new Date()}
                                onSelect={(date) => {
                                    if (date) {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const dateStr = `${year}-${month}-${day}`;
                                        
                                        // Update the date, and reset the time since the new day has different slots
                                        const newFormData = { ...formData, fecha_cita: dateStr, hora_cita: "" };
                                        setFormData(newFormData);
                                        validateAvailability(dateStr, "");
                                    }
                                }}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (date < today) return true; // No past dates
                                    return isDateDisabled(date);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Hora *</label>
                    <Select 
                        value={formData.hora_cita} 
                        onValueChange={(val) => handleFieldChange("hora_cita", val)}
                        disabled={!formData.fecha_cita || availableHours.length === 0}
                        required
                    >
                        <SelectTrigger className="w-full border-b border-x-0 border-t-0 border-gray-300 rounded-none shadow-none px-0 py-2 focus:border-black focus:ring-0 bg-transparent data-[state=open]:bg-transparent outline-none ring-0 focus-visible:ring-0">
                            <SelectValue placeholder={!formData.fecha_cita ? "Seleccione un día primero" : (availableHours.length === 0 ? "Sin disponibilidad" : "Seleccione hora")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {availableHours.map(hour => (
                                <SelectItem key={hour.value} value={hour.value} className="cursor-pointer">
                                    {hour.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Mensaje */}
            <div>
                <textarea
                    value={formData.comentario}
                    onChange={(e) => handleFieldChange("comentario", e.target.value)}
                    className="w-full border border-gray-200 rounded p-4 h-32 align-top focus:border-black focus:outline-none resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                />
            </div>

            {availabilityWarning && (
                <div className="p-3 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{availabilityWarning}</p>
                </div>
            )}

            {/* Botón */}
            <button
                type="submit"
                disabled={loading}
                className={`bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded hover:bg-gray-300 transition text-sm tracking-wide uppercase ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Agendando..." : "AGENDAR CITA"}
            </button>
        </form>
        <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        Solicitud de cita exitosa
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 pt-2 leading-relaxed">
                        ¡Gracias por confiar en <strong>{professional.name}</strong>! Ya enviamos un correo con los
                        detalles de tu solicitud de cita. Cuando el profesional responda, también recibirás la
                        confirmación por correo electrónico.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
        </>
    )
}
