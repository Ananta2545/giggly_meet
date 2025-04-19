/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			violet: {
				950: '#1e0b35',
				900: '#2a1055',
				800: '#3f1b6e',
				700: '#5b2b90',
			},
			'text-glow': '#e2e8f0',
  		},
		animation: {
			'bounce-slow': 'bounce 3s infinite',
			'spin-slow': 'spin 4s linear infinite',
			'text-glow': 'pulse 2s ease-in-out infinite'
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};