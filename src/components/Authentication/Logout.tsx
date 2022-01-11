import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { GoogleLogout } from 'react-google-login'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { AppEnv } from '../../env'
import { userState } from '../../state/user'

export const Logout = observer(function Logout() {
	const connection = userState.user?.connections.find(
		c => c.service === 'google'
	)

	if (!connection) return null

	const deleteConnection = useMutation('delete-google-connection', async () => {
		// The code removes the user's connection to Google, which the button
		// currently does not do
		//
		// await Api.user.deleteConnection(connection.id)
		// return userState.load()

		runInAction(() => {
			userState.tokens = {
				accessToken: null,
				refreshToken: null
			}
		})
		window.location.assign('/')
	})

	return (
		<div>
			<GoogleLogout
				clientId={AppEnv.googleClientId}
				buttonText={`Logout ${connection.meta?.given_name || 'Google Account'}`}
				onLogoutSuccess={() => deleteConnection.mutate()}
				className="google-o-auth-button-logout"
			></GoogleLogout>
		</div>
	)
})
