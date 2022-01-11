module.exports = {
	content: ['./src/**/*.tsx'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#6C5DD3',
				dark: '#242731',
				shark: '#1B1D21',
				bombay: '#B2B3BD',
				alabaster: '#F7F7F7',
				flowerblue: '#5274EE'
			}
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
			poppins: ['Poppins', 'Inter', 'sans-serif']
		},
		screens: {
			xs: '420px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
}
