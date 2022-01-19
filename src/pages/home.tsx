import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { CheckInButton } from '../components/CheckInButton'
import { SpinnerBig } from '../components/SpinnerBig'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import dynamic from 'next/dynamic'
import Notification from '../components/notification'
import dayjs from 'dayjs'
import { getCheckInProgress } from '../utils/common'
import ReactModal from 'react-modal'
import { useNextAppElement } from '../state/react/useNextAppElement'
import { Intro } from '../components/intros/Intro'
import { HowItWorksIntro } from '../components/intros/HowItWorksIntro'
import { Header } from '../components/unique/Header'
import CopyInviteLink from '../components/notification/CopyInviteLink'
import { toggleSideBar } from '../utils/common'
import { GroupSettingsModal } from '../components/modals/GroupSettingsModal'
import { ProfileSettingModalInner } from '../components/modals/ProfileSettingModalInner'
import clsx from 'clsx'
import { AppEnv } from '../env'

const PotChart = dynamic(() => import('../components/home/PotChart'), {
	ssr: false
})

const CheckinUpdateChart = dynamic(
	() => import('../components/home/CheckinUpdateChart'),
	{ ssr: false }
)

export default wrapDashboardLayout(function OverviewPage() {
	const [notificationMessage, setNotificationMessage] = useState<string>('')

	const [checkinUserChartValue, setCheckinUserChartValue] = useState<number[]>([
		0, 0, 0
	])
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()
	const pot = useSelectedPot()
	const [openGroupDetailModal, setOpenGroupDetailModal] = useState(false)
	const [viewRuleDropDown, setViewRuleDropDown] = useState(false)
	const [youGetPaidDropDown, setYouGetPaidDropDown] = useState(false)
	const [openReadyUpModal, setOpenReadyUpModal] = useState(false)
	const [potView, setPotView] = useState('Total Pot')

	const appElement = useNextAppElement()

	if (!isLoading && data === null) {
		router.push('/new')
	}

	if (!data) {
		return <SpinnerBig />
	}

	const totalPotValue = data?.users?.reduce(
		(prev, curr) => prev + parseInt(curr.amount) * 4,
		0
	)
	let readyUpCount = 0
	data.users.map(user =>
		user.readyUpAt ? (readyUpCount += 1) : (readyUpCount += 0)
	)

	useEffect(() => {
		toggleSideBar(false)
	}, [])

	useEffect(() => {
		const users = data?.users.length
		const completedUsers = data?.users.filter(
			u =>
				u.checkinsThisWeek === data?.metrics.checkinsCount &&
				u.checkinsThisWeek !== 0
		).length
		const payinUsers = data?.users.filter(
			u =>
				u.checkinsThisWeek < data?.metrics.checkinsCount &&
				u.checkinsThisWeek !== 0
		).length
		const unCompletedUsers = data?.users.filter(
			u => u.checkinsThisWeek === 0
		).length
		setCheckinUserChartValue([
			(completedUsers / users) * 100,
			(payinUsers / users) * 100,
			(unCompletedUsers / users) * 100
		])
	}, [data, setCheckinUserChartValue])

	const checkinCountUser = useMemo(
		() =>
			data?.users.find(u => u.id === userState.user?.id)?.checkinsThisWeek || 0,
		[data]
	)

	const potAdminUser = useMemo(() => data?.users.find(u => u.admin), [data])

	const potUser = useMemo(
		() => data?.users.find(u => u.id === userState.user?.id),
		[data]
	)

	const date1 = dayjs(data?.pot.createdAt).format('YYYY-MM-DD')
	const date2 = dayjs()
	const diff = date2.diff(date1)
	const createdDuration = dayjs.duration(diff)

	const daysLeft = dayjs()
		.endOf('week')
		.add(1, 'second') // to make the end of the week the start of the next week
		.diff(dayjs().startOf('day'), 'days')

	const failedUsers = pot.data?.users.filter(
		user => pot.data.pot.checkinCount - user.checkinsThisWeek > daysLeft
	).length

	return (
		<>
			<Head>
				<title>{`Your Group - ${data?.pot.title}`}</title>
			</Head>

			<>
				<Intro
					label="homepage"
					enabled={userState.loaded && pot.data}
					isJustCreated={pot.data?.users.length === 1}
				/>
				<HowItWorksIntro label="homepage" enabled={userState.howItWorks} />
			</>

			<div style={{ maxWidth: '1100px', margin: '0 auto' }}>
				<div className="w-full flex flex-col-reverse xl:flex-row">
					<div
						id="walkthrough_potname"
						className="px-6 pt-4 pb-1 xl:w-10/12 md:pt-12"
					>
						<div className="text-2xl">Your Accountability Group</div>
						<div className="text-5xl font-semibold" style={{ lineHeight: 1.5 }}>
							{data?.pot.title}
							{potUser?.admin && (
								<span
									className="ml-2 cursor-pointer inline-block"
									onClick={() => setOpenGroupDetailModal(true)}
								>
									<svg className="w-6 h-6 fill-current">
										<use xlinkHref="/img/sprite.svg#icon-edit"></use>
									</svg>
								</span>
							)}
						</div>
						<ReactModal
							isOpen={openGroupDetailModal}
							onRequestClose={() => setOpenGroupDetailModal(false)}
							appElement={appElement}
							style={{
								content: {
									minWidth: 320,
									maxWidth: 600
								}
							}}
						>
							<GroupSettingsModal
								closeModal={() => setOpenGroupDetailModal(false)}
							/>
						</ReactModal>
						<div className="text-gray-400 text-xl">
							{potAdminUser?.firstName ? (
								<>{`Group Admin:  ${potAdminUser?.firstName}`}</>
							) : (
								<></>
							)}
						</div>
					</div>

					<div className="px-6 py-7 border-b border-gray-200 dark:border-gray-700 sm:px-0 md:py-1 xl:pt-12 xl:w-2/12 xl:border-b-0">
						<div
							className="font-poppins flex flex-col justify-between items-center xl:justify-center lg:justify-end"
							id="header_invite_holder_div"
						>
							<Header />
							<div className="text-center text-sm">
								<div className="text-gray-500 text-sm hidden md:block">
									{pot.data?.users.length} member
									{pot.data?.users.length !== 1 && 's'}
								</div>
								<div
									className="cursor-pointer text-sm py-3 px-6 rounded-2xl bg-gray-900 text-white md:mt-2 md:text-sm md:text-blue-600 md:p-0 md:bg-white dark:bg-gray-900"
									onClick={() => CopyInviteLink(data, setNotificationMessage)}
								>
									&mdash; copy invite link &mdash;
								</div>
								<a
									className="inline-block mt-4"
									target="_blank"
									href={
										AppEnv.apiBaseUrl +
										'/pdf/flyer1?link=' +
										encodeURIComponent(
											`${AppEnv.webBaseUrl}/pot/${data.pot.slug}`
										)
									}
								>
									Print QR Code
								</a>
								<div
									className="mt-4 text-gray-400 w-full absolute"
									style={{ width: '150px' }}
								>
									<div
										className="flex items-center justify-center cursor-pointer"
										onClick={() => {
											setViewRuleDropDown(!viewRuleDropDown)
										}}
									>
										View Rules
										<span className="inline-block pl-1">
											<svg
												style={{ width: '16px', height: '16px' }}
												className="fill-current"
											>
												<use href="/img/sprite.svg#icon-arrow-down-fat"></use>
											</svg>
										</span>
									</div>
									<div
										className={clsx(
											'border border-gray-400 p-1 mt-2 text-left',
											viewRuleDropDown ? 'block' : 'hidden'
										)}
										style={{ wordWrap: 'break-word' }}
									>
										<p
											className="mb-2 text-gray-800 font-bold cursor-pointer"
											onClick={() => setOpenReadyUpModal(true)}
										>
											Swear jar rules
										</p>
										{`Check in with photo proof (screenshot or take photo) you've
										completed "${data?.pot.title}" by Sunday at
										midnight or pay in swear jar fee of $${pot.data?.pot.minAmount} or more.`}
										<ReactModal
											isOpen={openReadyUpModal}
											onRequestClose={() => setOpenReadyUpModal(false)}
											appElement={appElement}
											style={{
												content: {
													minWidth: 320,
													maxWidth: 600
												}
											}}
										>
											<ProfileSettingModalInner
												closeModal={() => setOpenReadyUpModal(false)}
											/>
										</ReactModal>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col xl:flex-row px-6">
					<div className="w-full">
						<div
							className="pb-24 pt-24 flex flex-col items-center md:px-10"
							id="checkin_div"
						>
							<div
								id="walkthrough_checkins"
								className="text-center text-xl text-gray-600"
							>
								{checkinCountUser}/{data?.pot.checkinCount} check ins this week
							</div>
							<CheckInButton
								disabled={checkinCountUser >= data?.pot.checkinCount}
							></CheckInButton>
							<div className="mt-3 text-gray-400 text-sm">
								{`Take photo proof of ${data?.pot.title}, ${data?.pot.description}`}
								<br></br>
								by Sunday Midnight or pay your swear jar fee of ($
								{potUser?.amount})
							</div>
						</div>

						<div className="flex justify-end py-2">
							<div id="how_it_works_div">
								<button
									className="bg-white p-3 border rounded-md font-bold"
									onClick={() => userState.setHowItWorks(true)}
								>
									(i) How it works
								</button>
							</div>
						</div>

						<div id="walkthrough_pot" className="-card --shadow px-8 pb-8 pt-5">
							<div className="flex items-center text-xl font-bold justify-between">
								<div className="hidden md:flex items-center">
									Group Pot
									<hr
										style={{
											backgroundColor: '#242731',
											height: 4,
											width: 22,
											display: 'inline-block',
											margin: '0px 4px'
										}}
									/>
									{`${dayjs().format('MMMM')}`}
								</div>
								<div className="ml-auto mr-4 text-md font-thin">
									{readyUpCount} / {data?.users?.length}
								</div>
								<select
									className="px-5 py-4 w-full rounded-2xl text-base text-gray-500 outline-none border-gray-200 dark:bg-gray-900 dark:border-gray-900 md:w-44"
									style={{ borderWidth: '1px' }}
									value={potView}
									onChange={e => {
										setPotView(e.target.value)
									}}
								>
									<option value={'Total Pot'}>Total Pot</option>
									<option value={'Real Time'}>Real Time</option>
								</select>
							</div>

							<div className="md:grid grid-cols-3">
								<div>
									<div className="text-5xl font-bold my-1 md:text-7xl w-full">
										<div>
											<div className="py-5 pl-5">
												{potView === 'Total Pot' ? (
													<>${readyUpCount > 1 ? totalPotValue : '--.--'}</>
												) : (
													<>${data?.metrics.currentValue / 100}</>
												)}
											</div>
											<div className="mt-1 text-sm text-gray-500 text-left">
												<span className="text-green-500">
													{failedUsers} people
												</span>{' '}
												pay in at least ${pot.data?.pot.minAmount} at end of the
												week.
											</div>
										</div>

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
									<div className="py-2">
										<div
											className="flex items-center justify-start cursor-pointer text-xs font-bold"
											onClick={() => {
												setYouGetPaidDropDown(!youGetPaidDropDown)
											}}
										>
											You get paid for being part of this group.
											<span className="inline-block pl-1">
												<svg
													style={{ width: '16px', height: '16px' }}
													className="fill-current"
												>
													<use href="/img/sprite.svg#icon-arrow-down-fat"></use>
												</svg>
											</span>
										</div>
										<div
											className={clsx(
												'mt-2 text-left',
												youGetPaidDropDown ? 'block' : 'hidden'
											)}
											style={{ wordWrap: 'break-word' }}
										>
											<p className="mb-2 text-gray-800 font-bold cursor-pointer text-xs font-bold">
												When a member fails to complete their weekly check in by
												Sunday at midnight, they pay in to the group pot
											</p>
											<p className="mb-2 text-gray-800 font-bold cursor-pointer text-xs font-bold">
												This is paid to you at the end of the month. You get
												paid for improving yourself as long as you’re part of
												this group!
											</p>
										</div>
									</div>
									<div className="flex flex-row items-center md:flex">
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
											<span className="text-green-600">0%</span>
										</div>
									</div>
									<p className="mt-6">
										Check ins are 0% higher this month than average.
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
										<div className="has-tooltip ml-auto">
											<span className="tooltip rounded shadow-lg p-1 bg-gray-100 max-w-xs mt-6">
												This is the amount of times your group has checked in
												with photo evidence they've completed the weekly
												activity this month.
											</span>
											<span className="cursor-pointer">
												<img src="/img/question-mark.svg" width="10" />
											</span>
										</div>
									</div>
									<div className="text-3xl font-bold mt-3">
										{data?.metrics.checkinsCount}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-purple-500"
											style={{
												width: getCheckInProgress(
													data?.metrics.checkinsCount,
													'checkin'
												)
											}}
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
										<span>Group Streak 🔥</span>
										<div className="has-tooltip ml-auto">
											<span className="tooltip rounded shadow-lg p-1 bg-gray-100 max-w-xs mt-6">
												This is your groups streak. It increases every time all
												members in your group complete their check ins by Sunday
												at midnight.
											</span>
											<span className="cursor-pointer">
												<img src="/img/question-mark.svg" width="10" />
											</span>
										</div>
									</div>
									<div className="text-3xl font-bold mt-3">
										{data?.pot.streak}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-pink-400"
											style={{
												width: getCheckInProgress(data?.pot.streak, 'streak')
											}}
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
										<div className="has-tooltip ml-auto">
											<span className="tooltip rounded shadow-lg p-1 bg-gray-100 max-w-xs mt-6">
												This is the amount of times group members have paid in
												their swear jar fee to the group pot by failing to check
												in by Sunday at midnight.
											</span>
											<span className="cursor-pointer">
												<img src="/img/question-mark.svg" width="10" />
											</span>
										</div>
									</div>
									<div className="text-3xl font-bold mt-3">
										{data?.metrics.payinsCount}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-blue-500"
											style={{
												width: getCheckInProgress(
													data?.metrics.payinsCount,
													'payin'
												)
											}}
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
							<p className="mt-4">{`They have logged ${data?.pot.checkinCount} check-ins`}</p>
						</div>
					</div>
				</div>
			</div>
			{notificationMessage !== '' && (
				<Notification message={notificationMessage} info="copied" />
			)}
		</>
	)
})
