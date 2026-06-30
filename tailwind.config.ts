// tailwind.config.ts - Configuración para Tailwind v3
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-obsidian': '#050505',
        'bg-titanium': '#0A0A0A',
        'brand-gold-pure': '#D4AF37',
        'brand-gold-liquid': '#AA7C11',
        'text-platinum': '#DCDCDC',
      },
      transitionTimingFunction: {
        'bezier-premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'premium': '500ms',
      },
    },
  },
  plugins: [],
}

export default config