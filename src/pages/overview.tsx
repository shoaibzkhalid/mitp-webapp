import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ReactModal from 'react-modal'
import { CheckInButton } from '../components/CheckInButton'
import { UserViewLogsModalInner } from '../components/modals/UserViewLogsModalInner'
import { Square } from '../components/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { useNextAppElement } from '../state/react/useNextAppElement'
import { userState } from '../state/user'
import { selectedPotState, useSelectedPot } from '../state/react/useSelectedPot'
import { formatDateRange } from '../utils/formatDateRange'
import { formatDuration } from '../utils/formatDuration'
import { CheckInPhotoModalInner } from '../components/modals/CheckInPhotoModalInner'
import { CheckInSuccessModalInner } from '../components/modals/CheckInSuccessModalInner'
import { Header } from '../components/unique/Header'

export default wrapDashboardLayout(function RealIndexPage() {
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()

	if (!isLoading && data === null) {
		router.push('/create')
		return null
	}

	const month = dayjs().startOf('month')
	const currWeek = dayjs().diff(month, 'week') + 1
	const timeUntilWeekEnd = formatDuration(
		Math.floor(dayjs().endOf('week').diff() / 1000)
	)
	const weekStartDay = dayjs().startOf('week')
	const weekEndDay = dayjs().endOf('week')

	const appElement = useNextAppElement()
	const [viewingLogsOfUserId, setViewingLogsOfUserId] = useState(
		null as string | null
	)
	const [photoModalIsOpen, setPhotoModalIsOpen] = useState(false)
	const [sucessModalIsOpen, setSucessModalIsOpen] = useState(false)

	// px-10 xl:px-12 md:px-8
	return (
		<>
			<Head>
				<title>Overview - Camelot</title>
			</Head>

			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				<ReactModal
					isOpen={viewingLogsOfUserId !== null}
					onRequestClose={() => setViewingLogsOfUserId(null)}
					appElement={appElement}
				>
					{viewingLogsOfUserId && data && (
						<UserViewLogsModalInner
							closeModal={() => setViewingLogsOfUserId(null)}
							userId={viewingLogsOfUserId}
							potId={data.pot.id}
							openSuccessModal={() => console.log()}
						></UserViewLogsModalInner>
					)}
				</ReactModal>

				<div className="w-full flex flex-col flex-col-reverse xl:flex-row">
					<div
						className="border-b border-gray-200 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-b-0"
						style={{
							padding: '25px 20px'
						}}
					>
						<Header />
					</div>
				</div>

				<div className="px-10 xl:px-12 md:px-8">
					<div className="py-12 font-poppins">
						<div className="text-2xl mb-3">Hi {userState.user!.firstName},</div>
						<div className="text-5xl font-semibold">Welcome back 👋</div>
					</div>

					<div className="bg-primary rounded-3xl p-16 text-white">
						<div className="text-4xl font-bold">
							Check ins due in {timeUntilWeekEnd}
						</div>
						<div className="my-5">
							{formatDateRange(weekStartDay, weekEndDay)}, Week {currWeek} of 4
						</div>
						<CheckInButton
							className="-button -dark w-full max-w-xs"
							setPhotoModalIsOpen={(isOpen: boolean) =>
								setPhotoModalIsOpen(isOpen)
							}
						></CheckInButton>
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

					<div className="-card --shadow mt-6 p-4">
						{!data ? (
							<div className="flex items-center justify-center"></div>
						) : (
							<div className="-table-responsive">
								<table className="-table">
									<thead className="text-left">
										<tr>
											<th></th>
											<th></th>
											<th>Done</th>
											<th>Check-ins</th>
											<th>Tribute amount</th>
											<th>Photo Proofs</th>
										</tr>
									</thead>
									<tbody>
										{data.users.map(u => {
											return (
												<tr>
													<td style={{
														paddingRight: 0
													}}>
														<img src="/img/avatar.png" style={{
															minHeight: 60,
															minWidth: 60
														}} />
													</td>
													<td style={{
														paddingLeft: 0
													}}>
														<div className="flex flex-row items-center font-bold">															
															<span style={{ marginLeft: 20 }}>
																{u.firstName} {u.lastName}
															</span>
														</div>
													</td>
													<td>Thursday, 7:22 PM</td>
													<td>
														{u.checkinsThisWeek >= data.pot.checkinCount ? (
															<div className="flex flex-row items-center text-green-500">
																<Square
																	className="bg-green-500 mr-2"
																	length="1.2rem"
																></Square>
																{u.checkinsThisWeek} / {data.pot.checkinCount}
															</div>
														) : (
															<div className="flex flex-row items-center text-red-500">
																<Square
																	className="bg-red-500 mr-2"
																	length="1.2rem"
																></Square>
																{u.checkinsThisWeek} / {data.pot.checkinCount}
															</div>
														)}
													</td>
													<td className="text-blue-600">
														${parseInt(u.amount).toFixed(2)}
													</td>
													<td>
														<button
															className="-button -primary -sm"
															onClick={() => setViewingLogsOfUserId(u.id)}
														>
															View
														</button>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
})
