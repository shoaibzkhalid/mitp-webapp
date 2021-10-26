import axios from 'axios'
import { AppEnv } from '../../env'
import { ApiUser, ApiUserConnection } from '../../types'
import { getApiReqOptions } from './_helpers'

const r = axios.create({
	baseURL: AppEnv.apiBaseUrl
})

export default {
	async get() {
		return r
			.get('user/me', await getApiReqOptions())
			.then(d => d.data.data as ApiUser)
	},

	async update(data: { firstName: string; lastName: string; email: string }) {
		return r
			.post('user/me', data, await getApiReqOptions())
			.then(d => d.data.data as ApiUser)
	},

	async listConnections() {
		return r
			.get('/user/me/connection', await getApiReqOptions())
			.then(d => d.data.data as ApiUserConnection[])
	}
}
