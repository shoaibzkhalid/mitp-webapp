import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'
import { useMutation } from 'react-query'
import { userState } from '../../state/user'
import { useRouter } from 'next/router'
import { Api } from '../../api'
import { runInAction } from 'mobx'
import { AppEnv } from '../../env'

export function Login() {
	const router = useRouter()
	let isInvite = router.pathname === '/paypal/skip'

	const saveConnection = useMutation(
		'save-google-connection',
		async (r: GoogleLoginResponse) => {
			const tokens = await Api.public.googleAuth(r.tokenId)
			runInAction(() => {
				userState.tokens = tokens
			})
			await userState.load()

			if (isInvite) {
				const potId = JSON.parse(
					localStorage.getItem('post-login-action')
				).potId
				localStorage.removeItem('post-login-action')
				return router.replace(`/pot/${potId}`)
			}
		}
	)

	return (
		<div>
			<GoogleLogin
				clientId={AppEnv.googleClientId}
				buttonText="Sign In With Google"
				onSuccess={(r: any) => saveConnection.mutate(r)}
				onFailure={e => {
					console.log(e)
				}}
				cookiePolicy="single_host_origin"
				uxMode="popup"
				className="google-o-auth-button-login"
			/>
		</div>
	)
}
