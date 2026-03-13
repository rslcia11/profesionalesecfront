"use client"

import React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  CalendarIcon, 
  Users, 
  Clock, 
  DollarSign, 
  Globe, 
  MapPin, 
  Loader2, 
  Upload,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  Image,
  BookOpen,
  Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dynamic from "next/dynamic"
import { useConversatorioForm, PonenciaForm } from "@/hooks/use-conversatorio-form"

const LocationMap = dynamic(() => import("@/components/shared/location-map"), { ssr: false })

interface ConversatorioFormProps {
  initialData?: Partial<PonenciaForm>
  id?: number
  provincias: any[]
  profesiones: any[]
}

export default function ConversatorioForm({ initialData, id, provincias, profesiones }: ConversatorioFormProps) {
  const {
    formData,
    updateField,
    handleLocationChange,
    handleProvinciaChange,
    handleFileUpload,
    save,
    isSubmitting,
    isUploading,
    ciudades,
    addDay,
    removeDay,
    updateDay,
    addSpeaker,
    removeSpeaker,
    updateSpeaker
  } = useConversatorioForm(initialData)

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-2xl">
        {/* COLUMNA PRINCIPAL DE DATOS (7/12) */}
        <div className="xl:col-span-7 p-8 lg:p-12 space-y-12">
          {/* SECCIÓN 1: IDENTIDAD DEL EVENTO */}
          <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identidad del Evento</h3>
                  <p className="text-slate-500 text-sm">Información fundamental y narrativa</p>
                </div>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Estado del Conversatorio</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(val: any) => updateField("estado", val)}
                >
                  <SelectTrigger className={`h-11 border-none font-bold rounded-xl shadow-sm ${
                    formData.estado === "publicada" ? "bg-emerald-50 text-emerald-600" : 
                    formData.estado === "borrador" ? "bg-amber-50 text-amber-600" : 
                    "bg-slate-50 text-slate-600"
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 rounded-xl shadow-2xl">
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="publicada">Publicada</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subtitulo" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Slogan o Profesión Destacada</Label>
                <Input 
                  id="subtitulo" 
                  placeholder="Ej: Odontología Moderna y Estética" 
                  value={formData.subtitulo || ""} 
                  onChange={(e) => updateField("subtitulo", e.target.value)}
                  className="h-14 bg-slate-50 border-none text-lg font-bold text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Título del Conversatorio</Label>
                  <Input 
                    id="titulo" 
                    placeholder="Ej: Innovación en Inteligencia Artificial" 
                    value={formData.titulo || ""} 
                    onChange={(e) => updateField("titulo", e.target.value)}
                    className="h-14 bg-slate-50 border-none text-lg font-bold text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profesion" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Área Profesional</Label>
                  <Select 
                    value={formData.profesion_id ? formData.profesion_id.toString() : ""} 
                    onValueChange={(val) => updateField("profesion_id", Number(val))}
                  >
                    <SelectTrigger className="h-14 bg-slate-50 border-none text-lg font-bold text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-600">
                      <SelectValue placeholder="Seleccionar área..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-100 rounded-2xl shadow-2xl">
                      {profesiones.map((prof: any) => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>{prof.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Descripción y Objetivos</Label>
                <Textarea 
                  id="descripcion" 
                  placeholder="Describe de qué trata el evento, qué aprenderán los asistentes..." 
                  value={formData.descripcion || ""} 
                  onChange={(e) => updateField("descripcion", e.target.value)}
                  className="min-h-[180px] bg-slate-50 border-none text-lg rounded-3xl p-6 focus:ring-2 focus:ring-blue-600 transition-all leading-relaxed placeholder:text-slate-300"
                />
              </div>
            </div>
          </section>
        </div>

        {/* COLUMNA LATERAL DE LOGÍSTICA (5/12) */}
        <div className="xl:col-span-5 bg-slate-50/30 p-8 lg:p-10 space-y-8">
          {/* SECCIÓN 2: LOGÍSTICA Y COSTOS */}
          <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600/10 rounded-2xl">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Logística</h3>
                <p className="text-slate-500 text-sm">Cronograma y disponibilidad</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="flex-1 p-6 space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-blue-500" /> Fecha Inicio
                  </Label>
                  <div className="space-y-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-auto p-0 text-xl font-black text-slate-800 hover:bg-transparent justify-start w-full text-left">
                          {formData.fecha_inicio ? format(new Date(formData.fecha_inicio), "EEE, dd MMM", { locale: es }) : "Elegir fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border-slate-100 rounded-3xl shadow-2xl">
                        <Calendar mode="single" selected={new Date(formData.fecha_inicio)} onSelect={(date) => date && updateField("fecha_inicio", date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-orange-500" /> Fecha Fin
                  </Label>
                  <div className="space-y-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-auto p-0 text-xl font-black text-slate-800 hover:bg-transparent justify-start w-full text-left">
                          {formData.fecha_fin ? format(new Date(formData.fecha_fin), "EEE, dd MMM", { locale: es }) : "Elegir fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border-slate-100 rounded-3xl shadow-2xl">
                        <Calendar mode="single" selected={new Date(formData.fecha_fin)} onSelect={(date) => date && updateField("fecha_fin", date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="space-y-4 bg-white p-8 rounded-[2rem] shadow-lg shadow-emerald-900/5 border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-emerald-500/10"></div>
                  <Label htmlFor="precio" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" /> Inversión
                  </Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-300">$</span>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio === 0 ? "" : formData.precio}
                      onChange={(e) => updateField("precio", e.target.value === "" ? 0 : Number(e.target.value))}
                      className="h-auto p-0 border-none text-4xl font-black text-slate-900 focus-visible:ring-0 bg-transparent w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-white p-8 rounded-[2rem] shadow-lg shadow-blue-900/5 border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10"></div>
                  <Label htmlFor="cupo" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" /> Capacidad
                  </Label>
                  <div className="flex items-baseline gap-2">
                    <Input
                      id="cupo"
                      type="number"
                      value={formData.cupo === 0 ? "" : formData.cupo}
                      onChange={(e) => updateField("cupo", e.target.value === "" ? 0 : Number(e.target.value))}
                      className="h-auto p-0 border-none text-4xl font-black text-slate-900 focus-visible:ring-0 bg-transparent w-full"
                    />
                    <span className="text-lg font-bold text-slate-300 uppercase">Pax</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SECCIÓN 3: MULTIMEDIA PREMIUM */}
        <div className="xl:col-span-12 p-8 lg:p-12 border-t border-slate-100 bg-slate-50/20">
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-900/10">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Multimedia Premium</h3>
                  <p className="text-slate-500 text-sm">Contenido enriquecido y destacados</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm self-start md:self-center">
                <Checkbox 
                  id="es_destacado" 
                  checked={formData.es_destacado} 
                  onCheckedChange={(checked) => updateField("es_destacado", !!checked)} 
                />
                <Label htmlFor="es_destacado" className="font-bold text-slate-700 cursor-pointer">Marcar como Destacado</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagen_banner" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">URL Imagen Banner</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="imagen_banner" 
                        placeholder="https://ejemplo.com/banner.jpg" 
                        value={formData.imagen_banner || ""} 
                        onChange={(e) => updateField("imagen_banner", e.target.value)}
                        className="h-12 bg-white border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600 flex-1"
                      />
                      <div className="relative">
                        <Input
                          type="file"
                          className="hidden"
                          id="form-upload-banner"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "imagen_banner")}
                          disabled={isUploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 w-12 p-0 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => document.getElementById("form-upload-banner")?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vista previa del Banner */}
                  <div className="relative h-48 w-full bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group">
                    {formData.imagen_banner ? (
                      <>
                        <img 
                          src={formData.imagen_banner} 
                          alt="Banner Preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-slate-900 border border-white">Vista Previa del Banner</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Image className="h-10 w-10 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sin imagen de banner</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video_url" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">URL Video (YouTube)</Label>
                  <Input 
                    id="video_url" 
                    placeholder="https://youtube.com/watch?v=..." 
                    value={formData.video_url || ""} 
                    onChange={(e) => updateField("video_url", e.target.value)}
                    className="h-12 bg-white border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="galeria_fotos" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Galería de Fotos (URLs)</Label>
                  <div className="relative">
                    <Input
                      type="file"
                      className="hidden"
                      id="form-upload-gallery"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "galeria_fotos")}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      onClick={() => document.getElementById("form-upload-gallery")?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Upload className="h-3 w-3 mr-2" />}
                      Subir a Galería
                    </Button>
                  </div>
                </div>
                <Textarea 
                  id="galeria_fotos" 
                  placeholder="https://img1.jpg, https://img2.jpg..." 
                  value={Array.isArray(formData.galeria_fotos) ? formData.galeria_fotos.join(", ") : ""} 
                  onChange={(e) => updateField("galeria_fotos", e.target.value.split(",").map(url => url.trim()).filter(url => url !== ""))}
                  className="bg-white border-slate-100 rounded-2xl min-h-[105px] focus:ring-2 focus:ring-indigo-600 p-4"
                />
                <p className="text-[10px] text-slate-400 italic font-medium pl-1">
                  💡 La galería permite mostrar múltiples perspectivas del evento.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* SECCIÓN 4: REVISTA DEL CONVERSATORIO (NUEVA) */}
        <div className="xl:col-span-12 p-8 lg:p-12 border-t border-slate-100 bg-white">
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-600 rounded-2xl shadow-xl shadow-rose-900/10">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revista del Conversatorio</h3>
                <p className="text-slate-500 text-sm">Vínculo principal a la revista digital</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-rose-50/30 p-8 rounded-[3rem] border border-rose-100">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url_revista_general" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">URL de la Revista (Flipbook/PDF)</Label>
                    <div className="flex gap-4">
                      <Input 
                        id="url_revista_general" 
                        placeholder="https://ejemplo.com/revista-xyz" 
                        value={formData.url_revista_general || ""} 
                        onChange={(e) => updateField("url_revista_general", e.target.value)}
                        className="h-12 bg-white border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-600 flex-1"
                      />
                      <div className="relative">
                        <Input
                          type="file"
                          className="hidden"
                          id="form-upload-magazine-file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "url_revista_general")}
                          disabled={isUploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 w-12 p-0 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={() => document.getElementById("form-upload-magazine-file")?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Portada de la Revista</Label>
                    <div className="flex gap-4">
                      <Input 
                        placeholder="URL de la imagen de portada" 
                        value={formData.foto_revista_general || ""} 
                        onChange={(e) => updateField("foto_revista_general", e.target.value)}
                        className="h-12 bg-white border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-600 flex-1"
                      />
                      <div className="relative">
                        <Input
                          type="file"
                          className="hidden"
                          id="form-upload-magazine-main"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "foto_revista_general")}
                          disabled={isUploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 w-12 p-0 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={() => document.getElementById("form-upload-magazine-main")?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              <div className="flex justify-center">
                {formData.foto_revista_general ? (
                  <div className="relative group">
                    <img 
                      src={formData.foto_revista_general} 
                      alt="Portada Revista" 
                      className="h-64 object-cover rounded-2xl shadow-2xl transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold">Vista previa</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 w-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Image className="h-8 w-8" />
                    <span className="text-[10px] font-black uppercase">Sin portada</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* SECCIÓN 5: ITINERARIO DINÁMICO (DÍAS Y PONENTES) */}
        <div className="xl:col-span-12 p-8 lg:p-12 border-t border-slate-100 bg-slate-50/30">
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-600 rounded-2xl shadow-xl shadow-violet-900/10">
                  <Layout className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Itinerario y Ponentes</h3>
                  <p className="text-slate-500 text-sm italic">Los días se generan automáticamente según las fechas del evento</p>
                </div>
              </div>

            <div className="space-y-12">
              {formData.dias.map((dia, diaIndex) => (
                <div key={diaIndex} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-violet-50/50 p-6 md:p-8 flex items-center justify-between border-b border-violet-100">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Título del Día</Label>
                        <Input 
                          value={dia.titulo_dia || ""} 
                          onChange={(e) => updateDay(diaIndex, "titulo_dia", e.target.value)}
                          className="h-10 bg-white border-violet-100 rounded-xl font-bold text-violet-900 w-64"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Fecha (Auto)</Label>
                        <div className="h-10 px-4 bg-white/50 border border-violet-100/50 rounded-xl font-bold text-violet-900/50 flex items-center min-w-[150px] cursor-not-allowed">
                          {format(new Date(dia.fecha), "dd MMM, yyyy", { locale: es })}
                        </div>
                      </div>

                      <div className="bg-white p-2 px-4 rounded-xl border border-violet-100 shadow-sm flex items-center gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="h-3 w-3 text-blue-500" /> Comienzo
                          </Label>
                          <Input 
                            type="time" 
                            value={dia.hora_inicio || ""} 
                            onChange={(e) => updateDay(diaIndex, "hora_inicio", e.target.value)}
                            className="h-8 border-none bg-slate-50 rounded-lg font-bold text-center w-24 text-sm" 
                          />
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="h-3 w-3 text-orange-500" /> Fin
                          </Label>
                          <Input 
                            type="time" 
                            value={dia.hora_fin || ""} 
                            onChange={(e) => updateDay(diaIndex, "hora_fin", e.target.value)}
                            className="h-8 border-none bg-slate-50 rounded-lg font-bold text-center w-24 text-sm" 
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => removeDay(diaIndex)}
                      type="button"
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-10 w-10 p-0 rounded-xl"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-400 flex items-center gap-2 text-sm uppercase tracking-widest">
                        <Users className="h-4 w-4" /> Ponentes de este día
                      </h4>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => addSpeaker(diaIndex)}
                        type="button"
                        className="text-violet-600 hover:bg-violet-50 font-bold"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Añadir Ponente
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dia.ponentes.map((ponente, pIndex) => (
                        <div key={pIndex} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4 relative group">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            type="button"
                            onClick={() => removeSpeaker(diaIndex, pIndex)}
                            className="absolute top-2 right-2 h-8 w-8 p-0 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                              <div className="h-24 w-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                                {ponente.foto_revista_url ? (
                                  <img src={ponente.foto_revista_url} alt={ponente.nombre_ponente} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-300">
                                    <Users className="h-10 w-10" />
                                  </div>
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1">
                                <Input
                                  type="file"
                                  className="hidden"
                                  id={`upload-ponente-${diaIndex}-${pIndex}`}
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, { type: "ponente_foto", diaIndex, ponenteIndex: pIndex })}
                                  disabled={isUploading}
                                />
                                <Button 
                                  size="icon" 
                                  type="button"
                                  className="h-8 w-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg"
                                  onClick={() => document.getElementById(`upload-ponente-${diaIndex}-${pIndex}`)?.click()}
                                  disabled={isUploading}
                                >
                                  {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                                </Button>
                              </div>
                            </div>
                            <div className="w-full space-y-3">
                              <Input 
                                placeholder="Nombre del Ponente" 
                                value={ponente.nombre_ponente || ""} 
                                onChange={(e) => updateSpeaker(diaIndex, pIndex, "nombre_ponente", e.target.value)}
                                className="h-9 text-xs font-bold text-center border-none bg-white rounded-lg shadow-sm"
                              />
                              <Input 
                                placeholder="Profesión (Ej: Cirujano)" 
                                value={ponente.profesion || ""} 
                                onChange={(e) => updateSpeaker(diaIndex, pIndex, "profesion", e.target.value)}
                                className="h-9 text-[10px] text-center border-none bg-white/50 rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Tema de la Charla</Label>
                            <Input 
                              placeholder="Ej: Nuevas tendencias en..."                               value={ponente.tema_charla || ""} 
                              onChange={(e) => updateSpeaker(diaIndex, pIndex, "tema_charla", e.target.value)}
                              className="h-8 text-[11px] border-none bg-white rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">URL Revista/Perfil Personal</Label>
                            <Input 
                              placeholder="https://..."                               value={ponente.url_revista_personal || ""} 
                              onChange={(e) => updateSpeaker(diaIndex, pIndex, "url_revista_personal", e.target.value)}
                              className="h-8 text-[11px] border-none bg-white rounded-lg font-mono"
                            />
                          </div>
                        </div>
                      ))}
                      {dia.ponentes.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 h-32 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">
                          <p className="text-xs uppercase font-black tracking-widest">Sin ponentes asignados</p>
                          <Button 
                            variant="link" 
                            type="button"
                            className="text-violet-500 text-xs font-bold"
                            onClick={() => addSpeaker(diaIndex)}
                          >
                            Click para añadir el primero
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {formData.dias.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center bg-violet-50/20 border-4 border-dashed border-violet-100 rounded-[4rem] text-violet-300 gap-4">
                  <Layout className="h-16 w-16 opacity-20" />
                  <div className="text-center">
                    <p className="font-black uppercase tracking-widest">Tu itinerario está vacío</p>
                    <p className="text-sm">Comienza añadiendo un día para los ponentes</p>
                  </div>
                  <Button 
                    onClick={addDay}
                    type="button"
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl px-8"
                  >
                    Añadir Primer Día
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>


        {/* SECCIÓN 7: UBICACIÓN GEOGRÁFICA */}
        <div className="xl:col-span-12 p-8 lg:p-12 border-t border-slate-100 bg-white">
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Geolocalización</h3>
                  <p className="text-slate-500 text-sm">Precisión física para tus asistentes</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Provincia</Label>
                  <Select
                    value={formData.provincia_id ? formData.provincia_id.toString() : ""}
                    onValueChange={(val) => handleProvinciaChange(val)}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-none text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 rounded-xl w-48 transition-all">
                      <SelectValue placeholder="Elegir..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-100 rounded-xl shadow-2xl">
                      {provincias.map((prov: any) => (
                        <SelectItem key={prov.id} value={prov.id.toString()}>{prov.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Ciudad</Label>
                  <Select
                    value={formData.ciudad_id ? formData.ciudad_id.toString() : ""}
                    onValueChange={(val) => updateField("ciudad_id", Number(val))}
                    disabled={!formData.provincia_id}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 border-none text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 rounded-xl w-48 transition-all disabled:opacity-30">
                      <SelectValue placeholder="Elegir..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-100 rounded-xl shadow-2xl">
                      {ciudades.map((ciudad: any) => (
                        <SelectItem key={ciudad.id} value={ciudad.id.toString()}>{ciudad.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative group/map rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-xl bg-white h-[550px]">
                <LocationMap
                  lat={formData.latitud}
                  lng={formData.longitud}
                  onChange={handleLocationChange}
                />
              </div>

              <div className="space-y-6 flex flex-col justify-center">
                <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <Label htmlFor="direccion" className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" /> Dirección Exacta
                  </Label>
                  <Textarea
                    id="direccion"
                    placeholder="Ej: Frente al centro comercial, junto a la torre bancaria..."
                    value={formData.direccion || ""}
                    onChange={(e) => updateField("direccion", e.target.value)}
                    className="bg-white border-slate-100 focus:ring-0 focus:border-blue-600 rounded-3xl min-h-[140px] text-lg p-6 shadow-inner leading-relaxed placeholder:text-slate-300"
                    rows={3}
                  />
                </div>
                
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-blue-900/20">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Nota de precisión</span>
                  </div>
                  <p className="text-blue-50 text-sm leading-relaxed">
                    La ubicación marcada en el mapa será la que vean los asistentes para calcular su ruta. Asegúrate de que el pin sea exacto.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-4 p-4">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="h-14 px-8 rounded-2xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          Cancelar
        </Button>
        <Button 
          onClick={() => save(id)} 
          disabled={isSubmitting}
          className="h-14 px-12 rounded-2xl font-black text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-900/20 group"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />}
          {id ? "Actualizar Conversatorio" : "Publicar Conversatorio"}
        </Button>
      </div>
    </div>
  )
}

function Info({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  )
}
