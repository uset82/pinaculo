'use client'

import React from 'react'
import { useDraggable } from '@/hooks/useDraggable'

interface DraggableContainerProps {
  children: React.ReactNode
  title?: string
  className?: string
  initialPosition?: { x: number; y: number }
  minimizable?: boolean
}

export function DraggableContainer({ 
  children, 
  title, 
  className = '', 
  initialPosition,
  minimizable = true 
}: DraggableContainerProps) {
  const { position, isDragging, elementRef, dragHandlers, resetPosition } = useDraggable(initialPosition)
  const [isMinimized, setIsMinimized] = React.useState(false)

  return (
    <div
      ref={elementRef}
      className={`fixed z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-200 transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-3xl ring-4 ring-purple-300/50' : ''
      } ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
  maxWidth: '98vw',
        maxHeight: '90vh',
        overflow: 'hidden'
      }}
    >
      {/* Drag Handle */}
      <div
        className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={dragHandlers.onMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          {title && (
            <span className="ml-3 font-semibold text-sm">{title}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2" style={{ pointerEvents: 'auto' }}>
          {minimizable && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(!isMinimized)
              }}
              className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              <span className="text-xs">
                {isMinimized ? '⬆️' : '⬇️'}
              </span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              resetPosition()
            }}
            className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            title="Centrar"
          >
            <span className="text-xs">🎯</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 ${
          isMinimized ? 'h-0 opacity-0' : 'opacity-100'
        }`}
        style={{
          overflow: isMinimized ? 'hidden' : 'auto',
          maxHeight: isMinimized ? '0' : '80vh'
        }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!isMinimized && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-purple-300/50 cursor-nw-resize">
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  )
}
