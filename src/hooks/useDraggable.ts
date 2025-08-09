'use client'

import React, { useState, useRef, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

export function useDraggable(initialPosition: Position = { x: 0, y: 0 }) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const elementStartRef = useRef<Position>(initialPosition)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    elementStartRef.current = position
    
    console.log('Mouse down - starting drag', { x: e.clientX, y: e.clientY })
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x
        const deltaY = e.clientY - dragStartRef.current.y
        
        setPosition({
          x: elementStartRef.current.x + deltaX,
          y: elementStartRef.current.y + deltaY
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      console.log('Mouse up - ending drag')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [position, isDragging])

  const resetPosition = useCallback(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  return {
    position,
    isDragging,
    elementRef,
    dragHandlers: {
      onMouseDown: handleMouseDown
    },
    resetPosition
  }
}
