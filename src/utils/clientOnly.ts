import { useState, useEffect } from 'react'

/**
 * Hook to safely handle client-side only rendering
 * Prevents hydration mismatches by ensuring content only renders after hydration
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to safely format dates on client-side only
 */
export function useClientDate(date: Date) {
  const isClient = useClientOnly()
  
  return {
    isClient,
    formatted: isClient ? date.toLocaleTimeString() : 'Loading...',
    fullFormatted: isClient ? date.toLocaleString() : 'Loading...'
  }
}
