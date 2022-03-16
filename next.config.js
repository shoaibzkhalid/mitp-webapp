const withPreact = require('next-plugin-preact')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/** @type {import('next').NextConfig} */
// module.exports = withPreact({
// 	reactStrictMode: true,
// 	redirects() {
// 		return [
// 			{
// 				source: '/',
// 				destination: '/home',
// 				permanent: false
// 			}
// 		]
// 	}
// })

module.exports = withPWA({
	pwa: {
		dest: 'public',
		runtimeCaching
	}
})
