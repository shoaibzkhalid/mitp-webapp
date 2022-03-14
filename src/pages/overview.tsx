import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { ModalUserViewLogs } from '../components/modals/ModalUserViewLogs'
import { Square } from '../components/ui/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { formatDuration } from '../utils/formatDuration'
import { MobileHeader } from '../components/unique/MobileHeader'
import CopyInviteLink from '../components/notification/CopyInviteLink'
import Notification from '../components/notification'
import clsx from 'clsx'
import { toggleSideBar } from '../utils/common'
import { useTimer } from '../state/react/useTimer'
import { SpinnerBig } from '../components/SpinnerBig'
import { Button } from '../components/ui/Button'
import { useIsMobile } from '../state/react/useIsMobile'
import { CheckInButton } from '../components/CheckInButton'

export default wrapDashboardLayout(function RealIndexPage() {
	const router = useRouter()
	const [duration, setDuration] = useState<string>('')
	const [notificationMessage, setNotificationMessage] = useState<string>('')

	const isMobile = useIsMobile()
	const pot = useSelectedPot()

	const potUser = pot.data?.users.find(u => u.id === userState.user?.id)

	if (!pot.isLoading && pot.data === null) {
		router.push('/new')
		return null
	}

	if (!pot.data) {
		return <SpinnerBig />
	}

	useEffect(() => {
		toggleSideBar(false)
		userState.changeNotify(false)
	}, [])

	const checkinCountUser = useMemo(
		() =>
			pot.data?.users.find(u => u.id === userState.user?.id)
				?.checkinsThisWeek || 0,
		[pot.data]
	)

	useTimer(() => {
		const timeUntilWeekEnd = formatDuration(
			Math.floor(dayjs().endOf('week').diff() / 1000)
		)
		setDuration(timeUntilWeekEnd)
	}, 1000)

	const day = dayjs().get('day')

	const [viewingLogsOfUserId, setViewingLogsOfUserId] = useState(
		null as string | null
	)
	const [viewingLogsMode, setViewingLogsMode] = useState('')

	const users =
		pot.data?.users.sort((u1, u2) => {
			if (u1.lastCheckinAt === null && u2.lastCheckinAt === null) return 0
			if (u1.lastCheckinAt === null) return 1
			if (u2.lastCheckinAt === null) return -1
			return +new Date(u2.lastCheckinAt) - +new Date(u1.lastCheckinAt)
		}) ?? []

	let readyUpCount = 0
	pot.data?.users.map(user =>
		user.readyUpAt ? (readyUpCount += 1) : (readyUpCount += 0)
	)

	return (
		<>
			<Head>
				<title>{`Your Group - ${pot.data?.pot.title || 'Loading...'}`}</title>
			</Head>

			<div style={{ margin: '0 auto', maxWidth: '1200px' }}>
				{viewingLogsOfUserId && pot.data && (
					<ModalUserViewLogs
						isOpen={viewingLogsOfUserId !== null}
						onRequestClose={() => setViewingLogsOfUserId(null)}
						userId={viewingLogsOfUserId}
						potId={pot.data.pot.id}
						viewingLogsMode={viewingLogsMode}
					></ModalUserViewLogs>
				)}

				<div className="w-full px-6 py-2 border-b border-gray-200 md:py-4 dark:border-gray-700 sm:px-0 xl:pt-12 xl:border-b-0">
					<div
						className="flex items-center justify-between font-poppins  px-6"
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
								onClick={() => CopyInviteLink(pot.data, setNotificationMessage)}
							>
								&mdash; copy invite link &mdash;
							</div>
						</div>
					</div>
				</div>

				<div className="w-full px-6 mt-10">
					<div className="flex flex-col justify-between pt-8 pb-6 text-white overview-containers bg-primary rounded-3xl px-14 md:flex-row">
						<div className="flex flex-col mb-8 text-center md:text-left md:mb-0">
							<div className="text-3xl font-bold md:text-4xl lg:text-2xl xl:text-4xl">
								Check ins due in...
							</div>
							<div className="flex mt-3 text-md sm:mt-1 md:text-xl font-poppins">
								<img src="/img/clock.svg" width={28} className="mr-2" />
								{duration}
							</div>
							<CheckInButton
								disabled={checkinCountUser >= pot.data?.pot.checkinCount}
								kind="tertiary"
								camera="black"
							></CheckInButton>
							<div className="pt-10 mt-auto text-xs font-thin tracking-widest font-poppins">
								Those who don't check in by Sunday at midnight pay the group pot
								their swear jar fee.
							</div>
						</div>

						<div className="flex flex-col items-center justify-between">
							<div className="p-2 border-2 border-gray-400 border-dashed rounded-lg xl:p-4">
								{/* prob */}
								<div className="flex days-holder">
									{[
										[1, 'Mo'],
										[2, 'Tu'],
										[3, 'We'],
										[4, 'Th'],
										[5, 'Fr'],
										[6, 'Sa'],
										[7, 'Su']
									].map(e => (
										<div
											className={clsx(
												'mx-2 lg:mx-1 xl:mx-2 flex items-center justify-center h-10 w-8 md:w-10',
												e[0] === day
													? 'border-2 border-red-400 rounded-full'
													: undefined
											)}
										>
											{e[1]}
										</div>
									))}
								</div>
								{/* prob */}
								<div className="mt-6 text-sm text-center text-gray-200">
									Check in by Sunday {potUser?.checkinsThisWeek}/
									{pot?.data.pot.checkinCount}
								</div>
							</div>
							<div className="flex items-center justify-end w-full mt-10 font-bold text-center md:mt:0 md:text-right">
								<img src="/img/member-icon.svg" className="mr-1" width={22} />
								{/* {pot.data?.users.length} Members */}
								<div className="mr-4 font-thin text-md">
									{readyUpCount} / {pot.data?.users?.length} Ready
								</div>
							</div>
						</div>
					</div>

					<div className="p-4 mt-6 -card --shadow">
						{!pot.data ? (
							<div className="flex items-center justify-center"></div>
						) : isMobile ? (
							<div className="relative">
								{/* Header */}
								<div className="flex justify-between my-4">
									<div className="text-sm font-thin text-gray-400 font-poppins">
										Check - In
									</div>
								</div>

								<hr className="absolute w-full border-gray-200 -left-4 dark:border-gray-700" />
								<hr className="absolute w-full border-gray-200 -right-4 dark:border-gray-700" />

								{/* Users */}
								<div className="my-4"></div>
								{users.map(u => {
									return (
										<>
											<div className="mb-4">
												<div className="flex items-center justify-between py-4">
													<div className="flex items-center">
														<div>
															<img
																src={
																	u.avatarUri ? u.avatarUri : '/img/avatar.png'
																}
																style={{
																	minHeight: 50,
																	minWidth: 50,
																	maxHeight: 70,
																	maxWidth: 70,
																	borderRadius: '10px'
																}}
															/>
														</div>
														<div className="ml-6">{u.firstName}</div>
													</div>
													<div className="flex cursor-pointer">
														<Button
															className="text-xs sm:text-base"
															onClick={() => {
																setViewingLogsOfUserId(u.id)
																setViewingLogsMode('week')
															}}
															size="sm"
														>
															View
														</Button>
														{/* <Button
															className="ml-4 text-xs sm:text-base"
															onClick={() => {
																setViewingLogsOfUserId(u.id)
																setViewingLogsMode('all')
															}}
															size="sm"
														>
															View All
														</Button> */}
													</div>
												</div>
												<div className="items-center flex p-2 text-xs border border-gray-200 rounded-lg sm:text-sm justify-evenly dark:border-gray-700">
													<div className="font-thin text-gray-400 font-poppins">
														{u.checkinsThisWeek ? 'Thu, 7:22 PM' : '--/--/--'}
													</div>
													{u.checkinsThisWeek >= pot.data.pot.checkinCount ? (
														<div className="flex flex-row items-center text-green-500">
															<Square
																className="mr-2 bg-green-500"
																length="1.2rem"
															></Square>
															Completed
														</div>
													) : (
														<div className="flex flex-row items-center text-red-500">
															<Square
																className="mr-2 bg-red-500"
																length="1.2rem"
															></Square>
															Not yet
														</div>
													)}
													<div className="text-flowerblue">
														{userState.ready ? (
															`$${parseInt(u.amount).toFixed(2)}`
														) : (
															<>Not ready yet</>
														)}
													</div>
												</div>
											</div>

											<hr className="absolute w-full border-gray-200 -left-4 dark:border-gray-700" />
											<hr className="absolute w-full border-gray-200 -right-4 dark:border-gray-700" />
										</>
									)
								})}
							</div>
						) : (
							<div className="-table-responsive">
								<table className="-table">
									<thead className="text-left">
										<tr className="text-gray-400">
											<th></th>
											<th></th>
											<th className="font-thin">Done</th>
											<th className="font-thin">Check - In</th>
											<th className="font-thin">Swear jar fee</th>
											<th className="font-thin">Photo Proofs</th>
										</tr>
									</thead>
									<tbody>
										{pot.data.users.map(u => {
											return (
												<>
													<tr className="border-b-2">
														<td
															style={{
																paddingRight: 0
															}}
														>
															<img
																src={
																	u.avatarUri ? u.avatarUri : '/img/avatar.png'
																}
																style={{
																	height: 110,
																	width: 110,
																	borderRadius: '10px'
																}}
															/>
														</td>
														<td
															style={{
																paddingLeft: 0
															}}
														>
															<div className="flex flex-row items-center font-bold">
																<span style={{ marginLeft: 20 }}>
																	{userState.notify_users.includes(u.id) && (
																		<div className="w-2 h-2 bg-red-600"></div>
																	)}
																	{u.firstName}
																</span>
															</div>
														</td>
														<td>
															{u.checkinsThisWeek ? 'Thursday, 7:22 PM' : ''}
														</td>
														<td>
															{u.checkinsThisWeek >=
															pot.data.pot.checkinCount ? (
																<>
																	<div className="relative">
																		<div className="flex flex-row items-center text-green-500">
																			<Square
																				className="mr-2 bg-green-500"
																				length="1.2rem"
																			></Square>
																			Completed
																		</div>
																		<div
																			className="absolute flex justify-center font-thin text-gray-400"
																			style={{ left: '45%' }}
																		>
																			{u.checkinsThisWeek}/
																			{pot.data.pot.checkinCount}
																		</div>
																	</div>
																</>
															) : (
																<>
																	<div className="relative">
																		<div className="flex flex-row items-center text-red-500">
																			<Square
																				className="mr-2 bg-red-500"
																				length="1.2rem"
																			></Square>
																			Not yet
																		</div>
																		<div
																			className="absolute flex justify-center font-thin text-gray-400"
																			style={{ left: '30%' }}
																		>
																			{u.checkinsThisWeek}/
																			{pot.data.pot.checkinCount}
																		</div>
																	</div>
																</>
															)}
														</td>
														<td className="font-thin font-poppins text-primary">
															{u.readyUpAt !== null ? (
																`$${parseInt(u.amount).toFixed(2)}`
															) : (
																<>Not ready yet</>
															)}
														</td>
														<td>
															<div className="flex">
																<Button
																	onClick={() => {
																		setViewingLogsOfUserId(u.id)
																		setViewingLogsMode('week')
																		userState.removeNotifyUser(u.id)
																	}}
																>
																	View
																</Button>
																{/* <Button
																	className="ml-4"
																	onClick={() => {
																		setViewingLogsOfUserId(u.id)
																		setViewingLogsMode('all')
																		userState.removeNotifyUser(u.id)
																	}}
																>
																	View All
																</Button> */}
															</div>
														</td>
													</tr>
												</>
											)
										})}
										{pot.data.users.length < 2 ? (
											<>
												<tr>
													<td>
														<div
															className="p-5 border-2 border-dashed rounded-lg border-primary"
															style={{
																maxWidth: 110,
																maxHeight: 100
															}}
														>
															<img
																className=""
																src="/img/add-friend-icon.svg"
																style={{
																	minHeight: 60,
																	minWidth: 60
																}}
															/>
														</div>
													</td>
													<td
														style={{
															paddingLeft: 0
														}}
													>
														<div className="flex flex-row items-center font-bold">
															<span
																style={{ marginLeft: 20 }}
																className="font-thin text-primary font-poppins"
															>
																Invite Friend
															</span>
														</div>
													</td>
												</tr>
											</>
										) : (
											<></>
										)}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{pot.data?.users.length < 2 ? (
						<>
							<div className="flex flex-col items-center justify-center py-10">
								<img src="/img/weekly-overview-social-icon.svg" />
								<span className="mt-10 text-gray-400">
									Friends you invite to this session will be shown here
								</span>
								<Button
									className="mt-5"
									onClick={() => {
										CopyInviteLink(pot.data, setNotificationMessage)
									}}
								>
									Copy Invite Link
								</Button>
							</div>
						</>
					) : (
						<></>
					)}
				</div>
			</div>
			{notificationMessage !== '' && (
				<Notification message={notificationMessage} info="copied" />
			)}
		</>
	)
})
