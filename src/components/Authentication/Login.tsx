import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'
import { useMutation } from 'react-query'
import { userState } from '../../state/user'
import { Api } from '../../api'
import { runInAction } from 'mobx'
import { AppEnv } from '../../env'

export function Login() {
	const saveConnection = useMutation(
		'save-google-connection',
		async (r: GoogleLoginResponse) => {
			const tokens = await Api.public.googleAuth(r.tokenId)
			runInAction(() => {
				userState.tokens = tokens
			})
			await userState.load()
		}
	)

	return (
		<div>
			<GoogleLogin
				clientId={AppEnv.googleClientId}
				buttonText="Sign In With Google"
				onSuccess={(r: any) => saveConnection.mutate(r)}
				cookiePolicy="single_host_origin"
				uxMode="popup"
				className="google-o-auth-button-login"
			/>
		</div>
	)
}
