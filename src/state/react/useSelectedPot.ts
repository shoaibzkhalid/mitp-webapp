import { observable, runInAction } from 'mobx'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../queryClient'

export const selectedPotState = observable({
	moneyPotId: '0'
})

export function useSelectedPot() {
	return useQuery(['money-pot', selectedPotState.moneyPotId], () => {
		return Api.userPots.get(selectedPotState.moneyPotId).then(pot => {
			if (selectedPotState.moneyPotId === '0' && pot)
				runInAction(() => {
					queryClient.setQueryData(['money-pot', pot.pot.id], () => pot)
					selectedPotState.moneyPotId = pot.pot.id
				})
			return pot
		})
	})
}
