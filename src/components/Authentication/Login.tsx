import { GoogleLogin } from 'react-google-login'
import { AuthCred } from './AuthCreds'
import { useMutation } from 'react-query'
import { userState } from '../../state/user'
import { Api } from '../../api'

const Login = props => {
	const authSuccess = response => {
		props.authSuccess(true)
		console.log(response)
		props.userData(response.profileObj)
		localStorage.setItem('authData', response.tokenObj.id_token.toString())
		console.log('Local storage data', localStorage.getItem('authData'))
		const googleAuthToken = localStorage.getItem('authData')
		const params = {
			googleAccessToken: googleAuthToken as string
		}
		saveGoogleUserLogin.mutate(params)
	}

	const saveGoogleUserLogin = useMutation(
		'save-user',
		Api.user.googleUserLogin,
		{
			onSuccess() {
				userState.load()
			}
		}
	)

	const authFaiulue = response => {
		console.log(response)
	}

	const clientId = AuthCred.CLIENT_ID

	return (
		<div>
			<GoogleLogin
				clientId={clientId}
				buttonText="Sign In With Google"
				onSuccess={authSuccess}
				onFailure={authFaiulue}
				cookiePolicy={'single_host_origin'}
				uxMode="popup"
				className="google-o-auth-button-login"
				isSignedIn={true}
			/>
		</div>
	)
}

export default Login
