/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0A2540',
        alert: '#B42318',
        teal: { DEFAULT: '#0E7C86', text: '#0A5E66', soft: '#DDF0F2', light: '#5FB3C4', line: '#2F6F8F' },
        ochre: { DEFAULT: '#E8A33D', soft: '#FBEBCF', text: '#7A4A06' },
        page: '#F4F7F8',
        card: '#FFFFFF',
        muted: '#4A5B6B',
        body: '#2B3F52',
        sub: '#3B4D5E',
        tab: '#546574',
        frame: '#E1E8EC',
        line: '#DCE4E8',
        divider: '#E3E9ED',
        dash: '#BFCBD3',
        ice: '#CFE3EA',
        mist: '#DCEBF0',
        indigo: { soft: '#E3E8F6', text: '#2A3A7A' },
        leaf: { soft: '#E4F1E3', text: '#1F5A2A' },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '16px', 'card-lg': '20px', chip: '999px' },
      maxWidth: { app: '480px', site: '1240px' },
    },
  },
  plugins: [],
};
