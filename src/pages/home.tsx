import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { CheckInButton } from '../components/CheckInButton'
import { SpinnerBig } from '../components/SpinnerBig'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { selectedPotState, useSelectedPot } from '../state/useSelectedPot'
import dynamic from 'next/dynamic'

const PotChart = dynamic(() => import('../components/PotChart'), { ssr: false })

export default wrapDashboardLayout(function OverviewPage() {
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()

	// if (!isLoading && data === null) {
	// 	router.push('/pot/new')
	// }

	// if (!data) {
	// 	return <SpinnerBig />
	// }

	// const checkinCountUser = useMemo(
	// 	() =>
	// 		data.users.find(u => u.id === userState.user?.id)?.checkinsThisWeek || 0,
	// 	[data]
	// )

	return (
		<>
			<Head>
				<title>Home - Camelot</title>
			</Head>

			<div className="py-12 pb-10 font-poppins">
				<div className="text-2xl mb-3">The Group Pot Of</div>
				{/* <div className="text-5xl font-semibold">{data.pot.title}</div> */}
			</div>

			<div className="p-10 pb-20 flex flex-col items-center">
				<div className="text-center text-xl text-gray-600">
					{/* {checkinCountUser} / {data.pot.checkinCount} check-ins this week */}
				</div>
				{/* <CheckInButton
					potId={selectedPotState.moneyPotId}
					disabled={checkinCountUser >= data.pot.checkinCount}
				></CheckInButton> */}
			</div>

			<div className="-card --shadow p-8">
				<div className="text-xl font-bold">March Pot</div>

				<div className="md:grid grid-cols-3">
					<div>
						<div className="text-7xl font-bold text-center my-6">
							{/* ${data.metrics.currentValue} */}
						</div>
						<div className="flex items-center my-6 text-primary">
							<Link href="/overview">Group Check Ins</Link>
						</div>
						<hr />
						<p className="mt-6">
							Check ins are 6% higher this month than average.
						</p>
					</div>
					<div className="col-span-2">
						<PotChart />
					</div>
				</div>

				<div className="-hstack mt-8">
					<div className="p-6">
						<div>Check Ins</div>
						<div className="text-3xl font-bold">
							{/* {data.metrics.checkinsCount} */}
						</div>
					</div>
					<div className="p-6">
						<div>Weekly Streak 🔥</div>
						<div className="text-3xl font-bold">{0}</div>
					</div>
					<div className="p-6">
						<div>Pay Ins</div>
						{/* <div className="text-3xl font-bold">{data.metrics.payinsCount}</div> */}
					</div>
				</div>
			</div>
		</>
	)
})
