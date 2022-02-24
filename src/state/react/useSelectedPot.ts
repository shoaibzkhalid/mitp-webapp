import { observable, runInAction } from 'mobx'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../queryClient'
import { userState } from '../user'

export const selectedPotState = observable({
	moneyPotId: '0'
})

function objectsAreSame(x, y) {
	let same = []
	x.forEach(e => {
		let foo = y.find(el => el.id === e.id)
		if (foo.checkinsThisWeek !== e.checkinsThisWeek) {
			same.push(foo.id)
		}
	})
	return same
}

export function useSelectedPot() {
	return useQuery(
		['money-pot', selectedPotState.moneyPotId],
		() => {
			return Api.userPots.get(selectedPotState.moneyPotId).then(pot => {
				if (selectedPotState.moneyPotId === '0' && pot)
					runInAction(() => {
						queryClient.setQueryData(['money-pot', pot.pot.id], () => pot)
						selectedPotState.moneyPotId = pot.pot.id
					})
				return pot
			})
		},
		{
			isDataEqual: (oldData: any, newData: any): any => {
				const oldCheckins = oldData?.users.map(user => {
					return {
						id: user.id,
						checkinsThisWeek: user.checkinsThisWeek
					}
				})
				const newCheckins = newData?.users.map(user => {
					return {
						id: user.id,
						checkinsThisWeek: user.checkinsThisWeek
					}
				})
				if (oldCheckins && newCheckins) {
					const changes = objectsAreSame(oldCheckins, newCheckins)
					if (changes.length > 0) {
						userState.changeNotify(true)
						userState.addNotifyUsers(changes)
					}
				}
			}
		}
	)
}
