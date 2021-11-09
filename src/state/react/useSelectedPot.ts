import { observable, runInAction } from 'mobx'
import { useQuery } from 'react-query'
import { Api } from '../../api'

export const selectedPotState = observable({
	moneyPotId: '0'
})

export function useSelectedPot() {
	return useQuery(['money-pot', selectedPotState.moneyPotId], () =>
		selectedPotState.moneyPotId
			? Api.userPots.get(selectedPotState.moneyPotId).then(pot => {
					if (selectedPotState.moneyPotId === '0' && pot)
						runInAction(() => {
							selectedPotState.moneyPotId = pot.pot.id
						})
					return pot
			  })
			: null
	)
}
