import { runInAction } from 'mobx'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { userState } from '../../state/user'

export default function LoginCallback() {
	const router = useRouter()

	const getTokenMutation = useMutation('get-token', (code: string) =>
		userState
			.load()
			.then(() => Api.tokensGetFromPayPal(code))
			.then(d => {
				runInAction(() => {
					userState.tokens.accessToken = d.accessToken
					userState.tokens.refreshToken = d.refreshToken
				})

				return userState.save()
			})
			.then(() => userState.load())
	)

	useEffect(() => {
		const code = router.query.code

		if (typeof code === 'string') {
			getTokenMutation.mutateAsync(code).then(() => {
				const actionRaw = localStorage.getItem('post-login-action')

				if (actionRaw) {
					localStorage.removeItem('post-login-action')
					try {
						const action = JSON.parse(actionRaw)
						if (action.type === 'goto-pot')
							return router.replace(`/pot/${action.potId}`)
					} catch (e) {}
				}

				if (userState.user) router.replace('/home')
			})
		}
	}, [router.query])

	return (
		<div className="max-w-md mx-auto">
			<div className="text-primary font-bold text-4xl my-8">
				Logging in with PayPal...
			</div>
		</div>
	)
}
