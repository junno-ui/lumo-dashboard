import { ref, onMounted } from 'vue'
type Radius = '0' | '0.125' | '0.25' | '0.375' | '0.5'
const STORAGE_KEY = 'radius'

export function useRadius() {
  const radius = ref<Radius>('0.25')

  function applyRadius(r: Radius) {
    radius.value = r
    document.documentElement.setAttribute('data-radius', r)
    try { localStorage.setItem(STORAGE_KEY, r) } catch {}
  }

  onMounted(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) as Radius | null) ?? '0.25'
      applyRadius(saved)
    } catch { applyRadius('0.25') }

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
        applyRadius((e.newValue as Radius) || '0.25')
      }
    })
  })

  return { radius, applyRadius }
}
