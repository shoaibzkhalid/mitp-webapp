import { runInAction } from 'mobx'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { selectedPotState } from '../state/react/useSelectedPot'
import { userState } from '../state/user'

export default function QrCodeLoginPage() {
	const router = useRouter()

	useEffect(() => {
		const token = router.query.t as string
		const potId = router.query.p as string
		if (token && potId) {
			runInAction(() => {
				userState.tokens = {
					accessToken: '',
					refreshToken: token
				}
				selectedPotState.moneyPotId = potId
			})

			userState.load().then(() => {
				router.push('/home')
			})
		}
	}, [router.query])

	return null
}
