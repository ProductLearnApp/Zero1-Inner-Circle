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
        bg: '#0A0A0F',
        card: '#161616',
        border: '#2a2a2a',
        accent: '#F2BA30',
        'accent-dim': '#c99a25',
        muted: '#888888',
      },
    },
  },
  plugins: [],
}
export default config
