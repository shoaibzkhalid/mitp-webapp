import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../../api'
import { Input } from '../../components/Input'
import { SpinnerBig } from '../../components/SpinnerBig'
import { userState } from '../../state/user'
import { Login } from '../../components/Authentication/Login'

export default observer(function PotNew() {
	const router = useRouter()

	if (!userState.loaded) return <SpinnerBig />

	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [localStorageItem, setLocalStorageItem] = useState({
		potId: ''
	})

	useEffect(() => {
		if (localStorageItem.potId) return
		const actionRaw = localStorage.getItem('post-login-action')
		if (!actionRaw) return
		try {
			const action = JSON.parse(actionRaw)
			setLocalStorageItem({
				potId: action.potId
			})
		} catch (e) {}
	}, [localStorageItem.potId])

	const pot = useQuery(
		['money-pot-public', localStorageItem.potId],
		async () => {
			if (!userState.loaded) await userState.load()
			return Api.public
				.getMoneyPot(localStorageItem.potId as string)
				.catch(e => {
					if (e.message.includes('404')) throw new Error('Pot not found')
					else throw new Error('Internal server error.')
				})
		},
		{
			enabled: !!localStorageItem.potId,
			retry: false
		}
	)

	const createAccountMutation = useMutation(
		'create-pot',
		async () => {
			const newUserTokens = await Api.public.createUser({
				email: email,
				firstName: firstName,
				lastName: ''
			})

			runInAction(() => {
				userState.tokens = newUserTokens
			})

			await userState.load()
		},
		{
			onSuccess() {
				localStorage.removeItem('post-login-action')
				return router.replace(`/pot/${localStorageItem.potId}`)
			}
		}
	)

	return (
		<div className="w-full max-w-3xl mx-auto my-10 px-7 pb-7 -card --shadow">
			<div className="flex justify-center">
				<img src="/img/Gift_optimized.gif" style={{ height: '200px' }} />
			</div>

			<div className="text-center font-bold text-xl mt-7">
				Join your friends challenge by connecting with google
			</div>
			<div className="py-16" style={{ margin: 'auto', width: '190px' }}>
				<Login title={'Continue With Google'} autoLoad={true} />
			</div>
		</div>
	)
})
