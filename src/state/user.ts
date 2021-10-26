import { observable, reaction, runInAction } from 'mobx'
import { Api } from '../api'
import { ApiUser } from '../types'

export const userState = observable({
	user: null as null | ApiUser,
	tokens: {
		accessToken: null as null | string,
		refreshToken: null as null | string
	},
	loaded: false,

	async load() {
		if (!userState.tokens.accessToken) {
			const tokenPayload = localStorage.getItem('mitp_tokens')
			if (!tokenPayload) return
			runInAction(() => {
				userState.tokens = JSON.parse(tokenPayload)
			})
		}

		if (!userState.tokens.accessToken) return

		const user = await Api.user.get().catch(e => {
			const status = e.response?.status
			if (status === 401)
				runInAction(() => {
					userState.tokens.accessToken = null
					userState.tokens.refreshToken = null
				})
			return null
		})

		runInAction(() => {
			userState.user = user
		})

		if (user) {
			console.log(`User logged in (${user.id})`)
		}
	},
	save() {
		console.log('Saved new account tokens')
		localStorage.setItem('mitp_tokens', JSON.stringify(userState.tokens))
	}
})

reaction(
	() => userState.tokens,
	() => {
		userState.save()
	}
)
