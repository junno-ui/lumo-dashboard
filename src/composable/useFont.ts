import { ref, onMounted } from 'vue'

export type Font = 'inter' | 'dm-sans' | 'outfit' | 'roboto'

const STORAGE_KEY = 'nuxt-ui-font'

export const useFont = () => {
    const font = ref<Font>('inter')

    const fontMap: Record<Font, string> = {
        'inter': 'font-sans',
        'dm-sans': 'font-dm-sans',
        'outfit': 'font-outfit',
        'roboto': 'font-roboto'
    }

    const applyFont = (value: Font) => {
        font.value = value

        // Remove existing font classes on root
        const classesToRemove = Object.values(fontMap)
        document.documentElement.classList.remove(...classesToRemove)

        // Add new font class
        document.documentElement.classList.add(fontMap[value])

        // Save to localStorage
        try { localStorage.setItem(STORAGE_KEY, value) } catch { }
    }

    onMounted(() => {
        try {
            const saved = (localStorage.getItem(STORAGE_KEY) as Font | null)
            if (saved && fontMap[saved]) {
                applyFont(saved)
            } else {
                applyFont('inter')
            }
        } catch { applyFont('inter') }
    })

    return {
        font,
        applyFont,
        fontOptions: [
            { label: 'Inter', value: 'inter' },
            { label: 'DM Sans', value: 'dm-sans' },
            { label: 'Outfit', value: 'outfit' },
            { label: 'Roboto', value: 'roboto' },
        ]
    }
}
