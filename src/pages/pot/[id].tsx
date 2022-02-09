import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { SpinnerBig } from '../../components/SpinnerBig'
import { userState } from '../../state/user'
import { selectedPotState } from '../../state/react/useSelectedPot'

export default observer(function PotById() {
	const router = useRouter()

	const potQuery = useQuery(
		['money-pot-public', router.query.id],
		async () => {
			if (!userState.loaded) await userState.load()
			return Api.public.getMoneyPot(router.query.id as string).catch(e => {
				if (e.message.includes('404')) throw new Error('Pot not found')
				else throw new Error('Internal server error.')
			})
		},
		{
			enabled: !!router.query.id,
			retry: false,
			async onSuccess(v) {
				// If not joined but logged in, join
				if (!v.isJoined && userState.user) {
					await Api.userPots.join(v.pot.id)
				}

				// If logged in, redirect (we ensure the user was a member in
				// the previous step)
				if (userState.user) {
					runInAction(() => {
						selectedPotState.moneyPotId = v.pot.id
					})
					router.push('/home')
					return
				}

				// Otherwise, store for later and redirect to login
				localStorage.setItem(
					'post-login-action',
					JSON.stringify({
						type: 'goto-pot',
						potId: v.pot.id
					})
				)
				router.push('/paypal/skip')
			}
		}
	)

	return (
		<div className="w-full max-w-lg mx-auto p-8">
			{potQuery.isFetching ? (
				<SpinnerBig />
			) : potQuery.isError ? (
				<div>Error: {(potQuery.error as any).message}</div>
			) : (
				<div>Fetching pot...</div>
			)}
		</div>
	)
})
