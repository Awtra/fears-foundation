/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Canvas - warm paper, light theme */
        canvas: '#FAF9F6',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFFFFF',
          inset: '#F1EFEA',
        },
        /* Ink - deep slate for text and structure on light */
        ink: '#0F172A',
        /* Accent - deep royal purple. On light, `glow` is the violet used for
           text accents (AA-verified), `plum`/`light` for fills and borders. */
        plum: {
          DEFAULT: '#581C87',
          light: '#6B21A8',
          glow: '#7C3AED',
        },
        /* Type - #475569 body and #5F6B7D muted both clear WCAG AA on paper */
        silver: '#475569',
        muted: '#5F6B7D',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
        caps: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sharp: '2px',
        card: '4px',
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      maxWidth: {
        shell: '1280px',
      },
      backgroundImage: {
        'plum-ambient':
          'radial-gradient(60% 60% at 50% 0%, rgba(124,58,237,0.14) 0%, rgba(250,249,246,0) 100%)',
        'plum-edge':
          'linear-gradient(135deg, rgba(107,33,168,0.28) 0%, rgba(88,28,135,0.04) 45%, rgba(250,249,246,0) 100%)',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(15,23,42,0.02) inset, 0 1px 2px 0 rgba(15,23,42,0.04), 0 24px 60px -48px rgba(15,23,42,0.28)',
        portal: '0 18px 40px -24px rgba(88,28,135,0.55)',
      },
      keyframes: {
        'pulse-node': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
