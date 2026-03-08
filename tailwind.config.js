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
                navy: '#0B1728',
                navyMid: '#132236',
                navyLight: '#1A3048',
                // Gold accent
                gold: '#C9A052',
                goldDark: '#A87B30',
                goldLight: '#E4C47B',
                // Light backgrounds
                ivory: '#FAF7F2',
                cream: '#F0E9DF',
                sand: '#E2D5C8',
                // Text
                warmBlack: '#1C1613',
                warmMuted: '#8B7B6A',
                warmBorder: '#E2D5C8',
            },
        },
    },
    plugins: [],
};
