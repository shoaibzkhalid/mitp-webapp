import { observable, reaction, runInAction } from 'mobx'
import { Api } from '../api'
import { ApiUser } from '../types'
import dayjs from 'dayjs'
import jwtDecode from 'jwt-decode'
import { selectedPotState } from '../state/react/useSelectedPot'

export const userState = observable({
	user: null as null | ApiUser,
	tokens: {
		accessToken: null as null | string,
		refreshToken: null as null | string
	},
	loaded: false,
	ready: false,
	howItWorks: false,
	inviteMsg: false,
	notify: false,
	notify_users: [],
	isUploading: false,

	addNotifyUsers(users: any) {
		userState.notify_users.push(...users)
		let unique = userState.notify_users.filter((value, index, self) => {
			return self.indexOf(value) === index
		})
		userState.notify_users = unique
		localStorage.setItem('notify_users', JSON.stringify(userState.notify_users))
	},

	removeNotifyUser(userId: string) {
		const index = userState.notify_users.indexOf(userId)
		userState.notify_users.splice(index, 1)
		localStorage.setItem('notify_users', JSON.stringify(userState.notify_users))
	},

	changeNotify(val: boolean) {
		localStorage.setItem('notify', JSON.stringify(val))
		userState.notify = val
	},

	resetNotify() {
		localStorage.setItem('notify_users', JSON.stringify([]))
		localStorage.setItem('notify', JSON.stringify(false))
		userState.notify_users = []
		userState.notify = false
	},

	async load() {
		runInAction(() => {
			userState.notify = JSON.parse(localStorage.getItem('notify')) || false
			userState.notify_users =
				JSON.parse(localStorage.getItem('notify_users')) || []

			userState.inviteMsg =
				JSON.parse(localStorage.getItem('inviteMsg')) || false
		})

		if (!userState.tokens.refreshToken) {
			const tokenPayload = localStorage.getItem('mitp_tokens')
			if (!tokenPayload) return
			runInAction(() => {
				userState.tokens = JSON.parse(tokenPayload)
			})
		}

		if (!userState.tokens.refreshToken) return

		const user = await Api.user.get().catch(e => {
			const status = e.response?.status
			if (status === 401)
				runInAction(() => {
					userState.tokens.accessToken = null
					userState.tokens.refreshToken = null
				})
			return null
		})

		const potData = await Api.userPots.list()
		if (potData.length === 0) {
			const state = {
				step: 0,
				title: 'Workout for at least 10 minutes',
				description: '',
				checkinCount: 1,
				minAmount: 0
			}
			const pot = await Api.userPots.create(state)

			runInAction(() => {
				selectedPotState.moneyPotId = pot?.id as string
			})
		} else {
			runInAction(() => {
				selectedPotState.moneyPotId = potData[0]?.moneyPotId as string
			})
		}

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
	clear() {
		userState.tokens = {
			accessToken: null,
			refreshToken: null
		}
		localStorage.setItem('mitp_tokens', '')
		localStorage.removeItem('notify_users')
		localStorage.removeItem('notify')
		localStorage.removeItem('inviteMsg')
	},
	toggleReady() {
		userState.ready = !userState.ready
	},
	setHowItWorks(val: boolean) {
		userState.howItWorks = val
	},

	setInviteMsg(val: boolean) {
		localStorage.setItem('inviteMsg', JSON.stringify(val))
		userState.inviteMsg = val
	},
	setIsUploading(val: boolean) {
		userState.isUploading = val
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
