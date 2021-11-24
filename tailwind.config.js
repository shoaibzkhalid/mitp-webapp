module.exports = {
	purge: ['./src/**/*.tsx'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#6C5DD3',
				dark: '#242731',
				shark: '#1B1D21',
				bombay: '#B2B3BD',
				alabaster: '#F7F7F7',
			}
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
			poppins: ['Poppins', 'Inter', 'sans-serif']
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
}
