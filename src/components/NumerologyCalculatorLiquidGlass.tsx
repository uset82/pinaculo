'use client'

import React, { useState, useEffect } from 'react'
import { useClientOnly } from '@/utils/clientOnly'
import dynamic from 'next/dynamic'
// Load lazily to avoid any SSR/import mismatches
const PinaculoDiagram = dynamic(() => import('./PinaculoDiagram').then(m => m.default), { ssr: false })
import { PinaculoCalculator } from '@/types/pinaculo'

interface NumerologyCalculatorProps {
  isPreviewMode?: boolean
}

type UIReport = {
  baseNumbers: { A: number; B: number; C: number };
  positiveNumbers: { D: number; E: number; F: number; G: number; H: number; I: number; J: number; X: number; Y: number; Z: number };
  negativeNumbers: { K: number; L: number; M: number; N: number; O: number; P: number; Q: number; R: number; S: number };
  W: number | number[];
  T: number | number[];
  summary: { alma: number; personalidad: number; numeroPersonal: number; esencia: number; mision: number; regaloDivino: number };
  interpretations?: Record<string, string>;
}

const chaldeanMap: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
}

const reducePreservingMasters = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num
  while (num > 9) {
    num = num.toString().split('').reduce((s, d) => s + parseInt(d), 0)
    if (num === 11 || num === 22 || num === 33) return num
  }
  return num
}

const calcNameTotal = (name: string): number => {
  const clean = name
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/ñ/gi, 'n').toUpperCase().replace(/[^A-Z]/g, '')
  const sum = clean.split('').reduce((s, c) => s + (chaldeanMap[c] || 0), 0)
  return reducePreservingMasters(sum)
}

const calcAlma = (name: string): number => {
  const clean = name
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/ñ/gi, 'n').toUpperCase().replace(/[^A-Z]/g, '')
  const vowels = clean.split('').filter(c => 'AEIOU'.includes(c))
  const sum = vowels.reduce((s, c) => s + (chaldeanMap[c] || 0), 0)
  return reducePreservingMasters(sum)
}

const calcPersonalidad = (name: string): number => {
  const clean = name
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/ñ/gi, 'n').toUpperCase().replace(/[^A-Z]/g, '')
  const consonants = clean.split('').filter(c => /[A-Z]/.test(c) && !'AEIOU'.includes(c))
  const sum = consonants.reduce((s, c) => s + (chaldeanMap[c] || 0), 0)
  return reducePreservingMasters(sum)
}

export function NumerologyCalculatorLiquidGlass({ isPreviewMode = false }: NumerologyCalculatorProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<UIReport | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isClient = useClientOnly()

  // Helpers to convert between native <input type="date"> value (YYYY-MM-DD)
  // and our internal DD/MM/YYYY string representation
  const toIsoFromDmy = (dmy: string): string => {
    if (!dmy || !/\d{1,2}\/\d{1,2}\/\d{4}/.test(dmy)) return ''
    const [d, m, y] = dmy.split('/')
    const dd = d.padStart(2, '0')
    const mm = m.padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }

  const toDmyFromIso = (iso: string): string => {
    if (!iso || !/\d{4}-\d{2}-\d{2}/.test(iso)) return ''
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  const getNegativeAccentClasses = (key: string): string => {
    switch (key) {
      case 'K':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'L':
        return 'bg-blue-500/20 text-blue-300'
      case 'M':
        return 'bg-green-500/20 text-green-300'
      case 'N':
        return 'bg-purple-500/20 text-purple-300'
      case 'O':
        return 'bg-rose-500/20 text-rose-300'
      case 'P':
        return 'bg-rose-500/20 text-rose-300'
      case 'Q':
        return 'bg-lime-500/20 text-lime-300'
      case 'R':
        return 'bg-cyan-500/20 text-cyan-300'
      case 'S':
        return 'bg-orange-500/20 text-orange-300'
      case 'W':
        return 'bg-teal-500/20 text-teal-300'
      case 'T':
        return 'bg-slate-500/20 text-slate-300'
      default:
        return 'bg-white/10 text-white/90'
    }
  }

  const getPositiveAccentClasses = (key: string): string => {
    switch (key) {
      case 'E':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'F':
        return 'bg-blue-500/20 text-blue-300'
      case 'G':
        return 'bg-green-500/20 text-green-300'
      case 'H':
        return 'bg-purple-500/20 text-purple-300'
      case 'I':
        return 'bg-cyan-500/20 text-cyan-300'
      case 'J':
        return 'bg-indigo-500/20 text-indigo-300'
      case 'X':
        return 'bg-rose-500/20 text-rose-300'
      case 'Y':
        return 'bg-amber-500/20 text-amber-300'
      case 'Z':
        return 'bg-orange-500/20 text-orange-300'
      default:
        return 'bg-white/10 text-white/90'
    }
  }

  // Preview mode data
  const previewData = {
    name: 'Carlos Carpio',
    birthDate: '06/05/1982'
  }

  // Auto-calculate in preview mode
  useEffect(() => {
    if (isPreviewMode && isClient && !result) {
      handleCalculate(true)
    }
  }, [isPreviewMode, isClient])

  const handleCalculate = async (isPreview = false) => {
    const currentName = isPreview ? previewData.name : name
    const currentBirthDate = isPreview ? previewData.birthDate : birthDate
    
    if (!isPreview) {
      if (!currentName.trim() || !currentBirthDate) {
        setError('Por favor ingresa tu nombre completo y fecha de nacimiento')
        return
      }

      // Validate date format
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
      if (!dateRegex.test(currentBirthDate)) {
        setError('Por favor ingresa la fecha en formato DD/MM/YYYY (ejemplo: 06/05/1982)')
        return
      }
    }

    setCalculating(true)
    setError(null)
    
    try {
      console.log('🔮 Calculando tu Mapa Numerológico (local)...')

      const [dStr, mStr, yStr] = currentBirthDate.split('/')
      const day = parseInt(dStr, 10)
      const month = parseInt(mStr, 10)
      const year = parseInt(yStr, 10)

      const calc = PinaculoCalculator.calculateComplete(currentName.trim(), day, month, year)

      const alma = calcAlma(currentName)
      const personalidad = calcPersonalidad(currentName)
      const numeroPersonal = calcNameTotal(currentName)

      const built: UIReport = {
        baseNumbers: { A: calc.A, B: calc.B, C: calc.C },
        positiveNumbers: { D: calc.D, E: calc.E, F: calc.F, G: calc.G, H: calc.H, I: calc.I, J: calc.J, X: calc.X, Y: calc.Y, Z: calc.Z },
        negativeNumbers: { K: calc.K, L: calc.L, M: calc.M, N: calc.N, O: calc.O, P: calc.P, Q: calc.Q, R: calc.R, S: calc.S },
        W: calc.W,
        T: calc.T,
        summary: {
          esencia: calc.B,
          mision: calc.Y,
          alma,
          personalidad,
          numeroPersonal,
          regaloDivino: calc.Z
        },
        interpretations: {}
      }

      setResult(built)
      console.log('✅ Cálculo local completado:', built)
      
    } catch (err) {
      console.error('❌ Error en el cálculo:', err)
      setError('Error al calcular tu mapa numerológico. Por favor intenta nuevamente.')
    } finally {
      setCalculating(false)
    }
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   await handleCalculate(false)
  // }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="liquid-glass-card max-w-md mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-purple-200 rounded mb-4"></div>
            <div className="h-4 bg-purple-200 rounded mb-2"></div>
            <div className="h-4 bg-purple-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Primera caja centrada para entrada de datos */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <div className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">1. Nombre Completo</h3>
            </div>
            <div className="space-y-3">
              {isPreviewMode && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-yellow-300">
                    <span className="mr-2">👁️</span>
                    <strong>Vista Previa:</strong> Datos de muestra
                  </div>
                </div>
              )}
              <input 
                type="text" 
                value={isPreviewMode ? previewData.name : name}
                onChange={(e) => !isPreviewMode && setName(e.target.value)}
                placeholder="Escriba aquí"
                className="w-full h-12 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-black placeholder-white/60 focus:border-white/40 focus:bg-white/15 transition-all text-base font-semibold"
                disabled={isPreviewMode}
              />
              <p className="text-white/70 text-sm">
                Tu nombre completo será analizado para revelar las energías numerológicas presentes.
              </p>
              {/* 2. Fecha de Nacimiento */}
              <div className="pt-2">
                <div className="text-white/90 font-bold mb-2">2. Fecha de Nacimiento</div>
              </div>

              {/* Better birthday input with native date picker + fallback formatting */}
              <div className="flex gap-2 items-center">
                <div className="relative w-full">
                  <input
                  type="date"
                  aria-label="Fecha de nacimiento"
                  value={isPreviewMode ? toIsoFromDmy(previewData.birthDate) : toIsoFromDmy(birthDate)}
                  onChange={(e) => {
                    if (isPreviewMode) return
                    const iso = e.target.value
                    setBirthDate(toDmyFromIso(iso))
                  }}
                  className={`relative z-0 w-full h-12 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl placeholder-white/60 focus:border-white/40 focus:bg-white/15 transition-all appearance-none text-black text-base font-semibold ${!birthDate ? 'date-empty' : ''}`}
                  disabled={isPreviewMode}
                />
                  {!isPreviewMode && !birthDate && (
                    <span className="pointer-events-none absolute z-10 left-4 top-1/2 -translate-y-1/2 text-black text-base font-semibold leading-none">
                      Día / mes / año
                    </span>
                  )}
                </div>
              </div>
              {/* Removed helper text per request */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {!isPreviewMode && (
                <button
                  onClick={() => handleCalculate(false)}
                  disabled={calculating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm border border-purple-400/30 text-white/90 hover:from-purple-500/30 hover:to-blue-500/30 transition-all disabled:opacity-50"
                >
                  {calculating ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Calculando...
                    </span>
                  ) : (
                    '🔮 Calcular Mi Mapa'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados en grid cuando hay datos */}
      {result && (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* 2. La Energía de tu Nombre */}
          <div className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">2. La Energía de tu Nombre</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-pink-300">{result.summary.alma}</div>
                  <div className="text-xs text-white/70">MI ALMA</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-emerald-300">{result.summary.personalidad}</div>
                  <div className="text-xs text-white/70">EXPRESIÓN</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-orange-300">{result.summary.numeroPersonal}</div>
                  <div className="text-xs text-white/70">PODER</div>
                </div>
              </div>
              <p className="text-white/70 text-sm">
                Números principales derivados de tu nombre completo.
              </p>
            </div>
          </div>

          {/* 3. Horizontal Numerológico */}
          <div className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">3. Horizontal Numerológico</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-lg font-bold text-blue-300">{result.baseNumbers.A}</div>
                  <div className="text-xs text-white/70">TAREA NO APRENDIDA</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-lg font-bold text-green-300">{result.baseNumbers.B}</div>
                  <div className="text-xs text-white/70">MI ESENCIA</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-lg font-bold text-purple-300">{result.baseNumbers.C}</div>
                  <div className="text-xs text-white/70">VIDA PASADA</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-lg font-bold text-orange-300">{result.positiveNumbers.D}</div>
                  <div className="text-xs text-white/70">MI MÁSCARA</div>
                </div>
              </div>
            </div>
          </div>
          {/* Cierre del grid de resultados */}
        </div>
        )}

        {/* 4. ✨ Talentos */}
        {result && (
          <div id="box-4" data-section="talentos" className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">4. Talentos</h3>
            </div>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                {/* E */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">E - IMPLANTACIÓN DEL PROGRAMA</h4>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-sm font-bold">{result.positiveNumbers.E}</span>
                  </div>
                  {result.interpretations?.E && (
                    <p className="text-white/70 text-xs">{result.interpretations.E.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* F */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">F - ENCUENTRO CON TU MAESTRO</h4>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-sm font-bold">{result.positiveNumbers.F}</span>
                  </div>
                  {result.interpretations?.F && (
                    <p className="text-white/70 text-xs">{result.interpretations.F.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* G */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">G - RE-IDENTIFICACIÓN CON TU YO</h4>
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 text-sm font-bold">{result.positiveNumbers.G}</span>
                  </div>
                  {result.interpretations?.G && (
                    <p className="text-white/70 text-xs">{result.interpretations.G.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* H */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">H - TU DESTINO</h4>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-sm font-bold">{result.positiveNumbers.H}</span>
                  </div>
                  {result.interpretations?.H && (
                    <p className="text-white/70 text-xs">{result.interpretations.H.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* I */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">I - INCONSCIENTE</h4>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-sm font-bold">{result.positiveNumbers.I}</span>
                  </div>
                  {result.interpretations?.I && (
                    <p className="text-white/70 text-xs">{result.interpretations.I.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* J */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">J - MI ESPEJO</h4>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-sm font-bold">{result.positiveNumbers.J}</span>
                  </div>
                  {result.interpretations?.J && (
                    <p className="text-white/70 text-xs">{result.interpretations.J.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* X */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">X - REACCIÓN</h4>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-sm font-bold">{result.positiveNumbers.X}</span>
                  </div>
                  {result.interpretations?.X && (
                    <p className="text-white/70 text-xs">{result.interpretations.X.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* Y */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">Y - MISIÓN</h4>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-sm font-bold">{result.positiveNumbers.Y}</span>
                  </div>
                  {result.interpretations?.Y && (
                    <p className="text-white/70 text-xs">{result.interpretations.Y.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
                {/* Z */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">Z - REGALO DIVINO</h4>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-sm font-bold">{result.positiveNumbers.Z}</span>
                  </div>
                  {result.interpretations?.Z && (
                    <p className="text-white/70 text-xs">{result.interpretations.Z.split(': ').slice(1).join(': ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Identidad Central */}
        {result && (
          <div id="box-5" data-section="identidad" className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">5. Identidad Central</h3>
            </div>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* K */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">K - ADOLESCENCIA</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('K')}`}>{result.negativeNumbers.K}</span>
                  </div>
                </div>
                {/* L */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">L - JUVENTUD</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('L')}`}>{result.negativeNumbers.L}</span>
                  </div>
                </div>
                {/* M */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">M - ADULTEZ</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('M')}`}>{result.negativeNumbers.M}</span>
                  </div>
                </div>
                {/* N */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">N - ADULTO MAYOR</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('N')}`}>{result.negativeNumbers.N}</span>
                  </div>
                </div>
                {/* O */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">O - INCONSCIENTE NEGATIVO</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('O')}`}>{result.negativeNumbers.O}</span>
                  </div>
                </div>
                {/* P */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">P - MI SOMBRA</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('P')}`}>{result.negativeNumbers.P}</span>
                  </div>
                </div>
                {/* Q */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">Q - SER INFERIOR 1</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('Q')}`}>{result.negativeNumbers.Q}</span>
                  </div>
                </div>
                {/* R */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">R - SER INFERIOR 2</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('R')}`}>{result.negativeNumbers.R}</span>
                  </div>
                </div>
                {/* S */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">S - SER INFERIOR 3</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('S')}`}>{result.negativeNumbers.S}</span>
                  </div>
                </div>
                {/* W */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">W - TRIPLICIDAD</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('W')}`}>{Array.isArray(result.W) ? result.W.join(', ') : result.W}</span>
                  </div>
                </div>
                {/* T */}
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">T - NÚMEROS AUSENTES</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('T')}`}>
                      {Array.isArray(result.T) ? result.T.join(', ') : (result.T ?? '—')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. Etapas de Realización */}
        {result && (
          <div id="box-6" data-section="etapas" className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">6. Etapas de Realización</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">E. Primera Realización</h4>
                  <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-sm font-bold">{result.positiveNumbers.E}</span>
                </div>
                <p className="text-white/70 text-xs">Edad: 0-27 años - Formación de la personalidad</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">F. Segunda Realización</h4>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-sm font-bold">{result.positiveNumbers.F}</span>
                </div>
                <p className="text-white/70 text-xs">Edad: 28-36 años - Desarrollo profesional</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">G. Tercera Realización</h4>
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 text-sm font-bold">{result.positiveNumbers.G}</span>
                </div>
                <p className="text-white/70 text-xs">Edad: 37-45 años - Madurez y consolidación</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">H. Destino Final</h4>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-sm font-bold">{result.positiveNumbers.H}</span>
                </div>
                <p className="text-white/70 text-xs">Edad: 46+ años - Propósito de vida</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. Diagrama del Pináculo */}
        {result && (
          <div className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">🔺</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">7. Diagrama del Pináculo</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <PinaculoDiagram 
                birthDay={parseInt((isPreviewMode ? previewData.birthDate : birthDate).split('/')[0])}
                birthMonth={parseInt((isPreviewMode ? previewData.birthDate : birthDate).split('/')[1])}
                birthYear={parseInt((isPreviewMode ? previewData.birthDate : birthDate).split('/')[2])}
                name={isPreviewMode ? previewData.name : name}
                />
              </div>
              <div className="text-center mt-3">
                <p className="text-white/70 text-xs">Representación visual de tu estructura numerológica completa</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. Aspectos Profundos */}
        {result && (
          <div className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">8. Aspectos Profundos</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">I. Subconsciente</h4>
                  <span className={`px-2 py-0.5 rounded text-sm font-bold ${getPositiveAccentClasses('I')}`}>{result.positiveNumbers.I}</span>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">J. Inconsciente</h4>
                  <span className={`px-2 py-0.5 rounded text-sm font-bold ${getPositiveAccentClasses('J')}`}>{result.positiveNumbers.J}</span>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white/90 text-sm">P. Sombra</h4>
                  <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('P')}`}>{result.negativeNumbers.P}</span>
                </div>
              </div>
              
              {/* Agregar otros aspectos si están disponibles */}
              {result.W && (
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">W. Triplicidad</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('W')}`}>{Array.isArray(result.W) ? result.W.join(', ') : result.W}</span>
                  </div>
                </div>
              )}
              
              {result.T && (
                <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white/90 text-sm">T. Números Ausentes</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-bold ${getNegativeAccentClasses('T')}`}>
                      {Array.isArray(result.T) ? result.T.join(', ') : result.T || 'Ninguno'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. Interpretación del Pináculo por IA */}
        {result && (
          <div className="liquid-glass-card p-6 hover:scale-105 transition-all duration-300 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white/90 drop-shadow">9. Interpretación del Pináculo por IA</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg backdrop-blur-sm border border-purple-400/20">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-300 text-sm font-semibold">IA Numerológica Activa</span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-yellow-300 mb-2">🔮 Análisis de Etapas de Realización</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-yellow-300">Primera (E):</span> <span className="text-white/80">{result.positiveNumbers.E} - Formación base</span></div>
                      <div><span className="text-blue-300">Segunda (F):</span> <span className="text-white/80">{result.positiveNumbers.F} - Desarrollo profesional</span></div>
                      <div><span className="text-green-300">Tercera (G):</span> <span className="text-white/80">{result.positiveNumbers.G} - Consolidación</span></div>
                      <div><span className="text-purple-300">Destino (H):</span> <span className="text-white/80">{result.positiveNumbers.H} - Propósito final</span></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-emerald-300 mb-2">💎 Análisis de Identidad Central</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-red-300">Karma (A):</span> <span className="text-white/80">{result.baseNumbers.A} - Lección principal</span></div>
                      <div><span className="text-emerald-300">Esencia (B):</span> <span className="text-white/80">{result.baseNumbers.B} - Ser auténtico</span></div>
                      <div><span className="text-purple-300">Pasada (C):</span> <span className="text-white/80">{result.baseNumbers.C} - Bagaje anterior</span></div>
                      <div><span className="text-orange-300">Máscara (D):</span> <span className="text-white/80">{result.positiveNumbers.D} - Apariencia</span></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-cyan-300 mb-2">🌊 Aspectos Profundos</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-cyan-300">Subconsciente (I):</span> <span className="text-white/80">{result.positiveNumbers.I} - Guía interna</span></div>
                      <div><span className="text-indigo-300">Inconsciente (J):</span> <span className="text-white/80">{result.positiveNumbers.J} - Espejo interno</span></div>
                      <div><span className="text-red-300">Sombra (P):</span> <span className="text-white/80">{result.negativeNumbers.P} - Lado oculto</span></div>
                      {result.W && <div><span className="text-violet-300">Triplicidad (W):</span> <span className="text-white/80">{result.W} - Potenciación</span></div>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                  <h4 className="font-semibold text-white/90 mb-2">🎯 Síntesis IA del Pináculo</h4>
                  <p className="text-white/80 text-sm mb-3">
                    "Tu configuración numerológica revela un patrón evolutivo desde el número {result.positiveNumbers.E} en juventud 
                    hacia el {result.positiveNumbers.H} como destino final. La energía central de tu ser ({result.baseNumbers.B}) 
                    contrasta con tu máscara social ({result.positiveNumbers.D}), sugiriendo un viaje de autenticidad."
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">Alma: {result.summary.alma}</span>
                    <span className="px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-300">Expresión: {result.summary.personalidad}</span>
                    <span className="px-2 py-1 bg-orange-500/20 rounded text-xs text-orange-300">Poder: {result.summary.numeroPersonal}</span>
                  </div>
                </div>
                
                <button className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm border border-purple-400/30 text-white/90 text-sm hover:from-purple-500/30 hover:to-blue-500/30 transition-all">
                  🔮 Generar Reporte Completo IA
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
  )
}
