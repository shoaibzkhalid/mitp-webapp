import { useState, useContext, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { CheckInButton } from '../components/CheckInButton'
import { SpinnerBig } from '../components/SpinnerBig'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { selectedPotState, useSelectedPot } from '../state/react/useSelectedPot'
import dynamic from 'next/dynamic'
import { AppEnv } from '../env'
import Notification from '../components/notification'
import dayjs from 'dayjs'
import MemberCard from '../components/home/MemberCard'
import { useMediaQuery } from '../state/react/useMediaQuery'
import { SidebarContext } from '../state/contexts/sidebarContext'
import { formatTodayDate } from '../utils/formatTodayDate'
import { toggleSideBar } from '../utils/common'
import { copyToClipboard } from '../state/utils/copyToClipboard'

const PotChart = dynamic(() => import('../components/home/PotChart'), {
	ssr: false
})

const CheckinUpdateChart = dynamic(
	() => import('../components/home/CheckinUpdateChart'),
	{ ssr: false }
)

const MemberChart = dynamic(() => import('../components/home/MemberChart'), {
	ssr: false
})

export default wrapDashboardLayout(function OverviewPage() {
	const [notificationMessage, setNotificationMessage] = useState<string>('')
	const [checkinUserChartValue, setCheckinUserChartValue] = useState<number[]>([0, 0, 0])
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()
	const pot = useSelectedPot()

	if (!isLoading && data === null) {
		router.push('/pot/new')
	}

	if (!data) {
		return <SpinnerBig />
	}

	useEffect(() => {
		const users = data.users.length
		const completedUsers= data.users.filter(u => u.checkinsThisWeek === data.metrics.checkinsCount && u.checkinsThisWeek !== 0).length
		const payinUsers = data.users.filter(u => u.checkinsThisWeek < data.metrics.checkinsCount && u.checkinsThisWeek !== 0).length
		const unCompletedUsers = data.users.filter(u => u.checkinsThisWeek === 0).length
		setCheckinUserChartValue([completedUsers/users*100, payinUsers/users*100, unCompletedUsers/users*100])
	}, [data, setCheckinUserChartValue])

	const checkinCountUser = useMemo(
		() =>
			data.users.find(u => u.id === userState.user?.id)?.checkinsThisWeek || 0,
		[data]
	)

	const copyInviteLink = () => {
		copyToClipboard(`${AppEnv.webBaseUrl}/pot/${data.pot.slug}`)
		setNotificationMessage(`${AppEnv.webBaseUrl}/pot/${data.pot.slug} copied`)
		setTimeout(function () {
			setNotificationMessage('')
		}, 4000)
	}

	const date1 = dayjs(data.pot.createdAt).format('YYYY-MM-DD')
	const date2 = dayjs()
	const diff = date2.diff(date1)
	const createdDuration = dayjs.duration(diff)

	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	return (
		<>
			<Head>
				<title>Home - Camelot</title>
			</Head>
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				<div className="w-full flex flex-col flex-col-reverse xl:flex-row">
					<div className="px-10 pt-4 pb-1 xl:w-8/12 xl:px-12 md:px-8 md:pt-12">
						<div className="text-3xl font-medium">The Group Pot Of</div>
						<div className="text-6xl font-semibold" style={{ lineHeight: 1.5 }}>
							{data.pot.title}
						</div>
					</div>
					<div className="pl-8 pr-4 py-7 border-b border-gray-200 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-l xl:border-b-0">
						<div className="font-poppins flex justify-between items-center xl:justify-center lg:justify-end">
							<button
								className="block lg:hidden"
								onClick={() => handleClickToggleSideBar()}
							>
								<div className="w-8 mx-auto border-2 border-gray-900 rounded-2xl dark:border-white"></div>
								<div className="w-8 mt-3 mx-auto border-2 border-gray-900 rounded-2xl dark:border-white"></div>
							</button>
							<div className="text-center text-lg">
								<div className="text-gray-500 text-base hidden md:block">
									{pot.data?.users.length} member
									{pot.data?.users.length !== 1 && 's'}
								</div>
								<div
									className="cursor-pointer text-sm py-3 px-6 rounded-2xl bg-gray-900 text-white md:mt-2 md:text-base md:text-blue-600 md:p-0 md:bg-white dark:bg-gray-900"
									onClick={() => copyInviteLink()}
								>
									&mdash; copy invite url &mdash;
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col overflow-hidden xl:flex-row">
					<div className="px-10 xl:w-8/12 xl:px-12 md:px-8">
						<div className="pb-24 pt-24 flex flex-col items-center md:px-10">
							<div className="text-center text-xl text-gray-600">
								{checkinCountUser} / {data.pot.checkinCount} check-ins this week
							</div>
							<CheckInButton
								potId={selectedPotState.moneyPotId}
								disabled={checkinCountUser >= data.pot.checkinCount}
							></CheckInButton>
						</div>

						<div className="-card --shadow px-8 pb-8 pt-5">
							<div className="flex items-center text-xl font-bold justify-between">
								<div className="hidden md:block">Group Pot</div>
								<select
									className="px-5 py-4 w-full rounded-2xl text-base text-gray-500 outline-none border-gray-200 dark:bg-gray-900 dark:border-gray-900 md:w-44"
									style={{ borderWidth: '1px' }}
								>
									<option value="new">Less 30 days</option>
								</select>
							</div>

							<div className="md:grid grid-cols-3">
								<div>
									<div className="flex text-5xl font-bold text-center my-6 md:text-7xl">
										<div>${data.metrics.currentValue}</div>
										<div className="flex ml-3 mt-3 items-center text-primary text-sm md:hidden">
											<div className="h-10 pr-3">
												<CheckinUpdateChart />
											</div>
											<div className="flex items-center">
												<div
													className="flex justify-center items-center mr-1 w-5 h-5 bg-green-600"
													style={{ borderRadius: '50%' }}
												>
													<svg
														className="w-3 h-3"
														style={{ fontSize: '6px', fill: 'white' }}
													>
														<use xlinkHref="/img/sprite.svg#icon-arrow-up-fat"></use>
													</svg>
												</div>
												<span className="text-green-600">6%</span>
											</div>
										</div>
									</div>
									<div className="flex items-center my-6 text-primary text-sm">
										<img className="m-5" src="./img/checkin_icon.png"></img>
										<Link href="/overview">Group Check Ins</Link>
									</div>
									<hr />
									<div className="flex flex-row mt-3 items-center hidden md:flex">
										<div className="h-10 pr-3">
											<CheckinUpdateChart />
										</div>
										<div className="flex items-center">
											<div
												className="flex justify-center items-center mr-1 w-5 h-5 bg-green-600"
												style={{ borderRadius: '50%' }}
											>
												<svg
													className="w-3 h-3"
													style={{ fontSize: '6px', fill: 'white' }}
												>
													<use xlinkHref="/img/sprite.svg#icon-arrow-up-fat"></use>
												</svg>
											</div>
											<span className="text-green-600">6%</span>
										</div>
									</div>
									<p className="mt-6">
										Check ins are 6% higher this month than average.
									</p>
								</div>
								<div className="col-span-2">
									<PotChart />
								</div>
							</div>

							<div className="-hstack mt-8 flex flex-col md:flex-row">
								<div className="p-6 border-b">
									<div className="flex text-sm">
										<div className="flex justify-center items-center mr-1 w-5 h-5 rounded-md bg-purple-500">
											<img
												className="block"
												style={{ maxWidth: '8px' }}
												src="./img/folder.svg"
											></img>
										</div>
										<span>Check Ins</span>
									</div>
									<div className="text-3xl font-bold mt-3">
										{data.metrics.checkinsCount !== 0
											? data.metrics.checkinsCount
											: '--.--'}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-purple-500"
											style={{ width: '55%' }}
										></div>
									</div>
								</div>
								<div className="p-6 border-0 border-b md:border-l">
									<div className="flex text-sm">
										<div className="flex justify-center items-center mr-1 w-5 h-5 rounded-md bg-pink-400">
											<img
												className="block"
												style={{ maxWidth: '8px' }}
												src="./img/activity.svg"
											></img>
										</div>
										<span>Weekly 🔥</span>
									</div>
									<div className="text-3xl font-bold mt-3">{'--.--'}</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-pink-400"
											style={{ width: '55%' }}
										></div>
									</div>
								</div>
								<div className="p-6 border-0 md:border-l">
									<div className="flex text-sm">
										<div className="flex justify-center items-center mr-1 w-5 h-5 rounded-md bg-blue-500">
											<img
												className="block"
												style={{ maxWidth: '8px' }}
												src="./img/bag.svg"
											></img>
										</div>
										<span>Pay Ins</span>
									</div>
									<div className="text-3xl font-bold mt-3">
										{data.metrics.payinsCount !== 0
											? data.metrics.payinsCount
											: '--.--'}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-blue-500"
											style={{ width: '55%' }}
										></div>
									</div>
								</div>
							</div>
						</div>
						<div className="text-center pt-24 pb-8 text-sm">
							<p>
								This group has been around for{' '}
								<span className="font-bold">{`${createdDuration.months()} months`}</span>{' '}
								and{' '}
								<span className="font-bold">{`${createdDuration.days()} days`}</span>
							</p>
							<p className="mt-4">{`They have logged ${data.pot.checkinCount} check-ins`}</p>
						</div>
					</div>

					<div className="px-10 pb-4 flex flex-col w-full border-l border-gray-200 dark:border-gray-700 xl:w-4/12 xl:flex-col xl:px-12 md:px-8 md:flex-row">
						<div className="w-full p-0 xl:w-full xl:p-0 md:w-6/12 md:pr-3">
							<div className="-card --shadow px-8 py-5 mt-24 md:px-10">
								<MemberChart checkinUserChartValue={checkinUserChartValue} />
								<div className="text-center mt-6">
									<div className="mb-3 text-gray-500">Today is </div>
									<div className="text-lg font-bold mb-8">
										{formatTodayDate()}
									</div>
									<div className="text-xs text-gray-500">
										Those who have not checked in by <br />
										the end of the week pay in to the port
									</div>
								</div>
								<div className="flex mt-12 justify-around">
									<div className="flex items-center">
										<div
											className="bg-purple-600 rounded-lg mr-2 text-xs"
											style={{ width: '20px', height: '20px' }}
										></div>
										<span>{data.metrics.checkinsCount} check ins</span>
									</div>
									<div className="flex items-center">
										<div
											className="rounded-lg mr-2"
											style={{
												width: '20px',
												height: '20px',
												background: '#FFC0CB'
											}}
										></div>
										<span>{data.metrics.payinsCount} pay ins</span>
									</div>
								</div>
								<button
									className="p-4 mt-6 w-full rounded-2xl bg-gray-100 dark:bg-gray-900"
									onClick={() => router.push('/overview')}
								>
									View Activity
								</button>
							</div>
						</div>
						<div className="w-full p-0 xl:w-full xl:p-0 md:w-6/12 md:pl-3">
							<div className="-card --shadow px-8 py-5 mt-5 md:px-10">
								{pot.data?.users && (
									<MemberCard users={pot.data?.users}/>
								)}
								
							</div>
						</div>
					</div>
				</div>
			</div>

			{notificationMessage !== '' && (
				<Notification message={notificationMessage} />
			)}
		</>
	)
})
