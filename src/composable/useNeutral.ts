import { ref, onMounted } from 'vue'
export type Neutral = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
const STORAGE_KEY = 'neutral'

// Shared state
const neutral = ref<Neutral>('slate')

export function useNeutral() {
  function applyNeutral(n: Neutral) {
    neutral.value = n
    const root = document.documentElement
    root.setAttribute('data-neutral', n)
    try { localStorage.setItem(STORAGE_KEY, n) } catch { }
  }

  onMounted(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) as Neutral | null) ?? 'slate'
      applyNeutral(saved)
    } catch { applyNeutral('slate') }

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
        applyNeutral((e.newValue as Neutral) || 'slate')
      }
    })
  })

  return { neutral, applyNeutral }
}
