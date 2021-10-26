import { ApiPotLog, ApiTransaction } from './types'
import axios from 'axios'
import { AppEnv } from './env'
import { getApiReqOptions } from './state/api/_helpers'
import publicApi from './state/api/public'
import userApi from './state/api/user'
import userPotsApi from './state/api/userPots'

const r = axios.create({
	baseURL: AppEnv.apiBaseUrl
})

export const Api = {
	public: publicApi,
	user: userApi,
	userPots: userPotsApi,

	async transactionsList() {
		return r.get('transaction', await getApiReqOptions()).then(
			d =>
				d.data.data as {
					currentCredits: string
					transactions: ApiTransaction[]
				}
		)
	},

	async logsCreate(moneyPotId: string, file: File) {
		const fd = new FormData()
		fd.append('picture', file)
		return r.post(`money-pot/${moneyPotId}/log`, fd, await getApiReqOptions())
	},

	async logsList(moneyPotId: string, userId: string) {
		return r
			.get(`money-pot/${moneyPotId}/user/${userId}`, await getApiReqOptions())
			.then(d => d.data.data.logs as ApiPotLog[])
	},

	async tokensGetFromPayPal(code: string) {
		return r
			.get('paypal/login-callback', {
				params: {
					code
				},
				...(await getApiReqOptions().catch(e => null))
			})
			.then(
				d =>
					d.data.data.tokens as {
						accessToken: string
						refreshToken: string
					}
			)
	}
}
