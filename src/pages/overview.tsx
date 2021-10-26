import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ReactModal from 'react-modal'
import { CheckInButton } from '../components/CheckInButton'
import { UserViewLogsModalInner } from '../components/modals/UserViewLogsModalInner'
import { Square } from '../components/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { useNextAppElement } from '../state/useNextAppElement'
import { userState } from '../state/user'
import { selectedPotState, useSelectedPot } from '../state/useSelectedPot'

export default wrapDashboardLayout(function RealIndexPage() {
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()

	if (!isLoading && data === null) {
		router.push('/pot/new')
		return null
	}

	const month = dayjs().startOf('month')
	const currWeek = dayjs().diff(month, 'week') + 1
	const endOfWeek = dayjs.duration(dayjs().endOf('week').diff()).humanize(true)

	const appElement = useNextAppElement()
	const [viewingLogsOfUserId, setViewingLogsOfUserId] = useState(
		null as string | null
	)

	return (
		<>
			<Head>
				<title>Overview - Camelot</title>
			</Head>

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
					></UserViewLogsModalInner>
				)}
			</ReactModal>

			<div className="py-12 font-poppins">
				<div className="text-2xl mb-3">Hi {userState.user!.firstName},</div>
				<div className="text-5xl font-semibold">Welcome back 👋</div>
			</div>

			<div className="bg-primary rounded-3xl p-16 text-white">
				<div className="text-4xl font-bold">Ends {endOfWeek}</div>
				<div className="my-5">
					{month.format('MMMM')}, Week {currWeek} of 4
				</div>
				<CheckInButton
					potId={selectedPotState.moneyPotId}
					className="-button -dark w-full max-w-xs"
				></CheckInButton>
			</div>

			<div className="-card --shadow mt-6 p-4">
				{!data ? (
					<div className="flex items-center justify-center"></div>
				) : (
					<div className="-table-responsive">
						<table className="-table">
							<thead>
								<tr>
									<th></th>
									<th>Check-ins</th>
									<th>Tribute amount</th>
									<th>Photo Proofs</th>
								</tr>
							</thead>
							<tbody>
								{data.users.map(u => {
									return (
										<tr>
											<td>
												<div className="flex flex-row items-center font-bold">
													{u.firstName} {u.lastName}
												</div>
											</td>
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
		</>
	)
})
