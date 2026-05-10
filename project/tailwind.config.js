/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['Raleway', 'ui-sans-serif', 'sans-serif'],
            },
            colors: {
                // Dark backgrounds
                navy: '#141A16',
                navyMid: '#1C241D',
                navyLight: '#2E3A30',
                // Accent (kept semantic name)
                gold: '#6B7D3A',
                goldDark: '#55642F',
                goldLight: '#A3B36A',
                // Light backgrounds
                ivory: '#F7F6EF',
                cream: '#EEECDD',
                sand: '#DCD7BE',
                // Text
                warmBlack: '#141A16',
                warmMuted: '#5E6558',
                warmBorder: '#DCD7BE',
            },
        },
    },
    plugins: [],
};
