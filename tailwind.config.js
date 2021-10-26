module.exports = {
	purge: ['./src/**/*.tsx'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#6C5DD3',
				dark: '#242731'
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
