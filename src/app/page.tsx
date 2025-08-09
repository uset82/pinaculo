'use client'

import { NumerologyCalculatorLiquidGlass } from '@/components/NumerologyCalculatorLiquidGlass'
import { useClientOnly } from '@/utils/clientOnly'

export default function Home() {
  const isClient = useClientOnly()

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-purple-200 rounded mb-4 w-64"></div>
          <div className="h-4 bg-purple-200 rounded mb-2 w-48"></div>
          <div className="h-4 bg-purple-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center py-12 mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Descubre Tus Números
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto px-4">
            Desbloquea los significados ocultos en tu nombre y fecha de nacimiento a través de la sabiduría ancestral de la numerología. 
            Obtén conocimientos personalizados sobre tu personalidad, camino de vida y destino con nuestro avanzado sistema del Pináculo.
          </p>
        </div>

        {/* Calculator Content Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <NumerologyCalculatorLiquidGlass isPreviewMode={false} />
          </div>
        </div>

        {/* About Section */}
        <div className="liquid-glass py-16 mx-4 my-8 rounded-3xl">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white/90 mb-8 drop-shadow">¿Qué es la Numerología?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="liquid-glass-card p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">🔢</span>
                </div>
                <h3 className="text-xl font-semibold text-white/90 mb-2 drop-shadow">Tu Camino de Vida</h3>
                <p className="text-white/70">
                  Calcula tu Número del Camino de Vida desde tu fecha de nacimiento para entender tu propósito central y viaje.
                </p>
              </div>
              <div className="liquid-glass-card p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-white/90 mb-2 drop-shadow">Energía del Nombre</h3>
                <p className="text-white/70">
                  Descubre la energía vibracional de tu nombre y cómo influye en tu personalidad y destino.
                </p>
              </div>
              <div className="liquid-glass-card p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-semibold text-white/90 mb-2 drop-shadow">Diagrama del Pináculo</h3>
                <p className="text-white/70">
                  Visualiza tu mapa numerológico completo con nuestro sistema avanzado del Pináculo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
