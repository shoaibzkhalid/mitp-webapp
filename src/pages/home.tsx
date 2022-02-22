import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { CheckInButton } from '../components/CheckInButton'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import dynamic from 'next/dynamic'
import Notification from '../components/notification'
import dayjs from 'dayjs'
import { getCheckInProgress, getPotPosterUrl } from '../utils/common'
import { Intro } from '../components/intros/Intro'
import { HowItWorksIntro } from '../components/intros/HowItWorksIntro'
import { MobileHeader } from '../components/unique/MobileHeader'
import CopyInviteLink from '../components/notification/CopyInviteLink'
import { toggleSideBar } from '../utils/common'
import { ModalGroupSettings } from '../components/modals/ModalGroupSettings'
import { ModalProfileSetting } from '../components/modals/ModalProfileSetting'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { useIsMobile } from '../state/react/useIsMobile'

const PotChart = dynamic(() => import('../components/home/PotChart'), {
	ssr: false
})

const CheckinUpdateChart = dynamic(
	() => import('../components/home/CheckinUpdateChart'),
	{ ssr: false }
)

export default wrapDashboardLayout(function OverviewPage() {
	const [notificationMessage, setNotificationMessage] = useState<string>('')

	const router = useRouter()
	const { isLoading, data } = useSelectedPot()
	const pot = useSelectedPot()
	const [openGroupDetailModal, setOpenGroupDetailModal] = useState(false)
	const [viewRuleDropDown, setViewRuleDropDown] = useState(false)
	const [youGetPaidDropDown, setYouGetPaidDropDown] = useState(false)

	if (!isLoading && data === null) {
		router.push('/new')
	}

	// const totalPotValue = data?.users?.reduce(
	// 	(prev, curr) => prev + parseInt(curr.amount) * 4,
	// 	0
	// )

	const readyUpCount = data?.users.filter(u => u.readyUpAt).length

	useEffect(() => {
		toggleSideBar(false)
	}, [])

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

	const createdDuration = dayjs.duration(
		dayjs().diff(dayjs(data?.pot.createdAt))
	)

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

			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				<div className="flex flex-col-reverse w-full xl:flex-row">
					<div
						id="walkthrough_potname"
						className="w-full px-6 pt-4 pb-1 md:pt-12"
					>
						<div className="flex items-center">
							<div className="text-2xl">Your Accountability Group</div>
							{/* <div className="hidden ml-auto lg:block">
								<ButtonSharePot />
							</div> */}
						</div>
						<div
							className="text-4xl font-semibold sm:text-5xl xl:w-10/12 text-"
							style={{ lineHeight: 1.5 }}
						>
							{data?.pot.title}
							{potUser?.admin && (
								<span
									className="inline-block ml-2 cursor-pointer"
									onClick={() => setOpenGroupDetailModal(true)}
								>
									<svg className="w-6 h-6 fill-current">
										<use xlinkHref="/img/sprite.svg#icon-edit"></use>
									</svg>
								</span>
							)}
						</div>
						<ModalGroupSettings
							isOpen={openGroupDetailModal}
							onRequestClose={() => setOpenGroupDetailModal(false)}
							style={{
								content: {
									minWidth: 320,
									maxWidth: 600
								}
							}}
						/>
						<div className="absolute flex text-xl text-gray-400">
							{potAdminUser?.firstName ? (
								<>{`Group Admin:  ${potAdminUser?.firstName}`}</>
							) : (
								<></>
							)}
							{/* <div
								className="w-full ml-4 text-gray-400"
								style={{
									width: isMobile ? undefined : '280px'
								}}
							>
								<div
									className="flex items-center justify-center cursor-pointer text-md sm:text-lg md:text-xl"
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
										'border border-gray-400 p-1 mt-2 text-left bg-white dark:bg-dark',
										viewRuleDropDown ? 'block' : 'hidden'
									)}
									style={{ wordWrap: 'break-word' }}
								>
									<p
										className="mb-2 font-bold text-gray-800 cursor-pointer dark:text-white"
										onClick={() => setOpenReadyUpModal(true)}
									>
										Swear jar rules
									</p>
									{`Check in with photo proof (screenshot or take photo) you've
										completed "${data?.pot.title}" by Sunday at
										midnight or pay in swear jar fee of $${pot.data?.pot.minAmount} or more.`}
									<ModalProfileSetting
										isOpen={openReadyUpModal}
										onRequestClose={() => setOpenReadyUpModal(false)}
										style={{
											content: {
												minWidth: 320,
												maxWidth: 600
											}
										}}
									/>
								</div>
							</div> */}
						</div>
					</div>

					<div className="px-6 py-2 border-b border-gray-200 md:py-4 dark:border-gray-700 sm:px-0 xl:pt-12 xl:w-2/12 xl:border-b-0">
						<div
							className="flex items-center justify-between font-poppins xl:justify-center lg:justify-end"
							id="header_invite_holder_div"
						>
							<MobileHeader />
							<div className="text-sm text-center">
								<div className="hidden text-base text-gray-500 md:block">
									{pot.data?.users.length} member
									{pot.data?.users.length !== 1 && 's'}
								</div>
								<div
									className="px-6 py-3 text-sm text-white bg-gray-900 cursor-pointer rounded-2xl md:mt-2 md:text-base md:text-blue-600 md:p-0 md:bg-white dark:bg-gray-900"
									onClick={() => CopyInviteLink(data, setNotificationMessage)}
								>
									&mdash; copy invite link &mdash;
								</div>
								<a
									className="inline-block mt-4"
									target="_blank"
									href={data?.pot ? getPotPosterUrl(data?.pot) : ''}
								>
									Print QR Code
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col w-full px-6 xl:flex-row">
					<div className="w-full">
						<div
							className="flex flex-col items-center pt-24 pb-24 md:px-10"
							id="checkin_div"
						>
							<div
								id="walkthrough_checkins"
								className="text-xl text-center text-gray-600"
							>
								{checkinCountUser}/{data?.pot.checkinCount} check ins this week
							</div>
							<CheckInButton
								disabled={checkinCountUser >= data?.pot.checkinCount}
							></CheckInButton>
							<div className="mt-3 text-sm text-gray-400">
								{`Take photo proof of ${data?.pot.title}, ${data?.pot.description}`}
								<br></br>
								by Sunday Midnight or pay your swear jar fee of ($
								{potUser?.amount})
							</div>
						</div>

						<div className="flex justify-end py-2">
							<div id="how_it_works_div">
								<Button
									kind="secondary"
									onClick={() => userState.setHowItWorks(true)}
								>
									How it works
								</Button>
							</div>
						</div>

						<div id="walkthrough_pot" className="px-8 pt-5 pb-8 -card --shadow">
							<div className="flex items-center justify-between text-xl font-bold">
								<div className="items-center hidden md:flex">
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

								<div className="ml-auto mr-4 font-thin text-md">
									<div className="ml-auto has-tooltip">
										<span className="max-w-xs p-1 mt-6 text-sm bg-gray-100 rounded shadow-lg tooltip">
											{readyUpCount < 2
												? 'At least 2 members need to ready up to begin this session.'
												: `${readyUpCount}/${pot?.data?.users?.length} members have ready'd up. Session has started.`}
										</span>
										<span className="cursor-pointer">
											{`${readyUpCount} / ${data?.users?.length} Ready`}
										</span>
									</div>
								</div>
							</div>

							{/* Check here */}
							<div className="grid-cols-3 md:grid">
								<div>
									<div className="w-full my-1 text-5xl font-bold md:text-7xl">
										<div>
											<div className="py-5 pl-5">
												$
												{readyUpCount > 1
													? data?.metrics.currentValue / 100
													: '--.--'}
											</div>
											<div className="mt-1 text-sm text-left text-gray-500">
												<span className="text-green-500">
													{failedUsers} people
												</span>{' '}
												pay in at least ${pot.data?.pot.minAmount} at end of the
												week.
											</div>
										</div>

										<div className="flex items-center mt-3 ml-3 text-sm text-primary md:hidden">
											<div className="h-10 pr-3">
												<CheckinUpdateChart />
											</div>
											<div className="flex items-center">
												<div
													className="flex items-center justify-center w-5 h-5 mr-1 bg-green-600"
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
											className="flex items-center justify-start text-xs font-bold cursor-pointer"
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
											<p className="mb-2 text-xs font-bold text-gray-800 cursor-pointer">
												When a member fails to complete their weekly check in by
												Sunday at midnight, they pay in to the group pot
											</p>
											<p className="mb-2 text-xs font-bold text-gray-800 cursor-pointer">
												This is paid to you at the end of the month. You get
												paid for improving yourself as long as you're part of
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
												className="flex items-center justify-center w-5 h-5 mr-1 bg-green-600"
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

							<div className="flex flex-col mt-8 -hstack md:flex-row">
								<div className="relative p-6 border-b">
									<div className="flex text-sm">
										<div className="flex items-center justify-center w-5 h-5 mr-1 bg-purple-500 rounded-md">
											<img
												className="block"
												style={{ maxWidth: '8px' }}
												src="./img/folder.svg"
											></img>
										</div>
										<span>Check Ins</span>
										<div className="ml-auto has-tooltip">
											<span
												className="max-w-xs p-1 mt-6 bg-gray-100 rounded shadow-lg tooltip"
												style={{ right: 0 }}
											>
												This is the amount of times your group has checked in
												with photo evidence they've completed the weekly
												activity this month.
											</span>
											<span className="cursor-pointer">
												<img src="/img/question-mark.svg" width="10" />
											</span>
										</div>
									</div>
									<div className="mt-3 text-3xl font-bold">
										{data?.metrics.checkinsCount}
									</div>
									<div
										className="relative mt-3 bg-gray-200"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 bottom-0 left-0 bg-purple-500"
											style={{
												width: getCheckInProgress(
													data?.metrics.checkinsCount,
													'checkin'
												)
											}}
										></div>
									</div>
								</div>
								<div className="relative p-6 border-0 border-b md:border-l">
									<div className="flex text-sm">
										<div className="flex items-center justify-center w-5 h-5 mr-1 bg-pink-400 rounded-md">
											<img
												className="block"
												style={{ maxWidth: '8px' }}
												src="./img/activity.svg"
											></img>
										</div>
										<span>Group Streak 🔥</span>
										<div className="ml-auto has-tooltip">
											<span
												className="max-w-xs p-1 mt-6 bg-gray-100 rounded shadow-lg tooltip"
												style={{ right: 0 }}
											>
												This is your groups streak. It increases every time all
												members in your group complete their check ins by Sunday
												at midnight.
											</span>
											<span className="cursor-pointer">
												<img src="/img/question-mark.svg" width="10" />
											</span>
										</div>
									</div>
									<div className="mt-3 text-3xl font-bold">
										{data?.pot.streak}
									</div>
									<div
										className="relative mt-3 bg-gray-200"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 bottom-0 left-0 bg-pink-400"
											style={{
												width: getCheckInProgress(data?.pot.streak, 'streak')
											}}
										></div>
									</div>
								</div>
								<div className="relative p-6 border-0 md:border-l">
									<div className="flex text-sm">
										<div className="flex items-center justify-center w-5 h-5 mr-1 bg-blue-500 rounded-md">
											<img
												className="block"
												style={{ maxWidth: '8px' }}
												src="./img/bag.svg"
											></img>
										</div>
										<span>Pay Ins</span>
										<div className="ml-auto has-tooltip">
											<span
												className="max-w-xs p-1 mt-6 bg-gray-100 rounded shadow-lg tooltip"
												style={{ right: 0 }}
											>
												This is the amount of times group members have paid in
												their swear jar fee to the group pot by failing to check
												in by Sunday at midnight.
											</span>
											<span className="cursor-pointer">
												<img src="/img/question-mark.svg" width="10" />
											</span>
										</div>
									</div>
									<div className="mt-3 text-3xl font-bold">
										{data?.metrics.payinsCount}
									</div>
									<div
										className="relative mt-3 bg-gray-200"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 bottom-0 left-0 bg-blue-500"
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
						<div className="pt-24 pb-8 text-sm text-center">
							<p>
								This group has been around for{' '}
								<span className="font-bold">{`${createdDuration.months()} months`}</span>{' '}
								and{' '}
								<span className="font-bold">{`${dayjs().diff(
									dayjs(data?.pot.createdAt),
									'day'
								)} days`}</span>
							</p>
							<p className="mt-4">{`They have logged ${data?.metrics.checkinsCount} check-ins`}</p>
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
