import { Api } from '../../api'
import { ApiPot } from '../../types'

export default {
	getMoneyPot: (idOrSlug: string) =>
		Api.get<{
			pot: ApiPot
			isJoined: boolean
		}>('money-pot-public/' + idOrSlug),

	createUser: (user: {
		firstName: string
		lastName: string
		email: string | null
	}) =>
		Api.post<{
			tokens: {
				accessToken: string
				refreshToken: string
			}
		}>('user', user).then(d => d.tokens)
}
