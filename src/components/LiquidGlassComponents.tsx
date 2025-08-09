'use client'

import React from 'react'
import '@/styles/liquid-glass.css'

// Button Component
interface LiquidGlassButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'purple' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function LiquidGlassButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}: LiquidGlassButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantStyles = {
    primary: 'bg-white/20 hover:bg-white/30 border-white/30 text-white',
    secondary: 'bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/30 text-gray-100',
    purple: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-purple-100',
    danger: 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-100'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        liquid-glass-button transition-all duration-300 ease-out
        ${sizeClasses[size]}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

// Input Component
interface LiquidGlassInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'date'
  className?: string
  icon?: React.ReactNode
}

export function LiquidGlassInput({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  className = '',
  icon
}: LiquidGlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 z-10">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          liquid-glass-input w-full
          ${icon ? 'pl-12' : 'pl-4'}
          ${className}
        `}
      />
    </div>
  )
}

// Card Component
interface LiquidGlassCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  variant?: 'default' | 'purple' | 'dark'
  hoverable?: boolean
}

export function LiquidGlassCard({ 
  children, 
  title, 
  subtitle,
  className = '',
  variant = 'default',
  hoverable = true
}: LiquidGlassCardProps) {
  const variantClasses = {
    default: 'liquid-glass-card',
    purple: 'liquid-glass-card liquid-glass-purple',
    dark: 'liquid-glass-card liquid-glass-dark'
  }

  return (
    <div className={`
      ${variantClasses[variant]}
      ${hoverable ? 'hover:scale-105 hover:shadow-2xl' : ''}
      transition-all duration-300 ease-out
      ${className}
    `}>
      {(title || subtitle) && (
        <div className="mb-4 pb-4 border-b border-white/10">
          {title && (
            <h3 className="text-xl font-bold text-white/90 mb-1 drop-shadow">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-white/70 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Modal Component
interface LiquidGlassModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LiquidGlassModal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md'
}: LiquidGlassModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className={`
        relative liquid-glass-window w-full ${sizeClasses[size]}
        animate-in fade-in slide-in-from-bottom-4 duration-300
      `}>
        {/* Header */}
        <div className="liquid-glass-window-header px-6 py-4 flex items-center justify-between">
          {title && (
            <h2 className="text-xl font-semibold text-white/90 drop-shadow">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="liquid-glass-control w-8 h-8 hover:bg-red-500/20 transition-colors"
          >
            <span className="text-white/80 text-sm">✕</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

// Navigation Component
interface LiquidGlassNavProps {
  items: Array<{
    label: string
    href?: string
    onClick?: () => void
    active?: boolean
    icon?: React.ReactNode
  }>
  className?: string
}

export function LiquidGlassNav({ items, className = '' }: LiquidGlassNavProps) {
  return (
    <nav className={`liquid-glass-card p-2 ${className}`}>
      <div className="flex space-x-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
              ${item.active 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {item.icon && <span className="text-sm">{item.icon}</span>}
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Progress Bar Component
interface LiquidGlassProgressProps {
  value: number
  max?: number
  className?: string
  showValue?: boolean
  variant?: 'default' | 'purple' | 'success' | 'warning'
}

export function LiquidGlassProgress({ 
  value, 
  max = 100, 
  className = '',
  showValue = false,
  variant = 'default'
}: LiquidGlassProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variantColors = {
    default: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    success: 'from-green-400 to-green-600',
    warning: 'from-yellow-400 to-yellow-600'
  }

  return (
    <div className={`liquid-glass p-4 ${className}`}>
      {showValue && (
        <div className="flex justify-between text-white/90 text-sm mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur">
        <div 
          className={`h-full bg-gradient-to-r ${variantColors[variant]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  )
}

// Toggle Switch Component
interface LiquidGlassToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function LiquidGlassToggle({ 
  checked, 
  onChange, 
  label,
  className = ''
}: LiquidGlassToggleProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-6 rounded-full transition-all duration-300 ease-out
          ${checked 
            ? 'bg-purple-500/30 border-purple-400/50' 
            : 'bg-white/10 border-white/20'
          }
          border backdrop-blur-sm
        `}
      >
        <div
          className={`
            absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ease-out
            ${checked 
              ? 'left-6 bg-gradient-to-r from-purple-400 to-purple-600' 
              : 'left-0.5 bg-gradient-to-r from-white/40 to-white/60'
            }
            shadow-lg backdrop-blur-sm
          `}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
        </div>
      </button>
      {label && (
        <span className="text-white/90 text-sm font-medium">{label}</span>
      )}
    </div>
  )
}
