import { useEffect } from 'react'
import { AppEnv } from '../../env'

const baseUrl =
	process.env.NODE_ENV === 'production'
		? 'https://www.paypal.com/connect'
		: 'https://www.sandbox.paypal.com/connect'

export default function LoginInitiate() {
	useEffect(() => {
		window.location.replace(
			baseUrl +
				'?' +
				new URLSearchParams({
					flowEntry: 'static',
					client_id: AppEnv.paypalClientId,
					scope:
						'openid profile email https://uri.paypal.com/services/paypalattributes',
					redirect_uri: AppEnv.webBaseUrl + '/paypal/login-callback'
				}).toString()
		)
	}, [])
	return <></>
}
