import Head from 'next/head'
import { useRouter } from 'next/router'
import { userState } from '../state/user'
import { SpinnerBig } from '../components/SpinnerBig'
import { observer } from 'mobx-react-lite'

export default observer(function OnboardPage() {
	const router = useRouter()

	if (!userState || !userState.user) {
		return <SpinnerBig />
	} else {
		console.log('router')
		router.push('/home')
	}
})
