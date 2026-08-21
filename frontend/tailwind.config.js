/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: '#f4f5f3',
        ink: {
          50: '#f5f6f7',
          100: '#e8eaec',
          200: '#d3d7db',
          300: '#b0b7be',
          400: '#828c96',
          500: '#616c77',
          600: '#4a545e',
          700: '#3a424a',
          800: '#262c32',
          900: '#181d22',
          950: '#0f1317',
        },
        safety: {
          50: '#fef7ec',
          100: '#fcebcd',
          200: '#f8d392',
          300: '#f2b44e',
          400: '#ec9e1f',
          500: '#d4830b',
          600: '#a96208',
          700: '#7e4808',
        },
        steel: {
          50: '#eef4f8',
          100: '#d9e6ef',
          200: '#b6cfde',
          300: '#84aec6',
          400: '#4f87a6',
          500: '#356c8a',
          600: '#2a5570',
          700: '#23455a',
        },
        signal: {
          green: '#2f7d4f',
          greenSoft: '#e7f2eb',
          red: '#c0392b',
          redSoft: '#fbeceb',
          amber: '#b26a05',
          amberSoft: '#fdf1dd',
          blue: '#2f5fa8',
          blueSoft: '#e9eff9',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 19, 23, 0.04), 0 1px 1px rgba(15, 19, 23, 0.03)',
        pop: '0 12px 32px -8px rgba(15, 19, 23, 0.18)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        '3xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        4.5: '1.125rem',
      },
    },
  },
  plugins: [],
};