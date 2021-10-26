import axios from 'axios'
import dayjs from 'dayjs'
import jwtDecode from 'jwt-decode'
import { runInAction } from 'mobx'
import { AppEnv } from '../../env'

const r = axios.create({
	baseURL: AppEnv.apiBaseUrl
})

export async function getApiReqOptions() {
	const userState = require('../user').userState

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
		const tokens = await r.post(
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

	return {
		headers: {
			authorization: 'Bearer ' + userState.tokens.accessToken
		}
	}
}
