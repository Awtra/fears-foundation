/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Canvas - deep slate blues */
        canvas: '#0B0F19',
        surface: {
          DEFAULT: '#0F172A',
          raised: '#141D33',
          inset: '#080B13',
        },
        /* Accent - deep royal purple, used only as ambient glow / border / active state */
        plum: {
          DEFAULT: '#581C87',
          light: '#6B21A8',
          glow: '#A855F7',
        },
        /* Type - #7C8BA1 clears WCAG AA (≥4.5:1) on both canvas and raised surface */
        silver: '#94A3B8',
        muted: '#7C8BA1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
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
          'radial-gradient(60% 60% at 50% 0%, rgba(88,28,135,0.35) 0%, rgba(11,15,25,0) 100%)',
        'plum-edge':
          'linear-gradient(135deg, rgba(107,33,168,0.55) 0%, rgba(88,28,135,0.05) 45%, rgba(11,15,25,0) 100%)',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 24px 60px -40px rgba(0,0,0,0.9)',
        portal: '0 18px 40px -22px rgba(88,28,135,0.9)',
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
