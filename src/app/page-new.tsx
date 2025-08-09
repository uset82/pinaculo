'use client'

import { useState } from 'react'
import { NumerologyCalculator } from '@/components/NumerologyCalculator'
import { DraggableContainer } from '@/components/DraggableContainer'
import { useClientOnly } from '@/utils/clientOnly'

export default function Home() {
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const [isDraggableMode, setIsDraggableMode] = useState(false)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Descubre Tus Números
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Desbloquea los significados ocultos en tu nombre y fecha de nacimiento a través de la sabiduría ancestral de la numerología. 
          Obtén conocimientos personalizados sobre tu personalidad, camino de vida y destino con nuestro avanzado sistema del Pináculo.
        </p>

        {/* Preview Mode Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPreviewMode(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isPreviewMode
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                🔮 Modo Vista Previa
              </button>
              <button
                onClick={() => setIsPreviewMode(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  !isPreviewMode
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                ✨ Mi Cálculo Personal
              </button>
            </div>
          </div>
        </div>

        {/* Draggable Mode Toggle */}
        <div className="mt-4 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDraggableMode(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !isDraggableMode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                📄 Modo Normal
              </button>
              <button
                onClick={() => setIsDraggableMode(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDraggableMode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                🖱️ Modo Arrastrable
              </button>
            </div>
          </div>
        </div>

        {/* Draggable Mode Indicator */}
        {isDraggableMode && (
          <div className="mt-4 inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="mr-2">🖱️</span>
            Modo Arrastrable Activo - Arrastra las ventanas por la barra superior
          </div>
        )}

        {/* Preview Mode Indicator */}
        {isPreviewMode && (
          <div className="mt-4 inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="mr-2">👁️</span>
            Mostrando ejemplo con &quot;Carlos Carpio&quot; y &quot;06/05/1982&quot;
          </div>
        )}
      </div>

      {/* Main Calculator */}
      {isDraggableMode ? (
        <DraggableContainer 
          title="🔮 Calculadora Numerológica"
          initialPosition={{ x: 50, y: 100 }}
          className="w-[600px]"
        >
          <div className="p-6">
            <NumerologyCalculator isPreviewMode={isPreviewMode} isDraggableMode={true} />
          </div>
        </DraggableContainer>
      ) : (
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <NumerologyCalculator isPreviewMode={isPreviewMode} />
          </div>
        </div>
      )}

      {/* Main Calculator */}
      {isDraggableMode ? (
        <DraggableContainer 
          title="🔮 Calculadora Numerológica"
          initialPosition={{ x: 700, y: 150 }}
          className="w-[800px]"
        >
          <div className="p-6">
            <NumerologyCalculator isPreviewMode={isPreviewMode} />
          </div>
        </DraggableContainer>
      ) : (
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <NumerologyCalculator isPreviewMode={isPreviewMode} />
          </div>
        </div>
      )}

      {/* Draggable Mode Instructions */}
      {isDraggableMode && (
        <DraggableContainer 
          title="📋 Instrucciones del Modo Arrastrable"
          initialPosition={{ x: 20, y: 50 }}
          className="w-[350px]"
          minimizable={true}
        >
          <div className="p-4 space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🖱️ Cómo usar:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Arrastra las ventanas por la barra superior</li>
                <li>• Usa 🎯 para centrar una ventana</li>
                <li>• Usa ⬇️ para minimizar/expandir</li>
                <li>• Cambia a "Modo Normal" para vista tradicional</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✨ Ventajas:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Organiza tu espacio de trabajo</li>
                <li>• Compara resultados lado a lado</li>
                <li>• Experiencia de escritorio moderna</li>
              </ul>
            </div>
          </div>
        </DraggableContainer>
      )}

      {/* About Section */}
      {!isDraggableMode && (
        <div className="bg-white/50 backdrop-blur-sm py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">¿Qué es la Numerología?</h2>
            
            {/* Preview Mode Explanation */}
            <div className="bg-purple-100 rounded-xl p-6 mb-8 border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">🔮 Modo Vista Previa</h3>
              <p className="text-purple-800 leading-relaxed">
                <strong>¿Primera vez aquí?</strong> Utiliza el <strong>Modo Vista Previa</strong> para ver un ejemplo completo 
                de cómo funciona nuestro sistema numerológico con datos de muestra. Después, cambia a 
                <strong> "Mi Cálculo Personal"</strong> para obtener tu propio mapa numerológico personalizado.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔢</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Tu Camino de Vida</h3>
                <p className="text-gray-600">
                  Calcula tu Número del Camino de Vida desde tu fecha de nacimiento para entender tu propósito central y viaje.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Energía del Nombre</h3>
                <p className="text-gray-600">
                  Descubre la energía vibracional de tu nombre y cómo influye en tu personalidad y destino.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Diagrama del Pináculo</h3>
                <p className="text-gray-600">
                  Visualiza tu mapa numerológico completo con nuestro sistema avanzado del Pináculo que analiza 23 aspectos diferentes de tu personalidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
