import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { SpinnerBig } from '../../components/SpinnerBig'
import { wrapDashboardLayout } from '../../components/unique/DashboardLayout'
import { userState } from '../../state/user'

export default wrapDashboardLayout(function PayPalPayinCallback() {
	const router = useRouter()

	const processMutation = useMutation(
		'process-payin',
		async (token: string) => {
			await userState.load()
			if (!userState.user) throw new Error('User not logged in')

			await Api.user.payinConfirm(token)
		}
	)

	useEffect(() => {
		const token = router.query.token

		if (typeof token === 'string') {
			processMutation.mutateAsync(token).then(() => {
				router.replace('/home')
			})
		}
	}, [router.query])

	return (
		<div className="max-w-md mx-auto">
			<div className="text-primary font-bold text-4xl my-8">
				Processing payment...
			</div>

			<SpinnerBig />
		</div>
	)
})
