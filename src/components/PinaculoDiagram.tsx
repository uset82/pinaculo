'use client'

import React, { useState, useEffect } from 'react'
import { PinnacleStructure, PinaculoCalculator, PinaculoResults } from '@/types/pinaculo'
import structureDataJson from '@/data/pinaculo-structure.json'

interface PinaculoDiagramProps {
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  name?: string
}

function PinaculoDiagram({ birthDay, birthMonth, birthYear, name }: PinaculoDiagramProps) {
  const [structure, setStructure] = useState<PinnacleStructure | null>(null)
  const [calculations, setCalculations] = useState<PinaculoResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bgSvgMarkup, setBgSvgMarkup] = useState<string | null>(null)
  const SHOW_DETAIL_PANELS = false

  useEffect(() => {
    try {
      setError(null)
      const structureData = structureDataJson as unknown as PinnacleStructure
      setStructure(structureData)
    } catch (error) {
      console.error('Error loading Pináculo structure:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido cargando la estructura')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (birthDay && birthMonth && birthYear && name) {
      const calc = PinaculoCalculator.calculateComplete(name, birthDay, birthMonth, birthYear)
      setCalculations(calc)
    }
  }, [birthDay, birthMonth, birthYear, name])

  // Load sanitized SVG background once
  useEffect(() => {
    let isMounted = true
    fetch('/pinaculo_page_1.svg')
      .then(r => r.text())
      .then(text => {
        if (!isMounted) return
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'image/svg+xml')
        const svgEl = doc.documentElement
        svgEl.querySelectorAll('[fill]').forEach(el => {
          const fill = el.getAttribute('fill') || ''
          if (fill.toLowerCase() !== 'none') el.parentNode?.removeChild(el)
        })
        svgEl.querySelectorAll('use').forEach(el => el.parentNode?.removeChild(el))
        svgEl.setAttribute('width', '100%')
        svgEl.setAttribute('height', '100%')
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        setBgSvgMarkup(svgEl.outerHTML)
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg text-white/80">Cargando tu Diagrama del Pináculo...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-300/30 rounded-lg backdrop-blur-sm">
        <h3 className="text-white/90 font-semibold mb-2">Error cargando el Pináculo</h3>
        <p className="text-white/70 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-rose-500/30 text-white hover:bg-rose-500/40 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!structure || !calculations || !birthDay || !birthMonth || !birthYear) {
    return (
      <div className="p-8 text-center bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
          <span className="text-2xl">🎭</span>
        </div>
        <p className="text-white/90 text-lg">¡Tu Diagrama del Pináculo está listo!</p>
        <p className="text-white/70 mt-2">Ingresa tu nombre y fecha de nacimiento arriba para ver tu mapa numerológico personalizado.</p>
      </div>
    )
  }

  const renderDiagram = () => {
    if (!calculations) return null

    // Number circle component styled to match reference image
    const NumberCircle = ({
      number,
      letter,
      variant = 'base',
      size = 'w-12 h-12',
      emphasize = false,
    }: {
      number: number
      letter: string
      variant?: 'base' | 'positive' | 'negative'
      size?: string
      emphasize?: boolean
    }) => {
      const variantClass: Record<string, string> = {
        base: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
        positive: 'bg-green-500/20 text-green-200 border-green-400/30',
        negative: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
      }
      return (
        <div className="relative flex flex-col items-center">
          <div className={`${size} ${variantClass[variant]} rounded-full flex items-center justify-center border backdrop-blur-sm ${emphasize ? 'ring-4 ring-amber-400/40' : ''}`}>
            <span className="font-extrabold text-xl">{number}</span>
          </div>
          <div className="text-sm font-bold mt-1 text-white/80">{letter}</div>
        </div>
      )
    }

    // W Triplicidad puede ser número o lista
    const W = (calculations.W as any) ?? 0;

    return (
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Main Pyramid Diagram - Exact pinnacle.png Layout */}
        <div className="flex-1 flex justify-center overflow-x-auto">
          <div className="relative min-w-max w-[700px] h-[600px]">
            {bgSvgMarkup && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none select-none"
                dangerouslySetInnerHTML={{ __html: bgSvgMarkup }}
              />
            )}
            
            {/* TOP LEVEL - H (TU DESTINO) */}
            <div className="absolute top-[0px] left-1/2 -translate-x-1/2 transform">
              <NumberCircle number={calculations.H} letter="H" variant="positive" />
            </div>

            {/* SECOND LEVEL - G and J */}
            <div className="absolute top-[80px] left-[50%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.G} letter="G" variant="positive" />
            </div>
            <div className="absolute top-[80px] left-[80%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.J} letter="J" variant="positive" />
            </div>

            {/* THIRD LEVEL - E, I, F */}
            <div className="absolute top-[160px] left-[25%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.E} letter="E" variant="positive" />
            </div>
            <div className="absolute top-[160px] left-1/2 -translate-x-1/2 transform">
              <NumberCircle number={calculations.I} letter="I" variant="positive" />
            </div>
            <div className="absolute top-[160px] left-[75%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.F} letter="F" variant="positive" />
            </div>

            {/* CENTER DIAMOND - A, B, C, D */}
            <div className="absolute top-[240px] left-[15%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.A} letter="A" variant="base" />
            </div>
            <div className="absolute top-[240px] left-[40%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.B} letter="B" variant="base" size="w-20 h-20" emphasize />
            </div>
            <div className="absolute top-[240px] left-[60%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.C} letter="C" variant="base" />
            </div>
            <div className="absolute top-[240px] left-[85%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.D} letter="D" variant="base" />
            </div>

            {/* LOWER LEVEL 1 - K, O, L */}
            <div className="absolute top-[320px] left-[25%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.K} letter="K" variant="negative" />
            </div>
            <div className="absolute top-[320px] left-1/2 -translate-x-1/2 transform">
              <NumberCircle number={calculations.O} letter="O" variant="negative" />
            </div>
            <div className="absolute top-[320px] left-[75%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.L} letter="L" variant="negative" />
            </div>

            {/* LOWER LEVEL 2 - M */}
            <div className="absolute top-[400px] left-1/2 -translate-x-1/2 transform">
              <NumberCircle number={calculations.M} letter="M" variant="negative" />
            </div>

            {/* W (TRIPLICIDAD) - LEFT SIDE */}
            {((Array.isArray(W) && W.length > 0) || (!Array.isArray(W) && W !== 0)) && (
              <div className="absolute top-[320px] left-[5%] -translate-x-1/2 transform">
                <div className="relative flex flex-col items-center">
                  <div className={`min-w-12 h-12 rounded-full border bg-rose-200 border-rose-300 flex items-center justify-center px-2`}>
                    <span className="font-extrabold text-rose-900 text-xl">
                      {Array.isArray(W) ? W.join(', ') : W}
                    </span>
                  </div>
                  <div className="text-sm font-bold mt-1 text-gray-800">W</div>
                </div>
              </div>
            )}

            {/* LOWER LEVEL 3 - P, N */}
            <div className="absolute top-[400px] left-[30%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.P} letter="P" variant="negative" />
            </div>
            <div className="absolute top-[400px] left-[70%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.N} letter="N" variant="negative" />
            </div>

            {/* BOTTOM LEVEL - Q, R, S */}
            <div className="absolute top-[480px] left-[25%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.Q} letter="Q" variant="negative" />
            </div>
            <div className="absolute top-[480px] left-1/2 -translate-x-1/2 transform">
              <NumberCircle number={calculations.R} letter="R" variant="negative" />
            </div>
            <div className="absolute top-[480px] left-[75%] -translate-x-1/2 transform">
              <NumberCircle number={calculations.S} letter="S" variant="negative" />
            </div>

            {/* Full Connecting Lines - Exact from pinnacle.png */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1]">
              {/* H to G/J */}
              <line x1="50%" y1="30" x2="30%" y2="110" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="50%" y1="30" x2="70%" y2="110" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* G to E/I */}
              <line x1="30%" y1="110" x2="20%" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="30%" y1="110" x2="50%" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* J to I/F */}
              <line x1="70%" y1="110" x2="50%" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="70%" y1="110" x2="80%" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* E to A */}
              <line x1="20%" y1="190" x2="15%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* I to B */}
              <line x1="50%" y1="190" x2="40%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* F to C */}
              <line x1="80%" y1="190" x2="60%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* J to D diagonal */}
              <line x1="70%" y1="110" x2="85%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* Center diamond */}
              <line x1="15%" y1="270" x2="40%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="40%" y1="270" x2="60%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="60%" y1="270" x2="85%" y2="270" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* Center to lower K/O/L */}
              <line x1="15%" y1="270" x2="25%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="40%" y1="270" x2="25%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="40%" y1="270" x2="50%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="60%" y1="270" x2="50%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="60%" y1="270" x2="75%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="85%" y1="270" x2="75%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* Lower to M */}
              <line x1="25%" y1="350" x2="50%" y2="430" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="50%" y1="350" x2="50%" y2="430" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="75%" y1="350" x2="50%" y2="430" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* M to P/N */}
              <line x1="50%" y1="430" x2="30%" y2="430" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="50%" y1="430" x2="70%" y2="430" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* P/N to Q/R/S */}
              <line x1="30%" y1="430" x2="25%" y2="510" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="30%" y1="430" x2="50%" y2="510" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="70%" y1="430" x2="50%" y2="510" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <line x1="70%" y1="430" x2="75%" y2="510" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              
              {/* W connection to K */}
              <line x1="5%" y1="350" x2="25%" y2="350" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Legend/Descriptions Panel from PPT */}
        <div className="w-full lg:w-1/3 lg:pl-6">
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <h4 className="font-bold text-white/90 mb-3">Tu Pináculo Personal (PPT CLASE 1)</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>A. Tarea No Aprendida</span>
                  </div>
                  <span className="font-bold text-purple-300">{calculations.A}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>B. Mi Esencia</span>
                  </div>
                  <span className="font-bold text-blue-300">{calculations.B}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    <span>C. Vida Pasada</span>
                  </div>
                  <span className="font-bold text-purple-300">{calculations.C}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${calculations.D === 22 ? 'bg-yellow-400' : 'bg-purple-600'} rounded-full mr-2`}></div>
                    <span>D. Mi Máscara</span>
                  </div>
                  <span className={`font-bold ${calculations.D === 22 ? 'text-yellow-300' : 'text-purple-300'}`}>{calculations.D}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span>I. Núm. del Subconsciente</span>
                  </div>
                  <span className="font-bold text-yellow-300">{calculations.I}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${calculations.J === 11 ? 'bg-yellow-400' : 'bg-blue-600'} rounded-full mr-2`}></div>
                    <span>J. Número del Inconsciente</span>
                  </div>
                  <span className={`font-bold ${calculations.J === 11 ? 'text-yellow-300' : 'text-blue-300'}`}>{calculations.J}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <h4 className="font-bold text-white/90 mb-3">Números Negativos</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>P. Mi Sombra</span>
                  </div>
                  <span className="font-bold text-rose-300">{calculations.P}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span>O. Número de Inconsciente Negativo</span>
                  </div>
                  <span className="font-bold text-rose-300">{calculations.O}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span>Q. Ser Inferior 1</span>
                  </div>
                  <span className="font-bold text-rose-300">{calculations.Q}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                    <span>R. Ser Inferior 2</span>
                  </div>
                  <span className="font-bold text-rose-300">{calculations.R}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${calculations.S === 11 ? 'bg-yellow-400' : 'bg-red-600'} rounded-full mr-2`}></div>
                    <span>S. Ser Inferior 3</span>
                  </div>
                  <span className={`font-bold ${calculations.S === 11 ? 'text-yellow-300' : 'text-rose-300'}`}>{calculations.S}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-900 mb-2">🎭 DIAGRAMA DEL PINÁCULO</h3>
        <p className="text-gray-600">
          Visualización interactiva de tu mapa numerológico basado en tu fecha de nacimiento.
        </p>
      </div>

      {/* Main Diagram */}
      <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
        {renderDiagram()}
      </div>

      {/* Detailed Descriptions */}
      {SHOW_DETAIL_PANELS && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200 shadow-lg">
            <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
              <div className="w-6 h-6 bg-green-600 rounded-full mr-3"></div>
              Etapas de Realización
            </h4>
            <div className="space-y-3">
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">E. Primera Realización</span>
                  <span className="text-xl font-bold text-green-600">{calculations.E}</span>
                </div>
                <p className="text-sm text-gray-600">Edad: 0-27 años - Formación de la personalidad</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">F. Segunda Realización</span>
                  <span className="text-xl font-bold text-green-600">{calculations.F}</span>
                </div>
                <p className="text-sm text-gray-600">Edad: 28-36 años - Desarrollo profesional</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">G. Tercera Realización</span>
                  <span className="text-xl font-bold text-green-600">{calculations.G}</span>
                </div>
                <p className="text-sm text-gray-600">Edad: 37-45 años - Madurez y consolidación</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">H. Destino Final</span>
                  <span className="text-xl font-bold text-blue-600">{calculations.H}</span>
                </div>
                <p className="text-sm text-gray-600">Edad: 46+ años - Propósito de vida</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200 shadow-lg">
            <h4 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
              Identidad Central
            </h4>
            <div className="space-y-3">
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">A. Número de Karma</span>
                  <span className="text-xl font-bold text-green-600">{calculations.A}</span>
                </div>
                <p className="text-sm text-gray-600">Mi tarea pendiente - Lo que vine a aprender</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">B. Número Personal</span>
                  <span className="text-xl font-bold text-blue-600">{calculations.B}</span>
                </div>
                <p className="text-sm text-gray-600">¿Quién soy? - Mi verdadera esencia</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">C. Vida Pasada</span>
                  <span className="text-xl font-bold text-green-600">{calculations.C}</span>
                </div>
                <p className="text-sm text-gray-600">¿Quién fui? - Experiencias anteriores</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">D. Personalidad</span>
                  <span className="text-xl font-bold text-purple-600">{calculations.D}</span>
                </div>
                <p className="text-sm text-gray-600">Mi máscara - Cómo me ven otros</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200 shadow-lg">
            <h4 className="font-bold text-purple-800 mb-4 flex items-center text-lg">
              <div className="w-6 h-6 bg-purple-600 rounded-full mr-3"></div>
              Aspectos Profundos
            </h4>
            <div className="space-y-3">
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">I. Subconsciente</span>
                  <span className="text-xl font-bold text-purple-600">{calculations.I}</span>
                </div>
                <p className="text-sm text-gray-600">La guía a mi destino - Intuición interna</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">J. Inconsciente</span>
                  <span className="text-xl font-bold text-blue-600">{calculations.J}</span>
                </div>
                <p className="text-sm text-gray-600">Mi espejo - Reflejo interno</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">P. Sombra</span>
                  <span className="text-xl font-bold text-red-600">{calculations.P}</span>
                </div>
                <p className="text-sm text-gray-600">Número de sombra - Aspectos ocultos</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PinaculoDiagram
