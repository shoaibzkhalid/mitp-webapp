export const AppEnv = {
	webBaseUrl: process.env.NEXT_PUBLIC_WEB_BASE as string,
	apiBaseUrl: (process.env.PRIVATE_API_BASE ||
		process.env.NEXT_PUBLIC_API_BASE) as string,
	paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
	googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
	stripeApiKey: process.env.NEXT_PUBLIC_STRIPE_API_KEY as string,
	landingPageUrl: process.env.NEXT_PUBLIC_LANDINGPAGE as string
}

export const IS_SERVER = typeof window === 'undefined'
