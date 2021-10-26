import axios from 'axios'
import { AppEnv } from '../../env'
import { ApiPot, ApiUser, ApiUser_MoneyPot } from '../../types'
import { getApiReqOptions } from './_helpers'

const r = axios.create({
	baseURL: AppEnv.apiBaseUrl
})

export default {
	async list() {
		return r
			.get('money-pot', await getApiReqOptions())
			.then(d => d.data.data as Array<ApiUser_MoneyPot>)
	},

	async join(id: string) {
		return r.post(`money-pot-public/${id}/join`, {}, await getApiReqOptions())
	},

	async get(id: string) {
		return r.get(`money-pot/${id}`, await getApiReqOptions()).then(
			d =>
				d.data.data as {
					pot: ApiPot
					users: Array<
						ApiUser & {
							checkinsThisWeek: number
							amount: string
						}
					>
					metrics: {
						currentValue: number
						payinsCount: number
						checkinsCount: number
					}
					dailyStatistics: number[]
					isAdmin: boolean
				}
		)
	},

	async create(d: {
		title: string
		description: string
		checkinCount: number
		minAmount: number
	}) {
		return r
			.post('money-pot', d, await getApiReqOptions())
			.then(d => d.data.data as ApiPot)
	},

	async update(id: string, data: any) {
		return r
			.post(`money-pot/${id}`, data, await getApiReqOptions())
			.then(d => d.data.data as ApiPot)
	},

	async updateUser(potId: string, userId: string, data: { amount: string }) {
		return r.post(
			`money-pot/${potId}/user/${userId}`,
			data,
			await getApiReqOptions()
		)
	}
}
