'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useComputedValues } from '@/hooks/useComputedValues'
import positionsJson from '@/data/pinaculo-positions.json'
const defaultPositions: Record<string, { x: number; y: number }> = positionsJson as any
const STORAGE_KEY = 'pinaculo-editor-positions'
import { PinnacleStructure, PinaculoCalculator, PinaculoResults } from '@/types/pinaculo'
import structureDataJson from '@/data/pinaculo-structure.json'
import accurateData from '@/data/pinaculo-diagram-accurate.json'

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
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>(defaultPositions)
  const connections = useMemo(() => {
    const p = (accurateData as any)?.pinnacle?.connections as Array<{ from: string; to: string; type: 'calculation' | 'negative' | 'base' }>
    return Array.isArray(p) ? p : []
  }, [])
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

  // Map calculations to flat values for rendering (always call to keep hooks order stable)
  const values = useComputedValues(calculations)

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

  // Load saved positions (if any) from localStorage so the main diagram reflects editor changes
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, { x: number; y: number }>
        const normalized: Record<string, { x: number; y: number }> = {}
        for (const k of Object.keys(parsed)) {
          const p = parsed[k]
          // Accept both 0..1 and 0..100; normalize to 0..1 for the main diagram
          const nx = p.x > 1 ? p.x / 100 : p.x
          const ny = p.y > 1 ? p.y / 100 : p.y
          normalized[k] = { x: nx, y: ny }
        }
        setLocalPositions((prev) => ({ ...prev, ...normalized }))
      }
    } catch {}
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
        {/* Main Diagram using the principal SVG layout only with numbers */}
        <div className="flex-1 flex justify-center overflow-x-auto">
          <div className="relative min-w-max w-[700px] h-[600px]">
            {/* Background SVG removed per request so only our rendering is visible */}
            {/* Connections removed per request */}
            {Object.keys(localPositions).map((key) => {
              const pos = (localPositions as any)[key]
              const val = (values as any)[key]
              if (typeof val === 'undefined') return null
              // Force vertical alignment for central column: H,G,I,B,O,M,N,R share B's X
              const centralKeys = ['H','G','I','B','O','M','N','R']
              const bx = (localPositions as any)['B']?.x ?? pos.x
              // Alignment: (E,K,Q) share A's X; (F,C,L,S) share C's X
              // New vertical axis: (J,D,X,Y) share D's X
              const leftColumn = ['E','K','Q','W','P']
              const rightColumn = ['F','C','L','S']
              const rightDXColumn = ['J','D','X','Y']
              const ax = (localPositions as any)['A']?.x ?? pos.x
              const cx = (localPositions as any)['C']?.x ?? pos.x
              const dx = (localPositions as any)['D']?.x ?? pos.x
              // Pull side columns slightly toward the center (closer to B) to reduce the gap
              // For left column keep near A but slightly outward for breathing room
              const leftAdjustedX = Math.max(0, ax - 0.01)
              // For F/C/L/S keep vertical on C and a little farther from the center (outward)
              const rightAdjustedX = Math.min(1, cx + 0.02)
              const baseX = centralKeys.includes(key)
                ? bx
                : leftColumn.includes(key)
                ? leftAdjustedX
                : rightDXColumn.includes(key)
                ? dx
                : rightColumn.includes(key)
                ? rightAdjustedX
                : pos.x
              // Align T vertically with R (center of Q-R-S row)
              let adjBaseX = baseX
              if (key === 'T') {
                // Align T with the central vertical axis (same as R which uses B's X)
                adjBaseX = bx
              }
              const renderX = Math.min(1, Math.max(0, adjBaseX))

              // Horizontal alignment by rows
              const iy = (localPositions as any)['I']?.y ?? pos.y
              const gy = (localPositions as any)['G']?.y ?? (iy - 0.08)
              const step = Math.abs(iy - gy) || 0.08
              // Slightly larger gaps below I (between EIFJ -> ABCD) and below B (ABCD -> KOLX)
              const gapAfterEIFJ = step * 1.18
              const gapAfterABCD = step * 1.22
              const yEIFJ = iy
              const yABCD = yEIFJ + gapAfterEIFJ
              const yKOLX = yABCD + gapAfterABCD
              const yWMY = yKOLX + step
              const yPN = yWMY + step
              const yQRS = yPN + step
              const yRow = {
                H: Math.max(0, gy - step),
                G: gy,
                EIFJ: yEIFJ,
                ABCD: yABCD,
                KOLX: yKOLX,
                WMY: yWMY,
                PN: yPN,
                QRS: yQRS,
              }
              const rowEIFJ = ['E','I','F','J']
              const rowABCD = ['A','B','C','D']
              const rowKOLX = ['K','O','L','X']
              const rowWMY = ['W','M','Y']
              const rowPN = ['P','N']
              const rowQRS = ['Q','R','S']
              let baseY = key === 'H' ? yRow.H
                : key === 'G' ? yRow.G
                : rowEIFJ.includes(key) ? yRow.EIFJ
                : rowABCD.includes(key) ? yRow.ABCD
                : rowKOLX.includes(key) ? yRow.KOLX
                : rowWMY.includes(key) ? yRow.WMY
                : rowPN.includes(key) ? yRow.PN
                : rowQRS.includes(key) ? yRow.QRS
                : pos.y
              const left = `${renderX * 100}%`
              const top = `${baseY * 100}%`
              const text = Array.isArray(val) ? val.join(', ') : val
              const isSquareYellow = key === 'Z'
              const isSquareRed = key === 'T'
              const isPositive = 'EFGHIJ'.includes(key)
              const isBaseOrXY = 'ABCDXY'.includes(key)
              const isNegative = 'KOLWPMNQRST'.includes(key)

              const bgClass = isSquareYellow
                ? 'bg-yellow-400/30 border-yellow-300/40'
                : isSquareRed
                ? 'bg-rose-500/30 border-rose-400/40'
                : isPositive
                ? 'bg-green-500/25 border-green-400/40'
                : isBaseOrXY
                ? 'bg-purple-500/25 border-purple-400/40'
                : isNegative
                ? 'bg-rose-500/25 border-rose-400/40'
                : 'bg-white/10 border-white/30'

              // Only B should be larger; others slightly smaller for clarity
              const sizeClass = key === 'B' ? 'w-14 h-14' : 'w-9 h-9'
              const shapeClass = isSquareYellow || isSquareRed ? `rounded-md ${sizeClass}` : `rounded-full ${sizeClass}`

              return (
                <div key={key} className="absolute -translate-x-1/2 -translate-y-1/2 text-white/90 font-extrabold drop-shadow flex flex-col items-center" style={{ left, top }}>
                  <div className={`flex items-center justify-center border ${bgClass} ${shapeClass}`}>
                    <span className={key === 'B' ? 'text-[18px] leading-none' : 'text-[14px] leading-none'}>{text}</span>
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-white/70 text-center">{key}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend/Descriptions Panel (updated) */}
        <div className="w-full lg:w-1/3 lg:pl-6">
          <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 divide-y divide-white/10">
            <h4 className="font-bold text-white/90 mb-4">🔢 Números y sus Significados</h4>

            {/* Purple group */}
            <div className="text-sm">
              <LegendRow color="purple" label="A. Número de Karma – Mi tarea pendiente" value={calculations.A} />
              <LegendRow color="purple" label="B. Número personal – ¿Quién soy?" value={calculations.B} />
              <LegendRow color="purple" label="C. Número de vida pasada – ¿Quién fui?" value={calculations.C} />
              <LegendRow color="purple" label="D. Número de personalidad – Mi máscara" value={calculations.D} />
            </div>

            {/* Green group */}
            <div className="text-sm">
              <LegendRow color="green" label="I. Número del subconsciente – La guía a mi destino" value={calculations.I} />
              <LegendRow color="green" label="J. Número del inconsciente – Mi espejo" value={calculations.J} />
            </div>

            {/* Red group */}
            <div className="text-sm">
              <LegendRow color="red" label="P. Número de sombra" value={calculations.P} />
              <LegendRow color="red" label="O. Número de inconsciente negativo" value={calculations.O} />
              <LegendRow color="red" label="Q. Ser inferior heredado por familia" value={calculations.Q} />
              <LegendRow color="red" label="R. Ser inferior consciente" value={calculations.R} />
              <LegendRow color="red" label="S. Ser inferior latente" value={calculations.S} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Small legend row component for consistency
  function LegendRow({ color, label, value }: { color: 'purple' | 'green' | 'red'; label: string; value: number }) {
    const badgeBg = color === 'purple' ? 'bg-purple-500/20 text-purple-200' : color === 'green' ? 'bg-green-500/20 text-green-200' : 'bg-rose-500/20 text-rose-200'
    return (
      <div className="py-2">
        <div className="flex items-center justify-between">
          <span className="text-white/85 font-semibold text-sm leading-snug">{label}</span>
          <span className={`shrink-0 ml-3 px-2 py-0.5 rounded ${badgeBg} text-sm font-bold`}>{value}</span>
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
