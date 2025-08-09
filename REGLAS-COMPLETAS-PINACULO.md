# 📚 REGLAS COMPLETAS DEL SISTEMA PINÁCULO

## 🎯 Descripción General
El Pináculo es un sistema numerológico completo que calcula 24 posiciones (A-Z + T) basándose en el nombre completo y fecha de nacimiento de una persona.

## 🔢 Estructura de las 24 Posiciones

### 🔷 Nivel Base (Fundación)
- **A**: TAREA NO APRENDIDA (mes de nacimiento)
- **B**: MI ESENCIA (día de nacimiento)
- **C**: MI VIDA PASADA (año de nacimiento)
- **D**: MI MÁSCARA (A+B+C con regla especial)

### 🔷 Nivel Superior (Destino)
- **H**: TU DESTINO (A+C con regla especial)
- **X**: REACCIÓN (B+D)
- **Y**: MISIÓN (A+B+C+D+X)
- **Z**: REGALO DIVINO (últimos 2 dígitos del año)

### 🔷 Ciclos de Vida (Etapas)
- **E**: IMPLANTACIÓN DEL PROGRAMA (A+B)
- **F**: ENCUENTRO CON TU MAESTRO (B+C)
- **G**: RE-IDENTIFICACIÓN CON TU YO (E+F)

### 🔷 Aspectos Ocultos (Subconsciente)
- **I**: INCONSCIENTE POSITIVO (E+F+G)
- **J**: MI ESPEJO (D+H)

### 🔷 Aspectos Negativos (Sombras)
- **K**: ADOLESCENCIA (|A-B|)
- **L**: JUVENTUD (|B-C|)
- **M**: ADULTEZ (condicional K≠L)
- **N**: ADULTO MAYOR (|A-C|)
- **O**: INCONSCIENTE NEGATIVO (M+K+L)
- **P**: MI SOMBRA (D+O)
- **Q**: SER INFERIOR 1 (K+M)
- **R**: SER INFERIOR 2 (L+M)
- **S**: SER INFERIOR 3 (Q+R)


---

## 📏 REGLAS CRÍTICAS DEL SISTEMA

### 🔴 1. REGLA FUNDAMENTAL PARA K, L, N
**IMPORTANTE**: Si A, B o C = 11, 22 o 33, se convierten SOLO para las restas:
- 11 → 2
- 22 → 4
- 33 → 6

**Ejemplo**: 
- Fecha: 23/11/1994
- A = 11 (mes)
- Para calcular K: usar A=2 en lugar de 11
- K = |2 - 5| = 3

### 🔵 2. REGLA DE COMPROBACIÓN PARA D y H
Solo se aplica cuando D o H resultan en **2, 11, 4 o 22**.

#### Para D:
1. **D1** = mes + día + año (sin reducir)
2. **D2** = A + B + C (valores ya reducidos)
3. Reducir D1 y D2 a una cifra
4. Si D1_reducido = D2_reducido → D = D1_reducido
5. Si D1_reducido ≠ D2_reducido → D = D1_reducido

#### Para H:
1. **H1** = mes + año (sin reducir)
2. **H2** = A + C (valores ya reducidos)
3. Reducir H1 y H2 a una cifra
4. Si H1_reducido = H2_reducido → H = H1_reducido
5. Si H1_reducido ≠ H2_reducido → H = H1_reducido

### 🟢 3. NÚMEROS MAESTROS
Los números **11, 22 y 33** NO se reducen, excepto:
- Para calcular K, L, N (ver regla 1)
- En ningún otro caso se reducen

### 🟡 4. CÁLCULO DE M (ADULTEZ)
- Si K ≠ L → M = |K - L|
- Si K = L → M = K + L (reducido)

### 🟣 5. W (TRIPLICIDAD) DESDE K..S
1. Considerar únicamente los valores K, L, M, N, O, P, Q, R, S.
2. Si un mismo número aparece exactamente 3 veces, W = suma de esos 3 números y reducir a 3/6/9.
3. Si se forman múltiples triplicidades válidas, listar todos los valores de W (por ejemplo: 3, 9).

### 🟤 6. CÁLCULO DE T (AUSENTES)
1. Recopilar todos los números finales del Pináculo (A-Z)
2. Contar apariciones de cada número del 1 al 9
3. T = números que NO aparecen

---

## 💻 Ejemplo Completo: 23/11/1994

### Paso 1: Valores Base
- A = 11 (mes) ⭐
- B = 5 (día: 23→5)
- C = 5 (año: 1994→23→5)

### Paso 2: D con verificación
- D_base = 11+5+5 = 21 → 3
- No necesita verificación (no es 2,11,4,22)
- D = 3

### Paso 3: Negativos (con conversión)
- Para restas: A=11→2
- K = |2-5| = 3
- L = |5-5| = 0
- M = |3-0| = 3 (K≠L)
- N = |2-5| = 3

### Paso 4: Resultado Final
```
BASE: A=11⭐, B=5, C=5, D=3
SUPERIOR: H=7, X=8, Y=5, Z=94→4
CICLOS: E=7, F=1, G=8
OCULTO: I=7, J=1
NEGATIVOS: K=3, L=0, M=3, N=3, O=6, P=9, Q=6, R=3, S=9
ESPECIAL: W=0, T=2 (ausente)
```

---

## 🛠️ Implementación TypeScript

```typescript
class PinaculoCalculator {
  // Conversión para negativos
  static convertMasterForNegatives(num: number): number {
    if (num === 11) return 2;
    if (num === 22) return 4;
    if (num === 33) return 6;
    return num;
  }

  // Cálculo de ausentes
  static calculateAbsentNumbers(results: PinaculoResults): number[] {
    const allNumbers = Object.values(results)
      .filter(val => typeof val === 'number');
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
}
```

---

## 📝 Notas Adicionales

1. **Reducción de números**: Siempre preservar números maestros durante el proceso de reducción
2. **Valores absolutos**: K, L, N siempre son positivos (usar valor absoluto)
3. **Orden de cálculo**: Es importante seguir el orden establecido ya que algunos valores dependen de otros
4. **Casos especiales**: Para personas sin nombre, W = 0

---

**Última actualización**: Diciembre 2024
**Versión**: 2.0 (incluye reglas de conversión y T)