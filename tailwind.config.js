/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], theme: {
        theme: {
            extend: {
                colors: {
                    beige: '#f5f5dc',
                    lightBeige: '#f9f6f2',
                    brown: '#5c4033',
                    darkBrown: '#4b3621',
                    darkerBrown: '#3d2b1f',
                },
            },
        },
        extend: {},
    }, plugins: [],


};
