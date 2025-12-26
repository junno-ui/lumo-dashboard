import { ref, onMounted } from 'vue'

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
    if (b === 'default') root.removeAttribute('data-brand')
    else root.setAttribute('data-brand', b)
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
