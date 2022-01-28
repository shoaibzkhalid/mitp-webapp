
import Head from 'next/head'
import { useRouter } from 'next/router'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { SpinnerBig } from '../components/SpinnerBig'
import { useEffect } from 'react';
import { Api } from '../api';
import { runInAction } from 'mobx';
import { selectedPotState } from '../state/react/useSelectedPot'
import { observer } from 'mobx-react-lite'

export default observer(function OnboardPage() {
	const router = useRouter()
	// useEffect(() => {
	// 	// declare the data fetching function
	// 	const fetchData = async () => {
	// 		if(!userState.user) return;
	// 		const potData = await Api.userPots.list()
	// 		if(potData.length===0) {
	// 			const state ={
	// 				step: 0,
	// 				title: 'Workout for at least 10 minutes',
	// 				description: '',
	// 				checkinCount: 1,
	// 				minAmount: 0
	// 			}
	// 			const pot = await Api.userPots.create(state)

	// 			runInAction(() => {
	// 				selectedPotState.moneyPotId = pot?.id as string
	// 			})
	// 		} else {
	// 			runInAction(() => {
	// 				selectedPotState.moneyPotId = potData[0]?.moneyPotId as string
	// 			})
	// 		}
	// 	}
	// 	fetchData()
	//   }, [userState])
	console.log('asdf', userState.user)
	if (!userState.user) {
		return <SpinnerBig />
	} else {
		router.push('/home')
	}
})
