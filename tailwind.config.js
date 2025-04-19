export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-primary)',
            a: {
              color: 'var(--text-accent)',
              '&:hover': {
                color: 'var(--text-accent)',
              },
            },
            h1: {
              color: 'var(--text-primary)',
            },
            h2: {
              color: 'var(--text-primary)',
            },
            h3: {
              color: 'var(--text-primary)',
            },
            h4: {
              color: 'var(--text-primary)',
            },
            strong: {
              color: 'var(--text-primary)',
            },
            code: {
              color: 'var(--text-accent)',
            },
            blockquote: {
              color: 'var(--text-secondary)',
              borderLeftColor: 'var(--border)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar': {
          /* Firefox */
          'scrollbar-color': 'var(--text-accent) var(--bg-primary)',
          'scrollbar-width': 'thin',
        },
        '.scrollbar::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '.scrollbar::-webkit-scrollbar-track': {
          background: 'var(--bg-primary)',
        },
        '.scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--text-accent)',
          borderRadius: '9999px',
          border: '2px solid var(--bg-primary)',
        },
      })
    },
  ]
}