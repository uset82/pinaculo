// Interfaces for Pináculo Numerology System
export interface PinaculoNode {
  id: string;
  letter: string;
  name: string;
  formula: string;
  type: 'positive' | 'negative' | 'base' | 'special';
  level: number;
  position: { x: number; y: number };
  color: string;
  category: 'base' | 'ciclos' | 'superior' | 'negativos' | 'nombre' | 'oculto' | 'adicional' | 'especial';
  description: string;
}

export interface PinaculoConnection {
  from: string;
  to: string;
  type: 'calculation' | 'negative' | 'base' | 'direct';
}

export interface PinnacleStructure {
  title: string;
  version: string;
  source: string;
  description: string;
  nodes: Record<string, PinaculoNode>;
  connections: PinaculoConnection[];
  formulas: Record<string, string>;
  caldeo_system: Record<string, number>; // reservado, no usado
  calculation_order: string[];
  display: {
    width: number;
    height: number;
    node_radius: number;
    connection_style: Record<string, { color: string; width: number }>;
  };
}

export interface CalculationResult {
  value: number;
  formula: string;
  correct?: boolean;
  master_number?: boolean;
  note?: string;
  depends_on?: string;
}

export interface BirthDateInput {
  birth_date: string;
  day: number;
  month: number;
  year: number;
}

export interface PinaculoResults {
  // Base numbers
  A: number; // TAREA NO APRENDIDA (mes)
  B: number; // MI ESENCIA (día)
  C: number; // MI VIDA PASADA (año)
  D: number; // MI MÁSCARA (A+B+C con regla)
  
  // Superior numbers
  H: number; // TU DESTINO (A+C con regla)
  X: number; // REACCIÓN (B+D)
  Y: number; // MISIÓN (A+B+C+D+X)
  
  // Cycle numbers
  E: number; // IMPLANTACIÓN DEL PROGRAMA (A+B)
  F: number; // ENCUENTRO CON TU MAESTRO (B+C)
  G: number; // RE-IDENTIFICACIÓN CON TU YO (E+F)
  
  // Hidden numbers
  I: number; // INCONSCIENTE (E+F+G)
  J: number; // MI ESPEJO (D+H)
  Z: number; // REGALO DIVINO (últimos 2 dígitos año)
  
  // Negative numbers
  K: number; // ADOLESCENCIA (|A-B|)
  L: number; // JUVENTUD (|B-C|)
  M: number; // ADULTEZ (conditional K≠L)
  N: number; // ADULTO MAYOR (|A-C|)
  O: number; // INCONSCIENTE NEGATIVO (M+K+L)
  P: number; // MI SOMBRA (D+O)
  Q: number; // SER INFERIOR 1 (K+M)
  R: number; // SER INFERIOR 2 (L+M)
  S: number; // SER INFERIOR 3 (Q+R)
  
  // Special numbers
  W: number | number[]; // TRIPLICIDAD (puede tener múltiples valores 3,6,9)
  T: number | number[]; // AUSENTES (números que no aparecen en el Pináculo)
}

export interface PinaculoCalculation {
  input: BirthDateInput;
  results: PinaculoResults;
  master_numbers: string[];
  timestamp: string;
  interpretations_shown: Record<string, {
    number: number;
    description: string;
  }>;
}

export interface PinaculoExample {
  example_calculation: PinaculoCalculation;
  formula_corrections: {
    note: string;
    recommendations: string[];
  };
}

// Utility functions for calculations
export class PinaculoCalculator {
  
  // Nota: Se eliminan mapeos de letras; el sistema se basa en los PDFs proporcionados (W por triplicidad K..S)

  /**
   * Reduce a number to single digit, preserving master numbers (11, 22, 33)
   */
  static reduceNumber(num: number): number {
    // Preserve master numbers
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
    
    while (num > 9) {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      num = sum;
      
      // Check for master numbers after reduction
      if (num === 11 || num === 22 || num === 33) {
        return num;
      }
    }
    
    return num;
  }

  /**
   * Apply verification rule for D and H positions
   */
  static applyVerificationRule(baseValue: number, calculation1: number, calculation2: number): number {
    const needsVerification = [2, 11, 4, 22].includes(baseValue);
    
    if (needsVerification) {
      const val1 = this.reduceNumber(calculation1);
      const val2 = this.reduceNumber(calculation2);
      
      if (val1 === val2) {
        return val1;
      } else {
        return val1; // Take the first value (more important)
      }
    } else {
      return baseValue;
    }
  }

  // Eliminado: cálculo de nombre con mapeos de letras

  /**
   * Convert master numbers to their reduced form for negative calculations
   * 11 → 2, 22 → 4, 33 → 6
   */
  static convertMasterForNegatives(num: number): number {
    if (num === 11) return 2;
    if (num === 22) return 4;
    if (num === 33) return 6;
    return num;
  }

  /**
   * Calculate T (absent numbers in the Pináculo)
   */
  static calculateAbsentNumbers(results: PinaculoResults): number[] {
    // Considerar SOLO letras permitidas A..S (no incluir W ni Z)
    const allNumbers = [
      results.A, results.B, results.C, results.D, results.E, results.F,
      results.G, results.H, results.I, results.J, results.K, results.L,
      results.M, results.N, results.O, results.P, results.Q, results.R,
      results.S
    ].filter(val => typeof val === 'number') as number[];
    const occurrences = new Array(10).fill(0);
    
    allNumbers.forEach(num => {
      if (num >= 0 && num <= 9) {
        occurrences[num]++;
      }
    });
    
    const absent = [];
    for (let i = 1; i <= 9; i++) {
      if (occurrences[i] === 0) {
        absent.push(i);
      }
    }
    
    return absent;
  }

  /**
   * Calculate W (Triplicidad) - Only from K,L,M,N,O,P,Q,R,S
   * If any number appears exactly 3 times, W = sum of those 3 occurrences
   */
  static calculateTriplicidad(results: PinaculoResults): number | number[] {
    // Only consider K,L,M,N,O,P,Q,R,S (negative numbers)
    const negativeNumbers = [
      results.K, results.L, results.M, results.N, 
      results.O, results.P, results.Q, results.R, results.S
    ];
    
    const occurrences = new Array(10).fill(0);
    negativeNumbers.forEach(num => {
      if (Number.isInteger(num) && num >= 0 && num <= 9) {
        occurrences[num]++;
      }
    });

    const wValues = new Set<number>();
    // Base: dígito 1..9 que aparece exactamente 3 veces
    for (let i = 1; i <= 9; i++) {
      if (occurrences[i] === 3) {
        const w = this.reduceNumber(i + i + i); // => 3,6,9
        if (w === 3 || w === 6 || w === 9) wValues.add(w);
      }
    }
    // Derivado: si existe W base (3/6/9) y hay dos ocurrencias de ese mismo valor, añadir W2
    for (const w of Array.from(wValues)) {
      if (occurrences[w] === 2) {
        const derived = this.reduceNumber(w + w + w); // 3->9, 6->9, 9->9
        if (derived === 3 || derived === 6 || derived === 9) wValues.add(derived);
      }
    }
    if (wValues.size === 0) return 0;
    if (wValues.size === 1) return Array.from(wValues)[0];
    return Array.from(wValues).sort((a, b) => a - b);
  }

  /**
   * Calculate complete Pináculo for a person
   */
  static calculateComplete(name: string, day: number, month: number, year: number): PinaculoResults {
    const results = {} as PinaculoResults;

    // Base calculations
    results.A = this.reduceNumber(month);
    results.B = this.reduceNumber(day);
    const yearSum = year.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    results.C = this.reduceNumber(yearSum);

    // D: En la práctica D = D1 (día + mes + año sin reducir)
    const D1 = month + day + year; // sin reducir
    results.D = this.reduceNumber(D1);

    // H: En la práctica H = H1 (mes + año sin reducir)
    const H1 = month + year; // sin reducir
    results.H = this.reduceNumber(H1);

    // Superior numbers
    results.X = this.reduceNumber(results.B + results.D);
    results.Y = this.reduceNumber(results.A + results.B + results.C + results.D + results.X);

    // Cycle numbers
    results.E = this.reduceNumber(results.A + results.B);
    results.F = this.reduceNumber(results.B + results.C);
    results.G = this.reduceNumber(results.E + results.F);

    // Hidden numbers
    results.I = this.reduceNumber(results.E + results.F + results.G);
    results.J = this.reduceNumber(results.D + results.H);

    // Negative numbers - CRITICAL: Convert master numbers for subtraction
    const A_for_negative = this.convertMasterForNegatives(results.A);
    const B_for_negative = this.convertMasterForNegatives(results.B);
    const C_for_negative = this.convertMasterForNegatives(results.C);
    
    results.K = Math.abs(A_for_negative - B_for_negative);
    results.L = Math.abs(B_for_negative - C_for_negative);
    
    if (results.K !== results.L) {
      results.M = Math.abs(results.K - results.L);
    } else {
      results.M = this.reduceNumber(results.K + results.L);
    }
    
    results.N = Math.abs(A_for_negative - C_for_negative);
    results.O = this.reduceNumber(results.M + results.K + results.L);
    results.P = this.reduceNumber(results.D + results.O);
    results.Q = this.reduceNumber(results.K + results.M);
    results.R = this.reduceNumber(results.L + results.M);
    results.S = this.reduceNumber(results.Q + results.R);

    // Special numbers
    results.W = this.calculateTriplicidad(results); // Regla de triplicidad con múltiples valores
    // Z calculation: use last 2 digits of year (CORRECTED)
    results.Z = this.calculateZ(year);

    // Calculate T (absent numbers)
    const absent = this.calculateAbsentNumbers(results);
    // If there are no absent numbers (all 1..9 present), T must be 0
    if (absent.length === 0) {
      results.T = 0;
    } else {
      results.T = absent.length === 1 ? absent[0] : absent;
    }

    return results;
  }

  /**
   * Calculate negative numbers using absolute value
   */
  static calculateNegative(a: number, b: number): number {
    return Math.abs(a - b);
  }

  /**
   * Special case for M calculation
   */
  static calculateM(K: number, L: number): number {
    if (K !== L) {
      return this.reduceNumber(Math.abs(K - L));
    } else {
      return this.reduceNumber(K + L);
    }
  }

  /**
   * Calculate year reduction
   */
  static reduceYear(year: number): number {
    const digits = year.toString().split('').map(d => parseInt(d));
    const sum = digits.reduce((acc, digit) => acc + digit, 0);
    return this.reduceNumber(sum);
  }

  /**
   * Calculate Z (Regalo Divino) - Last 2 digits of year
   */
  static calculateZ(year: number): number {
    const lastTwoDigits = year % 100;
    return this.reduceNumber(lastTwoDigits);
  }

  // Eliminado: W desde nombre; W se calcula sólo por triplicidad (K..S)

  /**
   * Calculate base numbers from birth date
   */
  static calculateBaseNumbers(day: number, month: number, year: number) {
    return {
      A: this.reduceNumber(month), // MES
      B: this.reduceNumber(day),   // DÍA  
      C: this.reduceYear(year)     // AÑO
    };
  }

  /**
   * Calculate all Pináculo positions based on accurate formulas
   */
  static calculateAllPositions(day: number, month: number, year: number, name?: string) {
    const base = this.calculateBaseNumbers(day, month, year);
    
    // Base calculations
    const A = base.A;
    const B = base.B; 
    const C = base.C;
    const D = this.reduceNumber(A + B + C);
    
    // Positive numbers
    const E = this.reduceNumber(A + B);
    const F = this.reduceNumber(B + C);
    const G = this.reduceNumber(E + F);
    const H = this.reduceNumber(A + C);
    const I = this.reduceNumber(E + F + G);
    const J = this.reduceNumber(D + H);
    const X = this.reduceNumber(B + D);
    const Y = this.reduceNumber(A + B + C + D + X);
    
    // Negative numbers
    const K = this.calculateNegative(A, B);
    const L = this.calculateNegative(B, C);
    const M = this.calculateM(K, L);
    const N = this.calculateNegative(A, C);
    const O = this.reduceNumber(M + K + L);
    const P = this.reduceNumber(D + O);
    const Q = this.reduceNumber(K + M);
    const R = this.reduceNumber(L + M);
    const S = this.reduceNumber(Q + R);
    
    // Special numbers (legacy API): mantener firma pero W se deriva sólo de triplicidad
    const W = 0;
    const Z = this.calculateZ(year);
    
    return {
      // Base numbers
      A, B, C, D,
      // Positive derived
      E, F, G, H, I, J, X, Y,
      // Negative numbers  
      K, L, M, N, O, P, Q, R, S,
      // Special
      W, Z
    };
  }
}

// Import JSON data directly
import pinaculoStructureData from '@/data/pinaculo-structure.json'
import pinaculoExampleData from '@/data/pinaculo-example.json'

// Export the data loader functions
export function loadPinaculoStructure(): PinnacleStructure {
  try {
    // Use imported data directly instead of fetch
    const data = pinaculoStructureData;
    // The JSON file has a wrapper, so we need to extract the pinaculoStructure
    return (data as any).pinaculoStructure || (data as any);
  } catch (error) {
    console.error('Error loading Pináculo structure:', error);
    throw new Error('No se pudo cargar la estructura del Pináculo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
  }
}

export function loadPinaculoExample(): PinaculoExample {
  try {
    // Use imported data directly instead of fetch
    const data = pinaculoExampleData;
    return (data as any).pinaculoExample || (data as any);
  } catch (error) {
    console.error('Error loading Pináculo example:', error);
    throw new Error('No se pudo cargar el ejemplo del Pináculo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
  }
}
