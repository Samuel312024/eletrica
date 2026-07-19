import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fundo tipo prancheta técnica / blueprint noturno
        base: {
          950: '#0D1015',
          900: '#12161C',
          800: '#1A2029',
          700: '#232A35',
          600: '#2A3441',
        },
        // Cobre — fiação, ação primária
        copper: {
          400: '#E5A868',
          500: '#D98A42',
          600: '#C87F3D',
          700: '#A5652F',
        },
        // Verde de circuito fechado / status ok
        circuit: {
          400: '#6BC98A',
          500: '#4CAF6D',
          600: '#3B8C56',
        },
        // Amarelo de sinalização elétrica / alerta
        signal: {
          400: '#F2C744',
          500: '#E0B52F',
        },
        danger: {
          400: '#E5675C',
          500: '#D14A3D',
        },
        ink: {
          100: '#E8EBEF',
          300: '#B7C0CC',
          500: '#8B96A5',
          700: '#5A6472',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'blueprint-grid':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '24px 24px',
      },
      borderRadius: {
        sm: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
