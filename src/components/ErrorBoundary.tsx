'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="numerology-card bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">Algo salió mal</h3>
          <p className="text-red-600 text-sm mb-3">
            Ocurrió un error al mostrar este componente.
          </p>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Intentar de nuevo
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Simple functional error boundary hook for development
export function useErrorHandler() {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Component error:', error, errorInfo)
  }
}
