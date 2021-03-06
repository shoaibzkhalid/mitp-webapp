import { ApiPotLog, ApiMoneyBundle } from './types'
import axios, { AxiosResponse } from 'axios'
import { AppEnv } from './env'
import publicApi from './state/api/public'
import userApi from './state/api/user'
import userPotsApi from './state/api/userPots'
import { userState } from './state/user'

const r = axios.create({
	baseURL: AppEnv.apiBaseUrl
})

function handleResponse(d: AxiosResponse) {
	if (d.status !== 200) {
		if (d.status === 401) {
			userState.clear()
			window.location.assign(
				process.env.NODE_ENV === 'production' ? '/' : AppEnv.landingPageUrl
			)
		}
		console.log('API Error:', d.status, d.data)
		const e: any = new Error('Non-200 status code API response')
		e.status = d.status
		throw e
	}
	if (d.data?.data === undefined) return d.data
	else return d.data?.data
}

export const Api = {
	r,

	public: publicApi,
	user: userApi,
	userPots: userPotsApi,

	async get<T = any>(url: string, params?: object): Promise<T> {
		return r
			.get(url, {
				params,
				headers: {
					authorization: userState.tokens.refreshToken
						? `Bearer ${await userState.getAccessToken()}`
						: ''
				},
				validateStatus: () => true
			})
			.then(handleResponse)
	},

	async post<T = any>(url: string, data?: object, params?: object): Promise<T> {
		return r
			.post(url, data, {
				params,
				headers: {
					authorization: userState.tokens.refreshToken
						? `Bearer ${await userState.getAccessToken()}`
						: ''
				},
				validateStatus: () => true
			})
			.then(handleResponse)
	},

	async delete<T = any>(
		url: string,
		data?: object,
		params?: object
	): Promise<T> {
		return r
			.delete(url, {
				params,
				data,
				headers: {
					authorization: userState.tokens.refreshToken
						? `Bearer ${await userState.getAccessToken()}`
						: ''
				},
				validateStatus: () => true
			})
			.then(handleResponse)
	},

	transactionsList: () =>
		Api.get<{
			currentCredits: string
			transactions: ApiMoneyBundle[]
		}>('transaction'),

	logsCreate: (moneyPotId: string, file: File) => {
		const fd = new FormData()
		fd.append('picture', file)
		return Api.post(`money-pot/${moneyPotId}/log`, fd)
	},

	logUpdate: (moneyPotId: string, data: { description: string }) => {
		return Api.post(`log/${moneyPotId}`, data)
	},

	logDescDelete: (moneyPotId: string) => {
		return Api.post(`log/${moneyPotId}`, { description: '' })
	},

	logsList: (moneyPotId: string, userId: string) =>
		Api.get<{ logs: ApiPotLog[] }>(`money-pot/${moneyPotId}/user/${userId}`),

	tokensGetFromPayPal: (code: string) =>
		Api.get<{
			tokens: {
				accessToken: string
				refreshToken: string
			}
		}>('paypal/login-callback', {
			code
		}).then(d => d.tokens)
}
