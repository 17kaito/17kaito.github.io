import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0b',
        fg: '#eaeaea',
        muted: '#a0a0a0',
        card: '#121212',
        accent: '#6ee7ff',
      }
    },
  },
  plugins: [],
} satisfies Config


