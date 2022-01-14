import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { UserViewLogsModalInner } from '../components/modals/UserViewLogsModalInner'
import { Square } from '../components/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { useNextAppElement } from '../state/react/useNextAppElement'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { formatDuration } from '../utils/formatDuration'
import { Header } from '../components/unique/Header'
import CopyInviteLink from '../components/notification/CopyInviteLink'
import Notification from '../components/notification'
import { useMediaQuery } from '../state/react/useMediaQuery'
import clsx from 'clsx'
import { toggleSideBar } from '../utils/common'
import { useTimer } from '../state/react/useTimer'

export default wrapDashboardLayout(function RealIndexPage() {
	const router = useRouter()
	const [duration, setDuration] = useState<string>('')
	const [notificationMessage, setNotificationMessage] = useState<string>('')

	const isMobile = useMediaQuery('(max-width: 768px)')
	const pot = useSelectedPot()
	const potUser = pot.data?.users.find(u => u.id === userState.user?.id)
	console.log(potUser)

	if (!pot.isLoading && pot.data === null) {
		router.push('/new')
		return null
	}

	useEffect(() => {
		toggleSideBar(false)
	}, [])

	useTimer(() => {
		const timeUntilWeekEnd = formatDuration(
			Math.floor(dayjs().endOf('week').diff() / 1000)
		)
		setDuration(timeUntilWeekEnd)
	}, 1000)

	const day = dayjs().get('day')

	const appElement = useNextAppElement()
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
	pot.data.users.map(user =>
		user.readyUpAt ? (readyUpCount += 1) : (readyUpCount += 0)
	)

	return (
		<>
			<Head>
				<title>{`Your Group - ${pot.data?.pot.title || 'Loading...'}`}</title>
			</Head>

			<div style={{ margin: '0 auto', maxWidth: '1100px' }}>
				<ReactModal
					isOpen={viewingLogsOfUserId !== null}
					onRequestClose={() => setViewingLogsOfUserId(null)}
					appElement={appElement}
				>
					{viewingLogsOfUserId && pot.data && (
						<UserViewLogsModalInner
							closeModal={() => setViewingLogsOfUserId(null)}
							userId={viewingLogsOfUserId}
							potId={pot.data.pot.id}
							viewingLogsMode={viewingLogsMode}
							openSuccessModal={() => console.log()}
						></UserViewLogsModalInner>
					)}
				</ReactModal>

				<div className="w-full flex flex-col xl:flex-row">
					<div className="font-poppins pt-4 pb-1 xl:w-8/12 md:pt-12 px-6">
						<div className="text-2xl mb-3">{pot.data?.pot.title}</div>
						<div className="text-5xl font-semibold">
							{pot.data?.users.length} member
							{pot.data?.users.length !== 1 && 's'}
						</div>
					</div>
					<div className="xl:m-auto pl-8 pr-4 py-7 border-b border-gray-200 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-b-0">
						<div className="lg:p-3 font-poppins flex justify-between items-center xl:justify-center lg:justify-end">
							<Header />
							<div className="text-center text-lg">
								<div
									className="cursor-pointer text-sm py-3 px-6 rounded-2xl bg-gray-900 text-white md:mt-2 md:text-xl md:text-blue-600 md:p-0 md:bg-white dark:bg-gray-900"
									onClick={() =>
										CopyInviteLink(pot.data, setNotificationMessage)
									}
								>
									&mdash; copy invite link &mdash;
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full mt-10 px-6">
					<div className="overview-containers bg-primary rounded-3xl px-14 pt-8 pb-6 text-white flex flex-col md:flex-row justify-between">
						<div className="text-center md:text-left mb-8 md:mb-0 flex flex-col">
							<div className="text-3xl md:text-4xl lg:text-2xl xl:text-4xl font-bold">
								Check ins due in...
							</div>
							<div className="mt-3 sm:mt-1 text-sm md:text-lg font-poppins">
								{duration}
							</div>
							<div className="mt-auto pt-10 text-xs font-poppins font-thin tracking-widest">
								Those who don't check in by Sunday at midnight pay the group pot
								their swear jar fee.
							</div>
						</div>

						<div className="flex flex-col items-center justify-between">
							<div className="border-2 border-dashed border-gray-400 rounded-lg p-2 xl:p-4">
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
												'mx-2 lg:mx-1 xl:mx-2 flex items-center justify-center h-10 w-10',
												e[0] === day
													? 'border-2 border-red-400 rounded-full'
													: undefined
											)}
										>
											{e[1]}
										</div>
									))}
								</div>
								<div className="mt-6 text-sm text-gray-200 text-center">
									Check in by Sunday {potUser?.checkinsThisWeek}/1
								</div>
							</div>
							<div className="font-bold w-full mt-10 md:mt:0 text-center md:text-right flex items-center justify-end">
								<img src="/img/member-icon.svg" className="mr-1" />
								{/* {pot.data?.users.length} Members */}
								<div className="mr-4 text-md font-thin">
									{readyUpCount} / {pot.data?.users?.length}
								</div>
							</div>
						</div>
					</div>

					<div className="-card --shadow mt-6 p-4">
						{!pot.data ? (
							<div className="flex items-center justify-center"></div>
						) : isMobile ? (
							<div className="relative">
								{/* Header */}
								<div className="flex justify-between my-4">
									<div className="font-poppins font-thin text-gray-400 text-sm">
										Check - In
									</div>
									<div className="flex">
										<div className="mr-8 cursor-pointer">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
											>
												<path
													d="M16.75 7.75H7.25C7.05149 7.74869 6.86149 7.66925 6.72112 7.52888C6.58075 7.38851 6.50131 7.19851 6.5 7V5C6.5 2.44 7.69 1.25 10.25 1.25H13.75C16.31 1.25 17.5 2.44 17.5 5V7C17.4987 7.19851 17.4193 7.38851 17.2789 7.52888C17.1385 7.66925 16.9485 7.74869 16.75 7.75ZM8 6.25H16V5C16 3.3 15.45 2.75 13.75 2.75H10.25C8.55 2.75 8 3.3 8 5V6.25Z"
													fill={'currentColor'}
												/>
												<path
													d="M13.0001 22.75H11.0001C10.4933 22.8091 9.97978 22.7528 9.49791 22.5852C9.01603 22.4177 8.57832 22.1433 8.21757 21.7825C7.85682 21.4218 7.58239 20.984 7.41483 20.5022C7.24728 20.0203 7.19095 19.5067 7.25007 19V15C7.25138 14.8015 7.33082 14.6115 7.47119 14.4711C7.61156 14.3307 7.80156 14.2513 8.00007 14.25H16.0001C16.1986 14.2513 16.3886 14.3307 16.529 14.4711C16.6693 14.6115 16.7488 14.8015 16.7501 15V19C16.8092 19.5067 16.7529 20.0203 16.5853 20.5022C16.4178 20.984 16.1433 21.4218 15.7826 21.7825C15.4218 22.1433 14.9841 22.4177 14.5022 22.5852C14.0204 22.7528 13.5068 22.8091 13.0001 22.75ZM8.75007 15.75V19C8.75007 20.58 9.42007 21.25 11.0001 21.25H13.0001C14.5801 21.25 15.2501 20.58 15.2501 19V15.75H8.75007Z"
													fill={'currentColor'}
												/>
												<path
													d="M18.0001 18.7498H16.0001C15.8016 18.7485 15.6116 18.6691 15.4712 18.5287C15.3308 18.3883 15.2514 18.1983 15.2501 17.9998V15.7498H8.75007V17.9998C8.74876 18.1983 8.66932 18.3883 8.52895 18.5287C8.38858 18.6691 8.19858 18.7485 8.00007 18.7498H6.00007C5.49333 18.8089 4.97978 18.7526 4.49791 18.5851C4.01603 18.4175 3.57832 18.1431 3.21757 17.7823C2.85682 17.4216 2.58239 16.9839 2.41483 16.502C2.24728 16.0201 2.19095 15.5066 2.25007 14.9998V9.99983C2.19095 9.49309 2.24728 8.97954 2.41483 8.49766C2.58239 8.01578 2.85682 7.57807 3.21757 7.21732C3.57832 6.85657 4.01603 6.58214 4.49791 6.41459C4.97978 6.24704 5.49333 6.19071 6.00007 6.24983H18.0001C18.5068 6.19071 19.0204 6.24704 19.5022 6.41459C19.9841 6.58214 20.4218 6.85657 20.7826 7.21732C21.1433 7.57807 21.4178 8.01578 21.5853 8.49766C21.7529 8.97954 21.8092 9.49309 21.7501 9.99983V14.9998C21.8092 15.5066 21.7529 16.0201 21.5853 16.502C21.4178 16.9839 21.1433 17.4216 20.7826 17.7823C20.4218 18.1431 19.9841 18.4175 19.5022 18.5851C19.0204 18.7526 18.5068 18.8089 18.0001 18.7498ZM16.7501 17.2498H18.0001C19.5801 17.2498 20.2501 16.5798 20.2501 14.9998V9.99983C20.2501 8.41983 19.5801 7.74983 18.0001 7.74983H6.00007C4.42007 7.74983 3.75007 8.41983 3.75007 9.99983V14.9998C3.75007 16.5798 4.42007 17.2498 6.00007 17.2498H7.25007V14.9998C7.25138 14.8013 7.33082 14.6113 7.47119 14.4709C7.61156 14.3306 7.80156 14.2511 8.00007 14.2498H16.0001C16.1986 14.2511 16.3886 14.3306 16.529 14.4709C16.6693 14.6113 16.7488 14.8013 16.7501 14.9998V17.2498Z"
													fill={'currentColor'}
												/>
												<path
													d="M17 15.75H7C6.80149 15.7487 6.61149 15.6693 6.47112 15.5289C6.33075 15.3885 6.25131 15.1985 6.25 15C6.25131 14.8015 6.33075 14.6115 6.47112 14.4711C6.61149 14.3307 6.80149 14.2513 7 14.25H17C17.1985 14.2513 17.3885 14.3307 17.5289 14.4711C17.6693 14.6115 17.7487 14.8015 17.75 15C17.7487 15.1985 17.6693 15.3885 17.5289 15.5289C17.3885 15.6693 17.1985 15.7487 17 15.75Z"
													fill={'currentColor'}
												/>
												<path
													d="M10 11.75H7C6.80149 11.7487 6.61149 11.6693 6.47112 11.5289C6.33075 11.3885 6.25131 11.1985 6.25 11C6.25131 10.8015 6.33075 10.6115 6.47112 10.4711C6.61149 10.3307 6.80149 10.2513 7 10.25H10C10.1985 10.2513 10.3885 10.3307 10.5289 10.4711C10.6693 10.6115 10.7487 10.8015 10.75 11C10.7487 11.1985 10.6693 11.3885 10.5289 11.5289C10.3885 11.6693 10.1985 11.7487 10 11.75Z"
													fill={'currentColor'}
												/>
											</svg>
										</div>
										<div className="cursor-pointer">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
											>
												<path
													d="M15.26 22.2501H8.73998C3.82998 22.2501 1.72998 20.1501 1.72998 15.2401V15.1101C1.72998 10.6701 3.47998 8.53009 7.39998 8.15809C7.59784 8.1444 7.79339 8.20739 7.94606 8.334C8.09873 8.4606 8.19682 8.64111 8.21998 8.83809C8.22948 8.93664 8.2194 9.03609 8.19032 9.13073C8.16124 9.22536 8.11373 9.31332 8.05053 9.38953C7.98733 9.46573 7.90969 9.5287 7.82207 9.57479C7.73445 9.62088 7.63858 9.64919 7.53998 9.65809C4.39998 9.94809 3.22998 11.4281 3.22998 15.1181V15.2481C3.22998 19.3181 4.66998 20.7581 8.73998 20.7581H15.26C19.33 20.7581 20.77 19.3181 20.77 15.2481V15.1181C20.77 11.4081 19.58 9.92809 16.38 9.65809C16.2806 9.65155 16.1836 9.62524 16.0945 9.58071C16.0055 9.53617 15.9262 9.4743 15.8614 9.39873C15.7965 9.32315 15.7475 9.2354 15.717 9.1406C15.6865 9.04581 15.6753 8.94589 15.6839 8.84669C15.6926 8.7475 15.721 8.65103 15.7674 8.56295C15.8138 8.47486 15.8774 8.39693 15.9543 8.33373C16.0312 8.27052 16.12 8.22332 16.2154 8.19487C16.3109 8.16643 16.411 8.15733 16.51 8.16809C20.49 8.50809 22.27 10.6581 22.27 15.1281V15.2581C22.27 20.1501 20.17 22.2501 15.26 22.2501Z"
													fill={'currentColor'}
												/>
												<path
													d="M12 15.63C11.8015 15.6287 11.6115 15.5493 11.4711 15.4089C11.3307 15.2685 11.2513 15.0785 11.25 14.88V2C11.2513 1.80149 11.3307 1.61149 11.4711 1.47112C11.6115 1.33075 11.8015 1.25131 12 1.25C12.1985 1.25131 12.3885 1.33075 12.5289 1.47112C12.6693 1.61149 12.7487 1.80149 12.75 2V14.88C12.7501 14.9785 12.7308 15.0761 12.6932 15.1672C12.6555 15.2582 12.6003 15.341 12.5306 15.4106C12.461 15.4803 12.3782 15.5355 12.2872 15.5732C12.1961 15.6108 12.0985 15.6301 12 15.63Z"
													fill={'currentColor'}
												/>
												<path
													d="M12.003 16.7502C11.9044 16.7506 11.8068 16.7313 11.7158 16.6935C11.6248 16.6558 11.5423 16.6003 11.473 16.5302L8.12097 13.1802C7.98849 13.0381 7.91637 12.85 7.91979 12.6557C7.92322 12.4614 8.00193 12.276 8.13935 12.1386C8.27676 12.0012 8.46215 11.9225 8.65645 11.9191C8.85075 11.9156 9.03879 11.9878 9.18097 12.1202L12.003 14.9392L14.821 12.1202C14.9631 11.9878 15.1512 11.9156 15.3455 11.9191C15.5398 11.9225 15.7252 12.0012 15.8626 12.1386C16 12.276 16.0787 12.4614 16.0821 12.6557C16.0856 12.85 16.0134 13.0381 15.881 13.1802L12.531 16.5302C12.4619 16.6 12.3797 16.6554 12.289 16.6932C12.1984 16.7309 12.1012 16.7503 12.003 16.7502Z"
													fill={'currentColor'}
												/>
											</svg>
										</div>
									</div>
								</div>

								<hr className="-left-4 absolute w-full border-gray-200 dark:border-gray-700" />
								<hr className="-right-4 absolute w-full border-gray-200 dark:border-gray-700" />

								{/* Users */}
								<div className="my-4"></div>
								{users.map(u => {
									return (
										<>
											<div className="mb-4">
												<div className="flex justify-between items-center py-4">
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
													<div className="cursor-pointer">
														<img src="/img/right-arrow.svg" />
													</div>
												</div>
												<div className="text-xs sm:text-sm flex justify-evenly border rounded-lg border-gray-200 dark:border-gray-700 p-2">
													<div className="text-gray-400 font-poppins font-thin">
														{u.checkinsThisWeek ? 'Thursday, 7:22 PM' : ''}
													</div>
													{u.checkinsThisWeek >= pot.data.pot.checkinCount ? (
														<div className="flex flex-row items-center text-green-500">
															<Square
																className="bg-green-500 mr-2"
																length="1.2rem"
															></Square>
															Completed
														</div>
													) : (
														<div className="flex flex-row items-center text-red-500">
															<Square
																className="bg-red-500 mr-2"
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

											<hr className="-left-4 absolute w-full border-gray-200 dark:border-gray-700" />
											<hr className="-right-4 absolute w-full border-gray-200 dark:border-gray-700" />
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
																<div className="flex flex-row items-center text-green-500">
																	<Square
																		className="bg-green-500 mr-2"
																		length="1.2rem"
																	></Square>
																	Completed
																</div>
															) : (
																<div className="flex flex-row items-center text-red-500">
																	<Square
																		className="bg-red-500 mr-2"
																		length="1.2rem"
																	></Square>
																	Not yet
																</div>
															)}
														</td>
														<td className="font-poppins font-thin text-primary">
															{u.readyUpAt !== null ? (
																`$${parseInt(u.amount).toFixed(2)}`
															) : (
																<>Not ready yet</>
															)}
														</td>
														<td>
															<div className="flex">
																<button
																	style={{
																		padding: '8px 25px',
																		fontWeight: 100,
																		background:
																			'linear-gradient(166.98deg, #8679E2 -3.04%, #6C5DD3 90.61%)'
																	}}
																	className="-button -primary -sm"
																	onClick={() => {
																		setViewingLogsOfUserId(u.id)
																		setViewingLogsMode('week')
																	}}
																>
																	View
																</button>
																<button
																	style={{
																		padding: '8px 25px',
																		fontWeight: 100,
																		background:
																			'linear-gradient(166.98deg, #8679E2 -3.04%, #6C5DD3 90.61%)'
																	}}
																	className="-button -primary -sm ml-1"
																	onClick={() => {
																		setViewingLogsOfUserId(u.id)
																		setViewingLogsMode('all')
																	}}
																>
																	View All
																</button>
															</div>
														</td>
													</tr>
												</>
											)
										})}
										{pot.data.users.length < 2 ? (
											<>
												{[0, 1].map(index => {
													return (
														<tr
															className={clsx(
																index !== 1 ? 'border-b-2' : undefined
															)}
														>
															<td>
																<div
																	className="border-2 border-dashed border-primary rounded-lg p-5"
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
																		className="text-primary font-thin font-poppins"
																	>
																		Add Friend
																	</span>
																</div>
															</td>
														</tr>
													)
												})}
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
							<div className="flex flex-col justify-center items-center py-10">
								<img src="/img/weekly-overview-social-icon.svg" />
								<span className="text-gray-400 mt-10">
									Friends you invite to this session will be shown here
								</span>
								<button
									style={{
										padding: '12px 35px',
										fontWeight: 100,
										background:
											'linear-gradient(166.98deg, #8679E2 -3.04%, #6C5DD3 90.61%)'
									}}
									className="-button -primary -sm mt-5"
									onClick={() => {
										CopyInviteLink(pot.data, setNotificationMessage)
									}}
								>
									Copy Invite Link
								</button>
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
