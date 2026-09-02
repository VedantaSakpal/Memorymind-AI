export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        brandNavy: '#0C162C',
        brandTeal: {
          DEFAULT: '#0D5B5A',
          dark: '#0A4A49',
          light: '#14B8A6',
        },
        brandMint: '#2DD4BF',
        brandIce: '#E6EFF1',
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
