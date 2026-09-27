import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px', '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Deep teal / medical blue — primary brand colour
        brand: {
          50: '#eef9fa',
          100: '#d5f0f3',
          200: '#b0e1e7',
          300: '#7ccbd6',
          400: '#46adbd',
          500: '#2a91a3',
          600: '#1f7486',
          700: '#1d5e6d',
          800: '#1e4d5a',
          900: '#1d414c',
          950: '#0d2a33',
        },
        // Royal blue — secondary brand colour
        royal: {
          50: '#eff4ff',
          100: '#dbe6fe',
          200: '#bfd3fe',
          300: '#93b4fd',
          400: '#6090fa',
          500: '#3b6ef6',
          600: '#2554eb',
          700: '#1d41d8',
          800: '#1e36af',
          900: '#1e328a',
          950: '#172054',
        },
        // Green — healthcare accent
        leaf: {
          50: '#f0fbf4',
          100: '#dbf5e3',
          200: '#b9e9ca',
          300: '#8ad7a8',
          400: '#55bd7f',
          500: '#30a260',
          600: '#21834c',
          700: '#1d683e',
          800: '#1a5334',
          900: '#16452c',
          950: '#0a2617',
        },
        // Warm neutral surfaces (kept cool so the site reads as "medical")
        ink: {
          50: '#f6f8f9',
          100: '#eceff1',
          200: '#d5dbe0',
          300: '#b0bcc4',
          400: '#8598a3',
          500: '#667c89',
          600: '#526472',
          700: '#44535e',
          800: '#3b474f',
          900: '#333d44',
          950: '#1c242a',
        },
        alert: {
          DEFAULT: '#c0392b',
          soft: '#fdf1ef',
        },
      },
      /** Extra steps so colour opacity modifiers like `bg-white/8` are valid. */
      opacity: {
        '0': '0',
        '4': '0.04',
        '6': '0.06',
        '8': '0.08',
        '10': '0.1',
        '12': '0.12',
        '14': '0.14',
        '15': '0.15',
        '16': '0.16',
        '18': '0.18',
        '20': '0.2',
        '22': '0.22',
        '25': '0.25',
        '28': '0.28',
        '30': '0.3',
        '35': '0.35',
        '40': '0.4',
        '45': '0.45',
        '50': '0.5',
        '55': '0.55',
        '60': '0.6',
        '65': '0.65',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
        '88': '0.88',
        '90': '0.9',
        '92': '0.92',
        '95': '0.95',
        '100': '1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-noto-devanagari)', 'var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13, 42, 51, 0.04), 0 8px 24px -12px rgba(13, 42, 51, 0.16)',
        'card-hover': '0 2px 4px rgba(13, 42, 51, 0.05), 0 18px 40px -16px rgba(13, 42, 51, 0.28)',
        float: '0 12px 32px -8px rgba(13, 42, 51, 0.35)',
        ring: '0 0 0 4px rgba(42, 145, 163, 0.14)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(29, 94, 109, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 94, 109, 0.06) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '80%, 100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1200' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'ping-slow': 'ping-slow 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'draw-line': 'draw-line 2.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
