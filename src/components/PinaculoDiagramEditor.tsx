'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DraggableContainer } from '@/components/DraggableContainer'
import accurateData from '@/data/pinaculo-diagram-accurate.json'

type NodePos = { x: number; y: number }

type EditorNode = {
  id: string
  letter: string
  name: string
  position: NodePos
  color?: string
  type?: string
}

type EditorConnection = {
  from: string
  to: string
  type: 'calculation' | 'negative' | 'base' | 'direct'
}

type AccurateJson = {
  pinnacle?: {
    title: string
    version: string
    nodes: Record<string, {
      id: string
      letter: string
      name: string
      position: NodePos
      color?: string
      type?: string
    }>
    connections: EditorConnection[]
    display?: any
  }
}

// Utilities
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const STORAGE_KEY = 'pinaculo-editor-positions'

export function PinaculoDiagramEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showBg, setShowBg] = useState(true)
  const [bgOpacity, setBgOpacity] = useState(0.35)
  const [scale, setScale] = useState(1)
  const [snap, setSnap] = useState(true)
  const [snapStep, setSnapStep] = useState(1) // percent
  const [dragging, setDragging] = useState<string | null>(null)
  const dragStart = useRef<{ id: string; startX: number; startY: number; orig: NodePos } | null>(null)
  const [showConnections, setShowConnections] = useState(false)

  const pinnacle = (accurateData as unknown as AccurateJson).pinnacle
  const initialNodes = useMemo(() => {
    const entries = pinnacle ? Object.values(pinnacle.nodes) : []
    return entries
      .map(n => ({
        id: n.id,
        letter: n.letter,
        name: n.name,
        position: { x: n.position.x, y: n.position.y },
        color: (n as any).color,
        type: (n as any).type
      }))
  }, [pinnacle])

  const [nodes, setNodes] = useState<Record<string, EditorNode>>({})

  // Load positions from storage or JSON
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    const base: Record<string, EditorNode> = {}
    initialNodes.forEach(n => { base[n.letter] = n })
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, NodePos>
        for (const key of Object.keys(parsed)) {
          if (base[key]) base[key] = { ...base[key], position: parsed[key] }
        }
      } catch {}
    }
    setNodes(base)
  }, [initialNodes])

  // Mouse handlers for dragging nodes inside container (percent coordinates)
  const onMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const node = nodes[id]
    if (!node) return
    dragStart.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...node.position }
    }
    setDragging(id)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || !dragStart.current) return
    const { id, startX, startY, orig } = dragStart.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    // Convert pixel delta to percentage relative to container size
    const pxToPctX = (dx / rect.width) * 100
    const pxToPctY = (dy / rect.height) * 100
    let newX = clamp(orig.x + pxToPctX, 0, 100)
    let newY = clamp(orig.y + pxToPctY, 0, 100)
    if (snap) {
      const s = Math.max(0.25, snapStep)
      newX = Math.round(newX / s) * s
      newY = Math.round(newY / s) * s
    }
    setNodes(prev => ({
      ...prev,
      [id]: { ...prev[id], position: { x: newX, y: newY } }
    }))
  }

  const onMouseUp = () => {
    setDragging(null)
    dragStart.current = null
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    // Auto-save positions after drag
    const positions: Record<string, NodePos> = {}
    Object.values(nodes).forEach(n => { positions[n.letter] = n.position })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    } catch {}
  }

  // Export helpers
  const saveToLocalStorage = () => {
    const positions: Record<string, NodePos> = {}
    Object.values(nodes).forEach(n => { positions[n.letter] = n.position })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  }

  const exportJson = () => {
    // Build a structure similar to the accurate JSON but with updated positions
    const out = {
      pinnacle: {
        ...(pinnacle || {}),
        nodes: Object.fromEntries(
          Object.values(nodes).map(n => [n.letter, {
            id: n.id,
            letter: n.letter,
            name: n.name,
            position: { x: n.position.x, y: n.position.y },
            color: n.color,
            type: n.type
          }])
        )
      }
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pinaculo-diagram-updated.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetFromJson = () => {
    const base: Record<string, EditorNode> = {}
    initialNodes.forEach(n => { base[n.letter] = n })
    setNodes(base)
  }

  const sizeStyle = useMemo(() => ({ width: 1100 * scale, height: 650 * scale }), [scale])

  const connections: EditorConnection[] = useMemo(() => {
    return (pinnacle?.connections || [])
  }, [pinnacle])

  const getPos = (letter: string) => nodes[letter]?.position || { x: 0, y: 0 }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center bg-white border rounded-lg p-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showBg} onChange={e => setShowBg(e.target.checked)} />
          <span>Mostrar fondo de referencia</span>
        </label>
        <label className="flex items-center gap-2">
          Opacidad
          <input type="range" min={0} max={1} step={0.05} value={bgOpacity} onChange={e => setBgOpacity(parseFloat(e.target.value))} />
        </label>
        <label className="flex items-center gap-2">
          Zoom
          <input type="range" min={0.6} max={1.6} step={0.05} value={scale} onChange={e => setScale(parseFloat(e.target.value))} />
          <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} />
          <span>Snap</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showConnections} onChange={e => setShowConnections(e.target.checked)} />
          <span>Mostrar conectores</span>
        </label>
        <label className="flex items-center gap-2">
          Paso
          <input type="number" className="w-16 border rounded px-2 py-1" min={0.25} step={0.25} value={snapStep} onChange={e => setSnapStep(parseFloat(e.target.value || '1'))} />%
        </label>
        <button onClick={saveToLocalStorage} className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar local</button>
        <button onClick={exportJson} className="px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700">Exportar JSON</button>
        <button onClick={resetFromJson} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
      </div>

  <DraggableContainer title="🧩 Editor de Diagrama del Pináculo" className="w-[min(98vw,1200px)]" initialPosition={{ x: 40, y: 40 }}>
        <div className="relative" style={{ ...sizeStyle }} ref={containerRef}>
          {/* Background reference image */}
          {showBg && (
            <img
              src="/pinaculo_page_1.svg"
              alt="Referencia"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ opacity: bgOpacity }}
            />
          )}

          {/* Connections (dynamic from JSON) */}
          {showConnections && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((c, idx) => {
                const a = getPos(c.from)
                const b = getPos(c.to)
                const stroke = c.type === 'negative' ? '#EF4444' : c.type === 'base' ? '#9333EA' : '#3B82F6'
                return (
                  <line key={idx}
                    x1={`${a.x}%`} y1={`${a.y}%`}
                    x2={`${b.x}%`} y2={`${b.y}%`}
                    stroke={stroke} strokeWidth={2} />
                )
              })}
            </svg>
          )}

          {/* Nodes (no external names; just the letter for alignment guidance) */}
          {Object.values(nodes).map(n => (
            <div
              key={n.letter}
              className="absolute select-none"
              style={{ left: `${n.position.x}%`, top: `${n.position.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseDown={(e) => onMouseDownNode(e, n.letter)}
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-md ${dragging === n.letter ? 'ring-4 ring-purple-300' : ''}`}
                   style={{ backgroundColor: '#ffffffcc', borderColor: '#c4b5fd' }}>
                <span className="font-bold text-lg text-gray-900">{n.letter}</span>
              </div>
            </div>
          ))}
        </div>
      </DraggableContainer>
    </div>
  )
}

export default PinaculoDiagramEditor
