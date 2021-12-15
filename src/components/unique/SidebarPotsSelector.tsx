import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { userState } from '../../state/user'
import {
	selectedPotState,
	useSelectedPot
} from '../../state/react/useSelectedPot'

export const SidebarPotsSelector = observer(function SidebarPotsSelector() {
	const { isLoading: potsLoading, data: pots } = useQuery(
		['user-pots', userState.user?.id],
		Api.userPots.list
	)

	const { data: selectedPot } = useSelectedPot()
	const router = useRouter()

	if (potsLoading && userState.user)
		return (
			<select className="px-5 py-4 w-full shadow-md rounded-md text-gray-700">
				<option>Loading...</option>
			</select>
		)

	return (
		<select
			className="px-5 py-4 w-full shadow-md rounded-md text-gray-500 outline-none bg-gray-100 dark:bg-dark"
			onChange={e =>
				runInAction(() => {
					const v = e.target.value
					if (v === 'new') {
						router.push('/create')
					} else {
						selectedPotState.moneyPotId = v
					}
				})
			}
		>
			{pots?.map(p => {
				return (
					<option
						value={p.moneyPotId}
						selected={p.moneyPotId === selectedPot?.pot.id}
					>
						{p.moneyPot?.title || 'No title'}
					</option>
				)
			})}
			{userState.user ? (
				<option value="new">Create new pot</option>
			) : (
				<option value="new">You have no pots</option>
			)}
		</select>
	)
})
