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
    const palette = colors[b] ?? colors['default']
    if (!palette) return // Should not happen given the fallback

    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    // Set the CSS variables for the primary palette
    shades.forEach(shade => {
      const colorValue = palette[shade]
      if (colorValue) {
        root.style.setProperty(`--color-primary-${shade}`, colorValue)
      }
    })
    // Also map DEFAULT to 500
    if (palette[500]) {
      root.style.setProperty('--color-primary-DEFAULT', palette[500])
    }

    try { localStorage.setItem(STORAGE_KEY, b) } catch { }
  }

  onMounted(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) as Brand | null) ?? 'default'
      applyBrand(saved)
    } catch { applyBrand('default') }

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
        applyBrand((e.newValue as Brand) || 'default')
      }
    })
  })

  return { brand, applyBrand }
}
