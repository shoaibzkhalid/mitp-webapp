import { Api } from '../../api'
import { ApiPot, ApiUser, ApiUser_MoneyPot } from '../../types'

export default {
	list: () => Api.get<ApiUser_MoneyPot[]>('money-pot'),

	join: (id: string) => Api.post(`money-pot-public/${id}/join`, {}),

	get: (id: string) =>
		Api.get<{
			pot: ApiPot
			users: Array<
				ApiUser & {
					checkinsThisWeek: number
					amount: string
					lastCheckinAt: string | null
				}
			>
			metrics: {
				currentValue: number
				payinsCount: number
				checkinsCount: number
			}
			dailyStatistics: number[]
		}>(`money-pot/${id}`),

	create: (d: {
		title: string
		description: string
		checkinCount: number
		minAmount: number
	}) => Api.post<ApiPot>('money-pot', d),

	update: (id: string, data: any) => Api.post<ApiPot>(`money-pot/${id}`, data),

	updateUser: (
		potId: string,
		userId: string,
		data: { amount: string; readyUpAt?: Date | string | null }
	) => Api.post(`money-pot/${potId}/user/${userId}`, data),

	deletePotUser: (potId: string, userId: any) =>
		Api.delete<ApiPot>(`money-pot/${potId}/user/${userId}`),

	deletePot: (potId: string) => Api.delete<ApiPot>(`money-pot/${potId}`)
}
