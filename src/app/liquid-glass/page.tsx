'use client'

import React from 'react'
import LiquidGlassContainer from '@/components/LiquidGlassContainer'

export default function LiquidGlassPage(): JSX.Element {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <LiquidGlassContainer title="Liquid Glass Demo" glowEffect floating={false} minimizable={false}>
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-white/90">Interfaz Liquid Glass</h1>
            <p className="text-white/80 text-sm">
              Vista de demostración para validar estilos y comportamiento de la ventana flotante.
            </p>
          </div>
        </LiquidGlassContainer>
      </div>
    </div>
  )
}


