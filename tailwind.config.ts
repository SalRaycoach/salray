import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // #111111 = fundo principal do site (token `offwhite`, nome mantido
        // para não precisar tocar em nenhum componente). `charcoal` passa a
        // ser o tom claro (texto/realce sobre o fundo escuro). Laranja e aqua
        // seguem como cores secundárias/contraste, sem alteração de valor.
        // pale-aqua/pale-orange escurecem para não virar texto-claro-sobre-claro
        // nas seções que usam esses fundos (ProblemRecognition, AboutPreview, etc.).
        charcoal: '#EDEBE6',
        orange: '#FF8A00',
        aqua: '#009FAF',
        offwhite: '#111111',
        'pale-aqua': '#0E2226',
        'pale-orange': '#231708',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      maxWidth: {
        content: '1180px',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
