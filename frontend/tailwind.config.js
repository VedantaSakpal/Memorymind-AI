import colors from 'tailwindcss/colors';

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
        brandNavy: '#111111',
        brandTeal: {
          DEFAULT: '#000000',
          dark: '#111111',
          light: '#333333',
        },
        brandMint: '#666666',
        brandIce: '#F5F5F5',
        violet: colors.neutral,
        sky: colors.neutral,
        fuchsia: colors.neutral,
        pink: colors.neutral,
        indigo: colors.neutral,
        cyan: colors.neutral,
        teal: colors.neutral,
        emerald: colors.neutral,
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
