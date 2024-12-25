import { defineConfig, presetUno, presetWebFonts, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
      presetUno(),
      presetWebFonts({
          provider: 'google',
          fonts: {
            sans: 'Inter:400,500,600,700',
            mono: 'Fira Code:400'
          }
      }),
      presetIcons(),
  ],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        surface_alt: 'var(--color-surface-alt)',
        text: 'var(--color-text)',
        text_alt: 'var(--color-text-alt)',
    },
  },
    shortcuts: {
        'panel': 'bg-surface rounded-lg overflow-hidden shadow-md',
        'panel-header': 'flex items-center justify-between py-2 px-4 border-b border-surface-alt',
        'panel-body': 'p-4',
        'btn': 'bg-primary text-background rounded px-3 py-1 cursor-pointer hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
    }
})
