export const AppEnv = {
	webBaseUrl: process.env.NEXT_PUBLIC_WEB_BASE as string,
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE as string,
	paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string
}

export const IS_SERVER = typeof window === 'undefined'
