'use client'

import React from 'react'
import PinaculoLayout from '@/components/PinaculoLayout'

export default function PinaculoEditorPage() {
  const initialPositions = {
    A: { x: 0.15, y: 0.45 }, B: { x: 0.40, y: 0.40 }, C: { x: 0.60, y: 0.40 }, D: { x: 0.85, y: 0.40 },
    E: { x: 0.25, y: 0.27 }, F: { x: 0.75, y: 0.27 }, G: { x: 0.50, y: 0.18 }, H: { x: 0.50, y: 0.05 },
    I: { x: 0.50, y: 0.27 }, J: { x: 0.80, y: 0.18 },
    K: { x: 0.25, y: 0.53 }, L: { x: 0.75, y: 0.53 }, M: { x: 0.50, y: 0.67 }, N: { x: 0.70, y: 0.67 },
    O: { x: 0.50, y: 0.53 }, P: { x: 0.30, y: 0.67 }, Q: { x: 0.25, y: 0.80 }, R: { x: 0.50, y: 0.80 }, S: { x: 0.75, y: 0.80 },
    W: { x: 0.08, y: 0.53 }, T: { x: 0.70, y: 0.87 }, X: { x: 0.90, y: 0.53 }, Y: { x: 0.92, y: 0.45 }, Z: { x: 0.77, y: 0.12 },
  }

  const stubValues = {
    A: 5, B: 6, C: 2, D: 22, E: 5, F: 8, G: 1, H: 7, I: 2, J: 11,
    K: 1, L: 4, M: 3, N: 7, O: 8, P: 3, Q: 4, R: 3, S: 11, W: 9, T: 9, X: 1, Y: 9, Z: 1,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2b72] via-[#3b4bb4] to-[#4b63d1] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white/90">🧩 Editor del Layout del Pináculo</h1>
          <a href="/" className="text-white/80 hover:underline">← Volver</a>
        </header>
        <p className="text-white/70">Haz click sobre el canvas para colocar cada letra. Copia el JSON y reutilízalo en la app.</p>
        <PinaculoLayout positions={initialPositions as any} values={stubValues} editable backgroundSrc="/pinaculo_page_1.svg" />
      </div>
    </div>
  )
}
