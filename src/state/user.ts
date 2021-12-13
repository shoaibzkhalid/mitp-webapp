import { observable, reaction, runInAction } from 'mobx'
import { Api } from '../api'
import { ApiUser } from '../types'
import dayjs from 'dayjs'
import jwtDecode from 'jwt-decode'

export const userState = observable({
	user: null as null | ApiUser,
	tokens: {
		accessToken: null as null | string,
		refreshToken: null as null | string
	},
	loaded: false,
	ready: false,
	howItWorks: false,

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
	},
	toggleReady() {
		userState.ready = !userState.ready
	},
	setHowItWorks(val: boolean) {
		userState.howItWorks = val
	},
	async getAccessToken() {
		if (!userState.tokens.refreshToken) throw new Error('User not logged in')

		let doRefresh = false
		if (!userState.tokens.accessToken) doRefresh = true
		else {
			const tokenData: any = jwtDecode(userState.tokens.accessToken)
			doRefresh = dayjs()
				.add(1, 'minute')
				.isAfter(tokenData.exp * 1000)
		}
		if (doRefresh) {
			const tokens = await Api.r.post(
				'/auth/refresh',
				{},
				{
					headers: {
						authorization: 'Bearer ' + userState.tokens.refreshToken
					}
				}
			)

			runInAction(() => {
				userState.tokens.accessToken = tokens.data.data.accessToken
			})
		}

		return userState.tokens.accessToken
	}
})

reaction(
	() => userState.tokens,
	() => {
		userState.save()
	}
)
