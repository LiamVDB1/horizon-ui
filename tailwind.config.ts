import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['geist'],
      mono: ['geist-mono'],
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      backgroundImage: {
        'JupGradient1': 'linear-gradient(to right bottom, #00B6E7, #A4D756)',
        'JupGradient2': 'linear-gradient(to right bottom, #22CCEE, #2ED3B7)',
        'JupGradient3': 'linear-gradient(to right bottom, #2ED3B7, #C8F284)',
        'Sidebar' :  'var(--sidebar-background)',
      },
      blur : {
        ssm : '2px',
      },
      brightness : {
        55 : '0.55',
        60 : '0.6',
        65 : '0.65',
        70 : '0.7',
        80 : '0.8',
        'background' : 'var(--sidebar-background-brightness)',
      },
      contrast : {
        'background' : 'var(--sidebar-background-contrast)',
      },
      typography: () => ({
        xs: {
          css: {
            fontSize: '0.75rem', // Base font size
            lineHeight: '1.25rem', // Base line height
            strong : {
              fontWeight: '600',
            },
            h1: {
              fontSize: '1.25rem',
              fontWeight: '600', // Semi-bold for h1
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            h2: {
              fontSize: '1rem',
              fontWeight: '500', // Medium for h2
              marginTop: '0.75rem',
              marginBottom: '0.5rem',
            },
            h3: {
              fontSize: '0.875rem',
              fontWeight: '400', // Normal for h3
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
            },
            p: {
              fontWeight: '300', // Light font for paragraphs
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;