import { Api } from '../../api'
import { ApiUser, ApiUserConnection } from '../../types'

export default {
	get: () => Api.get<ApiUser>('user/me'),

	update: (data: { firstName: string; lastName: string; email: string }) =>
		Api.post<ApiUser>('user/me', data),

	updateAvatar: (file: File) => {
		const fd = new FormData()
		fd.append('picture', file)
		return Api.post(`user/me/avatar`, fd)
	},

	listConnections: () => Api.get<ApiUserConnection[]>('user/me/connection'),

	googleUserLogin: (data: { googleAccessToken: string }) =>
		Api.post<any>('googleUserAuth', data),

	payin: (amount: number) =>
		Api.post<{
			approveUrl: string
		}>('payin', {
			amount: (BigInt(amount) * BigInt(100)).toString()
		}),

	payinConfirm: (token: string) =>
		Api.post('payin-confirm', {
			token
		})
}
