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
import Notification from '../components/notification'
import dayjs from 'dayjs'
import { SidebarContext } from '../state/contexts/sidebarContext'
import { toggleSideBar, getCheckInProgress } from '../utils/common'
import ReactModal from 'react-modal'
import { useNextAppElement } from '../state/react/useNextAppElement'
import { CheckInPhotoModalInner } from './../components/modals/CheckInPhotoModalInner'
import { CheckInSuccessModalInner } from '../components/modals/CheckInSuccessModalInner'
import { Intro } from '../components/Intro'
import { Header } from '../components/unique/Header'
import CopyInviteLink from '../components/notification/CopyInviteLink'

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

	const [photoModalIsOpen, setPhotoModalIsOpen] = useState(false)
	const [sucessModalIsOpen, setSucessModalIsOpen] = useState(false)

	const appElement = useNextAppElement()

	if (!isLoading && data === null) {
		router.push('/create')
	}

	if (!data) {
		return <SpinnerBig />
	}

	useEffect(() => {
		const users = data.users.length
		const completedUsers = data.users.filter(
			u =>
				u.checkinsThisWeek === data.metrics.checkinsCount &&
				u.checkinsThisWeek !== 0
		).length
		const payinUsers = data.users.filter(
			u =>
				u.checkinsThisWeek < data.metrics.checkinsCount &&
				u.checkinsThisWeek !== 0
		).length
		const unCompletedUsers = data.users.filter(
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
			data.users.find(u => u.id === userState.user?.id)?.checkinsThisWeek || 0,
		[data]
	)

	const date1 = dayjs(data.pot.createdAt).format('YYYY-MM-DD')
	const date2 = dayjs()
	const diff = date2.diff(date1)
	const createdDuration = dayjs.duration(diff)

	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	function getIntroSteps() {
		// One user === the pot was created. More users === the user joined a pot
		if (pot.data!.users.length === 1)
			return [
				{
					element: document.getElementById('walkthrough_potname'),
					title: 'Welcome to your new group!',
					intro:
						'This is the activity of your group your members do to complete their check ins with the rest of the group. You can change your group activity or add details to it like time, location, or specific requirements (IE; Types of Exercises Allowed) later.'
				},
				{
					element: document.getElementById('walkthrough_checkins'),
					intro: `Users must tap the “check in” button on mobile or desktop and upload photo proof they’ve completed the group activity successfully before the week is over.`
				},
				{
					element: document.getElementById('walkthrough_pot'),
					title: 'This is your group’s pot.',
					intro: `Members of your group who fail their check-in before the week is up pay in to the pot. Note: You set the minimum pay-in for your group, and can always set the value to zero, so group members are able to set their own.`
				},
				{
					intro: `We recommend you take a minute to finish setup, but you can also invite friends or explore. This is your group, and you’re at the helm. Tap "tutorial" at anytime if you want to see this walkthrough again.`
				}
			]
		else
			return [
				{
					element: document.getElementById('walkthrough_checkins'),
					title: 'Welcome to the group!',
					intro:
						'Users must tap the “check in” button on mobile or desktop and upload photo proof they’ve completed the group activity successfully before the week is over. The group activity can be seen at the top of the homepage.'
				},
				{
					element: document.getElementById('walkthrough_pot'),
					intro: `This is your group’s pot. Members of your group who fail their check-in before the week is up pay in to the pot. You get paid at the end of the month based on how big the pot is.`
				},
				{
					intro: `Review & agree to this groups rules when you're ready to join it. Tap "tutorial" at anytime if you want to see this walkthrough again.`
				}
			]
	}

	return (
		<>
			<Head>
				<title>{`Your Group - ${data?.pot.title}`}</title>
			</Head>
			<Intro
				label="homepage"
				enabled={userState.loaded && pot.data}
				steps={getIntroSteps}
			/>
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				<div className="w-full flex flex-col flex-col-reverse xl:flex-row">
					<div
						id="walkthrough_potname"
						className="px-10 pt-4 pb-1 xl:w-8/12 xl:px-12 md:px-8 md:pt-12"
					>
						<div className="text-3xl font-medium">The Group Pot Of</div>
						<div className="text-6xl font-semibold" style={{ lineHeight: 1.5 }}>
							{data.pot.title}
						</div>
						<div className="text-gray-400 text-xl">{`Group Admin:  ${userState.user?.firstName}`}</div>
					</div>

					<div className="pl-8 pr-4 py-7 border-b border-gray-200 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-b-0">
						<div className="font-poppins flex justify-between items-center xl:justify-center lg:justify-end">
							<Header />
							<div className="text-center text-lg">
								<div className="text-gray-500 text-base hidden md:block">
									{pot.data?.users.length} member
									{pot.data?.users.length !== 1 && 's'}
								</div>
								<div
									className="cursor-pointer text-sm py-3 px-6 rounded-2xl bg-gray-900 text-white md:mt-2 md:text-lg md:text-blue-600 md:p-0 md:bg-white dark:bg-gray-900"
									onClick={() => CopyInviteLink(data, setNotificationMessage)}
								>
									&mdash; copy invite link &mdash;
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col xl:flex-row">
					<div className="px-10 w-full xl:px-12 md:px-8">
						<div className="pb-24 pt-24 flex flex-col items-center md:px-10">
							<div
								id="walkthrough_checkins"
								className="text-center text-xl text-gray-600"
							>
								{checkinCountUser}/{data.pot.checkinCount} check ins this week
							</div>
							<CheckInButton
								disabled={checkinCountUser >= data.pot.checkinCount}
								setPhotoModalIsOpen={(isOpen: boolean) =>
									setPhotoModalIsOpen(isOpen)
								}
							></CheckInButton>
							<div className="mt-3 text-gray-400 text-sm">{`Take photo proof of ${data.pot.title}, ${data.pot.description}.`}</div>
							<ReactModal
								isOpen={photoModalIsOpen}
								onRequestClose={() => setPhotoModalIsOpen(false)}
								appElement={appElement}
								style={{
									content: {
										height: '50%',
										top: '20%'
									}
								}}
							>
								<CheckInPhotoModalInner
									closeModal={() => setPhotoModalIsOpen(false)}
									potId={selectedPotState.moneyPotId}
									openSuccessModal={() => {
										setSucessModalIsOpen(true)
									}}
								></CheckInPhotoModalInner>
							</ReactModal>
							<ReactModal
								isOpen={sucessModalIsOpen}
								onRequestClose={() => setSucessModalIsOpen(false)}
								appElement={appElement}
								style={{
									content: {
										height: '70%',
										top: '10%'
									}
								}}
							>
								<CheckInSuccessModalInner
									closeModal={() => setSucessModalIsOpen(false)}
									openSuccessModal={() => {
										setSucessModalIsOpen(false)
									}}
								></CheckInSuccessModalInner>
							</ReactModal>
						</div>

						<div id="walkthrough_pot" className="-card --shadow px-8 pb-8 pt-5">
							<div className="flex items-center text-xl font-bold justify-between">
								<div className="hidden md:block">{`Group pot of ${dayjs().format(
									'MMMM'
								)}`}</div>
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
										<div className="">${data.metrics.currentValue}</div>

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
									<div>
										<div className="font-bold text-xs">
											You get paid for being part of this group.
										</div>
										<div className="text-xs">
											<p className="mt-0">
												When a member fails to complete their weekly check in by
												Sunday at midnight, they pay in to the group pot
											</p>
											<p className="mt-4">
												This is paid to you at the end of the month. You get
												paid for improving yourself as long as you’re part of
												this group!
											</p>
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
											: '3'}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-purple-500"
											style={{
												width: getCheckInProgress(3, 'checkin')
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
										<span>Weekly 🔥</span>
									</div>
									<div className="text-3xl font-bold mt-3">
										{data.metrics.checkinsCount !== 0
											? data.metrics.currentValue
											: '10'}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-pink-400"
											style={{
												width: getCheckInProgress(10, 'streak')
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
									</div>
									<div className="text-3xl font-bold mt-3">
										{data.metrics.payinsCount !== 0
											? data.metrics.payinsCount
											: '50'}
									</div>
									<div
										className="relative bg-gray-200 mt-3"
										style={{ borderRadius: '1px', height: '2px' }}
									>
										<div
											className="absolute top-0 left-0 bottom-0 bg-blue-500"
											style={{
												width: getCheckInProgress(50, 'payin')
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
							<p className="mt-4">{`They have logged ${data.pot.checkinCount} check-ins`}</p>
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
