import axios from 'axios'
import { AppEnv } from '../../env'
import { ApiPot } from '../../types'
import { getApiReqOptions } from './_helpers'

const r = axios.create({
	baseURL: AppEnv.apiBaseUrl
})

export default {
	async getMoneyPot(idOrSlug: string) {
		const options = await getApiReqOptions().catch(e => undefined)
		return r.get('money-pot-public/' + idOrSlug, options).then(
			d =>
				d.data.data as {
					pot: ApiPot
					isJoined: boolean
				}
		)
	},

	async createUser(user: {
		firstName: string
		lastName: string
		email: string | null
	}) {
		return r.post('user', user).then(
			d =>
				d.data.data.tokens as {
					accessToken: string
					refreshToken: string
				}
		)
	}
}