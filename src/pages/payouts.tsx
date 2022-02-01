import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../api'
import { Spinner } from '../components/Spinner'
import { Square } from '../components/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { Header } from '../components/unique/Header'
import { toggleSideBar } from '../utils/common'
import ReactModal from 'react-modal'
import { WithdrawModalInner } from '../components/modals/WithdrawModalInner'
import { useNextAppElement } from '../state/react/useNextAppElement'
// import { SpinnerBig } from '../components/SpinnerBig'

export default wrapDashboardLayout(function PayoutsPage() {
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()
	const appElement = useNextAppElement()

	const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

	const pot = useSelectedPot()

	useEffect(() => {
		toggleSideBar(false)
	}, [])

	if (!isLoading && data === null) {
		router.push('/new')
	}
	// if (!data) {
	// 	return <SpinnerBig />
	// }

	const { data: transactionsData } = useQuery(
		['payouts', userState.user?.id],
		() => Api.transactionsList()
	)

	return (
		<>
			<Head>
				<title>{`Your Group - ${data?.pot.title}`}</title>
			</Head>

			<ReactModal
				isOpen={withdrawModalIsOpen}
				onRequestClose={() => setWithdrawModalIsOpen(false)}
				appElement={appElement}
			>
				<WithdrawModalInner closeModal={() => setWithdrawModalIsOpen(false)} />
			</ReactModal>

			<div style={{ maxWidth: '1100px', margin: '0 auto' }}>
				<div className="w-full flex flex-col-reverse xl:flex-row">
					<div
						className="px-6 border-b border-gray-200 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-b-0"
						style={{
							padding: '25px 20px'
						}}
					>
						<Header />
					</div>
				</div>

				<div className="px-6 py-12 font-poppins">
					<div className="text-2xl mb-3">Hi {userState?.user?.firstName},</div>
					<div className="text-5xl font-semibold">Payouts 💰</div>
				</div>

				<div className="grid lg:grid-cols-3">
					<div className="col-span-2">
						<div className="-card --shadow p-8 h-full">
							<PaymentMethod></PaymentMethod>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center text-center">
						<div className="text-xl font-bold">Your account credits</div>
						<div className="text-primary text-7xl my-10 font-bold">
							{!transactionsData ? (
								<div className="flex items-center justify-center">
									{/* <Spinner></Spinner> */}
								</div>
							) : (
								'$' +
								(parseInt(transactionsData.currentCredits) / 100).toFixed(2)
							)}
						</div>
						<div className="payments__button-wrapper flex justify-center">
							<button
								className="-button -primary mr-4"
								disabled={!transactionsData?.currentCredits}
								onClick={() => {
									localStorage.setItem(
										'post-login-action',
										JSON.stringify({
											type: 'goto-pot',
											potId: pot.data!.pot.id
										})
									)
									router.push('/paypal/login-initiate')
								}}
							>
								Add Credits
							</button>
							<button
								className="-button -secondary"
								disabled={!transactionsData?.currentCredits}
								onClick={() => {
									setWithdrawModalIsOpen(true)
								}}
							>
								Withdraw
							</button>
						</div>
					</div>
				</div>

				<hr className="my-10" />

				<div className="-card --shadow px-10 xl:px-12 md:px-8">
					<div className="-table-responsive">
						<table className="-table">
							<thead>
								<tr>
									<th>Description</th>
									<th>Status</th>
									<th>Amount</th>
									<th>Fees</th>
									<th>Date Processed</th>
								</tr>
							</thead>
							<tbody>
								{transactionsData?.transactions.map(tr => {
									return (
										<tr>
											<td>
												<div className="flex flex-row items-center font-bold">
													{tr.parentIds.length === 0 ? 'Top-up' : 'Unknown'}
												</div>
											</td>
											<td>
												<div className="flex flex-row items-center justify-center text-green-500">
													<Square
														className="bg-green-500 mr-2"
														length="1.2rem"
													></Square>
													Completed
												</div>
											</td>
											<td className="text-blue-600 text-center">
												${parseInt(tr.amount) / 100 || '?'}
											</td>
											<td className="text-center">0$</td>

											<td className="text-center">
												{dayjs(tr.createdAt).format('DD MMM YYYY, HH:mm A')}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
})

function PaymentMethod() {
	const { data } = useQuery(['connections', userState.user?.id], () =>
		Api.user.listConnections()
	)

	const paypalConnection = data?.find(c => c.service === 'paypal')
	const router = useRouter()
	const pot = useSelectedPot()

	const depositMutation = useMutation(async () => {
		const order = await Api.user.payin(2)
		document.location = order.approveUrl
	})

	const isGoogleConnected = !!userState.user?.connections.find(
		c => c.service === 'google'
	)

	return (
		<>
			<img
				src="/img/paypal.png"
				alt="PayPal logo"
				className="mb-6"
				style={{ height: '25px' }}
			></img>

			{!data ? (
				<div className="flex items-center justify-center">
					{/* <Spinner></Spinner> */}
				</div>
			) : !paypalConnection ? (
				<button
					className="-button -primary"
					onClick={() => {
						localStorage.setItem(
							'post-login-action',
							JSON.stringify({
								type: 'goto-pot',
								potId: pot.data!.pot.id
							})
						)
						router.push('/paypal/login-initiate')
					}}
					disabled={!isGoogleConnected}
				>
					Link PayPal
				</button>
			) : (
				<div>
					<div>
						Logged in as: {paypalConnection.meta.name} <br />
						{paypalConnection.meta.email}
					</div>
					<div>
						<button className="-button -secondary">Unlink</button>

						<button
							className="opacity-20"
							onClick={() => depositMutation.mutate()}
						>
							Deposit 2$
						</button>
					</div>
				</div>
			)}
		</>
	)
}
