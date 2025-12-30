import { ref, onMounted } from 'vue'
type Radius = '0' | '0.125' | '0.25' | '0.375' | '0.5'
const STORAGE_KEY = 'radius'

// Shared state
const radius = ref<Radius>('0.25')

export function useRadius() {
  function applyRadius(r: Radius) {
    radius.value = r
    const root = document.documentElement
    root.setAttribute('data-radius', r)
    
    // Convert radius value to pixels
    const radiusMap: Record<Radius, string> = {
      '0': '0px',
      '0.125': '2px',
      '0.25': '4px',
      '0.375': '6px',
      '0.5': '8px'
    }
    
    // Set Nuxt UI's radius CSS variable
    root.style.setProperty('--ui-radius', radiusMap[r] || '4px')
    
    try { localStorage.setItem(STORAGE_KEY, r) } catch { }
  }

  function initialize() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = (localStorage.getItem(STORAGE_KEY) as Radius | null) ?? '0.25'
        applyRadius(saved)
      } else {
        applyRadius('0.25')
      }
    } catch { 
      applyRadius('0.25') 
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
          applyRadius((e.newValue as Radius) || '0.25')
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

  return { radius, applyRadius }
}
