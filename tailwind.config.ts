import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        surface: {
          DEFAULT: '#111827',
          hover: '#1F2937',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          cyan: '#06B6D4',
          indigo: '#6366F1',
          purple: '#A855F7',
          blue: '#3B82F6',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #06B6D4 0%, #6366F1 50%, #A855F7 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
