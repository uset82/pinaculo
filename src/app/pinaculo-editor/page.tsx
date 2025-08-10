'use client'

import React from 'react'
import { PinaculoDiagramEditor } from '@/components/PinaculoDiagramEditor'

export default function PinaculoEditorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2b72] via-[#3b4bb4] to-[#4b63d1] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white/90">🧩 Editor del Diagrama del Pináculo</h1>
          <a href="/" className="text-white/80 hover:underline">← Volver</a>
        </header>
        <p className="text-white/80 text-sm">
          Arrastra cada letra sobre el fondo para alinearla. Usa “Guardar local” para persistir (localStorage) o “Exportar JSON” para descargar las posiciones.
          El diagrama principal usará automáticamente tus posiciones guardadas.
        </p>
        <PinaculoDiagramEditor />
      </div>
    </div>
  )
}
