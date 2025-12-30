import { ref, onMounted } from 'vue'
import { colors } from '../utils/colors'

export type Brand =
  | 'default' | 'black' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo'
  | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

const STORAGE_KEY = 'brand'

// Shared state
const brand = ref<Brand>('default')

export function useBrand() {
  function applyBrand(b: Brand) {
    brand.value = b
    const root = document.documentElement

    // Always set data-brand for other potential uses
    if (b === 'default') {
      root.removeAttribute('data-brand')
    } else {
      root.setAttribute('data-brand', b)
    }

    // Determine which palette to use, ensuring a valid fallback
      // For 'default', use indigo as fallback
    let palette = colors[b]
    if (!palette && b === 'default') {
      palette = colors['indigo'] // Use indigo as default
    }
    if (!palette) return

    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    // Set the CSS variables for the primary palette
    shades.forEach(shade => {
      const colorValue = palette[shade]
      if (colorValue) {
        // Set Tailwind's primary color variables
        root.style.setProperty(`--color-primary-${shade}`, colorValue)
        // Also set Nuxt UI's primary color variables
        root.style.setProperty(`--ui-color-primary-${shade}`, colorValue)
      }
    })
    // Set default primary color (used by Nuxt UI components)
    if (palette[500]) {
      root.style.setProperty('--ui-primary', palette[500])
      root.style.setProperty('--color-primary-DEFAULT', palette[500])
      root.style.setProperty('--ui-color-primary-DEFAULT', palette[500])
    }

    try { localStorage.setItem(STORAGE_KEY, b) } catch { }
  }

  function initialize() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = (localStorage.getItem(STORAGE_KEY) as Brand | null) ?? 'default'
        applyBrand(saved)
      } else {
        applyBrand('default')
      }
    } catch { 
      applyBrand('default') 
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
          applyBrand((e.newValue as Brand) || 'default')
        }
      })
    }
  }

  // Initialize immediately if DOM is ready
  if (typeof document !== 'undefined' && document.documentElement) {
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

  return { brand, applyBrand }
}
