'use client'

import { useMemo } from 'react'

export type ComputedValues = Record<string, number | string | number[]>

// Maps the calculator result object to a flat key/value map A..Z, plus W, T, X, Y
export function useComputedValues(calculations: any): ComputedValues {
  return useMemo(() => {
    if (!calculations) return {}
    const out: ComputedValues = {}
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','X','Y','Z']
    for (const l of letters) {
      if (typeof calculations[l] !== 'undefined') out[l] = calculations[l]
    }
    // Special collections
    if (typeof calculations.W !== 'undefined') out.W = calculations.W
    if (typeof calculations.T !== 'undefined') out.T = calculations.T
    return out
  }, [calculations])
}


