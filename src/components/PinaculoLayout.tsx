'use client'

import React, { useMemo, useState } from 'react'

type Positions = Record<string, { x: number; y: number }>
type Values = Record<string, number | string | number[]>

type PinaculoLayoutProps = {
  positions: Positions
  values: Values
  backgroundSrc?: string
  editable?: boolean
}

const letterToVariant = (letter: string): 'base' | 'positive' | 'negative' | 'special' => {
  if ('ABCD'.includes(letter)) return 'base'
  if ('EFGHIJXYZ'.includes(letter)) return 'positive'
  if ('KLMNOPQRS'.includes(letter)) return 'negative'
  if ('WT'.includes(letter)) return 'special'
  return 'base'
}

const variantClasses: Record<'base' | 'positive' | 'negative' | 'special', string> = {
  base: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
  positive: 'bg-green-500/20 text-green-200 border-green-400/30',
  negative: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
  special: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30',
}

export default function PinaculoLayout({ positions, values, backgroundSrc = '/pinaculo_page_1.svg', editable = false }: PinaculoLayoutProps) {
  const [currentKey, setCurrentKey] = useState<string>('A')
  const [localPositions, setLocalPositions] = useState<Positions>(positions)

  const keys = useMemo(
    () => Array.from(new Set([...Object.keys(localPositions), ...Object.keys(values)])).sort(),
    [localPositions, values]
  )

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable || !currentKey) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setLocalPositions((prev) => ({ ...prev, [currentKey]: { x, y } }))
  }

  const handleCopy = async () => {
    const json = JSON.stringify(localPositions, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      // no-op UI toast
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {editable && (
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="pinaculo-letter-select" className="text-white/80 text-sm">Colocar:</label>
          <select id="pinaculo-letter-select" name="pinaculo-letter-select" value={currentKey} aria-label="Seleccionar letra a colocar" onChange={(e) => setCurrentKey(e.target.value)} className="bg-white/10 text-white/90 text-sm rounded px-2 py-1 border border-white/20">
            {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','W','T','X','Y','Z'].map((k) => (
              <option value={k} key={k}>{k}</option>
            ))}
          </select>
          <button onClick={handleCopy} className="ml-auto px-3 py-1 rounded bg-white/10 border border-white/20 text-white/80 text-sm">
            Copiar JSON
          </button>
        </div>
      )}
      <div className="relative aspect-[7/6] rounded-lg overflow-hidden border border-white/10" onClick={handleClick}>
        <img src={backgroundSrc} alt="Pináculo base" className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none" />

        {keys.map((k) => {
          const pos = localPositions[k]
          const value = values[k]
          if (!pos) return null
          const variant = letterToVariant(k)
          const text = Array.isArray(value) ? value.join(', ') : value ?? ''
          return (
            <div
              key={k}
              className="absolute"
              style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: 'translate(-50%, -50%)' }}
              aria-label={`Posición ${k}`}
            >
              <div className={`w-12 h-12 rounded-full border ${variantClasses[variant]} backdrop-blur-sm flex items-center justify-center`}> 
                <span className="font-bold">{text as any}</span>
              </div>
              <div className="text-center text-xs text-white/80 mt-1 font-semibold">{k}</div>
            </div>
          )
        })}
      </div>
      {editable && (
        <pre className="mt-3 text-xs text-white/70 bg-white/5 p-2 rounded border border-white/10 overflow-auto max-h-40">{JSON.stringify(localPositions, null, 2)}</pre>
      )}
    </div>
  )
}


