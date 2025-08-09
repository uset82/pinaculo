'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const PinaculoDiagramEditor = dynamic(() => import('@/components/PinaculoDiagramEditor'), { ssr: false })

export default function PinaculoEditorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-800">🧩 Editor del Diagrama del Pináculo</h1>
          <a href="/" className="text-indigo-700 hover:underline">← Volver</a>
        </header>
        <p className="text-gray-700">Arrastra cada nodo para calzar con la imagen de referencia. Guarda en local o exporta a JSON para reutilizar posiciones en la app.</p>
        <PinaculoDiagramEditor />
      </div>
    </div>
  )
}
