import { ref, onMounted } from 'vue'
export type Neutral = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
const STORAGE_KEY = 'neutral'

// Shared state
const neutral = ref<Neutral>('slate')

// Neutral color palettes - maps to Tailwind's gray palette
const neutralPalettes: Record<Neutral, Record<number, string>> = {
  slate: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
    500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617'
  },
  gray: {
    50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
    500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712'
  },
  zinc: {
    50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa',
    500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b'
  },
  neutral: {
    50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3',
    500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a'
  },
  stone: {
    50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e',
    500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09'
  }
}

let isInitialized = false
let storageListenerAdded = false

export function useNeutral() {
  function applyNeutral(n: Neutral) {
    neutral.value = n
    
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    
    // Set data attribute
    root.setAttribute('data-neutral', n)
    
    // Apply color palette to CSS variables
    const palette = neutralPalettes[n]
    if (palette) {
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
      shades.forEach((shade) => {
        const color = palette[shade]
        if (color) {
          // Override Tailwind's gray palette
          root.style.setProperty(`--color-gray-${shade}`, color)
        }
      })
    }
    
    // Save to localStorage
    try { 
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, n) 
      }
    } catch (e) {
      console.warn('Failed to save neutral to localStorage:', e)
    }
  }

  function initialize() {
    if (isInitialized) return
    isInitialized = true

    try {
      if (typeof localStorage !== 'undefined') {
        const saved = (localStorage.getItem(STORAGE_KEY) as Neutral | null) ?? 'slate'
        applyNeutral(saved)
      } else {
        applyNeutral('slate')
      }
    } catch {
      applyNeutral('slate')
    }

    // Add storage listener only once
    if (!storageListenerAdded && typeof window !== 'undefined') {
      storageListenerAdded = true
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
          applyNeutral((e.newValue as Neutral) || 'slate')
        }
      })
    }
  }

  // Initialize immediately if DOM is ready
  if (typeof document !== 'undefined' && document.documentElement) {
    // Use nextTick to ensure DOM is ready
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        initialize()
      })
    } else {
      initialize()
    }
  }

  // Also initialize on mount as fallback
  onMounted(() => {
    initialize()
  })

  return { neutral, applyNeutral }
}
