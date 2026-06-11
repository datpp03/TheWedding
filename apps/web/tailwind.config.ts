import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1b1b1f',
        pearl: '#f7f5f2',
        champagne: '#c9a86a',
        sage: '#7f9183',
        rosewood: '#9f4f5f',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [forms],
};

export default config;
