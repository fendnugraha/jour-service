module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        darkMode: 'class',
        extend: {
            fontFamily: {
                sans: ['Nunito', 'sans-serif'],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
