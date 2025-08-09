'use client'

import React from 'react'
import { useDraggable } from '@/hooks/useDraggable'
import '@/styles/liquid-glass.css'

interface LiquidGlassContainerProps {
  children: React.ReactNode
  title?: string
  className?: string
  initialPosition?: { x: number; y: number }
  minimizable?: boolean
  variant?: 'default' | 'purple' | 'dark'
  glowEffect?: boolean
  floating?: boolean
}

export function LiquidGlassContainer({ 
  children, 
  title, 
  className = '', 
  initialPosition,
  minimizable = true,
  variant = 'default',
  glowEffect = false,
  floating = false
}: LiquidGlassContainerProps) {
  const { position, isDragging, elementRef, dragHandlers, resetPosition } = useDraggable(initialPosition)
  const [isMinimized, setIsMinimized] = React.useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'purple':
        return 'liquid-glass-purple'
      case 'dark':
        return 'liquid-glass-dark'
      default:
        return 'liquid-glass'
    }
  }

  return (
    <div
      ref={elementRef}
      className={`
        fixed z-50 liquid-glass-window transition-all duration-300 ease-out
        ${isDragging ? 'scale-105 rotate-1 brightness-110 saturate-125 cursor-grabbing' : 'scale-100 rotate-0 brightness-100 saturate-100 cursor-grab'} 
        ${glowEffect ? 'liquid-glass-glow' : ''}
        ${floating ? 'liquid-glass-floating' : ''}
        ${getVariantClasses()}
        max-w-[90vw] max-h-[90vh] overflow-hidden
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.05) rotate(1deg)' : 'scale(1) rotate(0deg)'}`,
      }}
    >
      {/* Liquid Glass Header */}
      <div
        className={`liquid-glass-window-header px-6 py-4 flex items-center justify-between select-none transition-all duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          variant === 'purple' ? 'bg-purple-600/20' : variant === 'dark' ? 'bg-black/30' : 'bg-white/15'
        }`}
        onMouseDown={dragHandlers.onMouseDown}
      >
        {/* Left side - macOS style controls */}
        <div className="flex items-center space-x-3">
          {/* Traffic lights with liquid glass effect */}
          <div className="flex items-center space-x-2">
            <div className="liquid-glass-control bg-red-400/80 hover:bg-red-500/90">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-300/50 to-red-600/50"></div>
            </div>
            <div className="liquid-glass-control bg-yellow-400/80 hover:bg-yellow-500/90">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/50 to-yellow-600/50"></div>
            </div>
            <div className="liquid-glass-control bg-green-400/80 hover:bg-green-500/90">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-300/50 to-green-600/50"></div>
            </div>
          </div>
          
          {/* Title */}
          {title && (
            <span className="ml-4 font-semibold text-white/90 text-sm tracking-wide drop-shadow-lg">
              {title}
            </span>
          )}
        </div>
        
        {/* Right side - Window controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {minimizable && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(!isMinimized)
              }}
              className="liquid-glass-button px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 border-white/20"
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              <span className="drop-shadow">
                {isMinimized ? '⬆️' : '⬇️'}
              </span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              resetPosition()
            }}
            className="liquid-glass-button px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 border-white/20"
            title="Centrar ventana"
          >
            <span className="drop-shadow">🎯</span>
          </button>
        </div>
      </div>

      {/* Content area with liquid glass effect */}
      <div
        className={`transition-all duration-500 ease-out backdrop-blur-md ${
          isMinimized ? 'h-0 max-h-0 overflow-hidden opacity-0 scale-95' : 'opacity-100 scale-100 max-h-[75vh] overflow-auto'
        } ${
          variant === 'purple' ? 'bg-purple-600/5' : variant === 'dark' ? 'bg-black/10' : 'bg-white/5'
        }`}
      >
        <div className="relative">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-b-2xl"></div>
          {children}
        </div>
      </div>

      {/* Resize handle with liquid glass styling */}
      {!isMinimized && (
        <div className="absolute bottom-2 right-2 w-4 h-4 liquid-glass-control cursor-nw-resize group">
          <div className="absolute inset-1 rounded-sm bg-gradient-to-br from-white/30 to-white/10 group-hover:from-white/40 group-hover:to-white/20 transition-all duration-200"></div>
          <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-r border-b border-white/40"></div>
        </div>
      )}

      {/* Ambient lighting effect */}
      {glowEffect && (
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
    </div>
  )
}

export default LiquidGlassContainer
