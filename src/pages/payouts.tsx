import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../api'
import { Square } from '../components/ui/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { MobileHeader } from '../components/unique/MobileHeader'
import { toggleSideBar } from '../utils/common'
import { ModalWithdraw } from '../components/modals/ModalWithdraw'
import { Button } from '../components/ui/Button'
import { OverlayLoadingAnimation } from '../components/OverlayLoadingAnimation'

export default wrapDashboardLayout(function PayoutsPage() {
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()

	const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

	const pot = useSelectedPot()

	useEffect(() => {
		toggleSideBar(false)
	}, [])

	if (!isLoading && data === null) {
		router.push('/new')
	}
	if (!data) return <OverlayLoadingAnimation />

	const { data: transactionsData } = useQuery(
		['payouts', userState.user?.id],
		() => Api.transactionsList()
	)

	return (
		<>
			<Head>
				<title>{`Your Group - ${data?.pot.title}`}</title>
			</Head>

			<ModalWithdraw
				isOpen={withdrawModalIsOpen}
				onRequestClose={() => setWithdrawModalIsOpen(false)}
			/>

			<div style={{ maxWidth: '1100px', margin: '0 auto' }}>
				<MobileHeader />

				<div className="px-6 py-12 font-poppins">
					<div className="mb-3 text-2xl">Hi {userState?.user?.firstName},</div>
					<div className="text-5xl font-semibold">Payouts 💰</div>
				</div>

				<div className="grid px-6 lg:grid-cols-3">
					<div className="col-span-2">
						<div className="h-full p-8 -card --shadow">
							<PaymentMethod></PaymentMethod>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center text-center">
						<div className="text-xl font-bold">Your account credits</div>
						<div className="my-10 font-bold text-primary text-7xl">
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
							<Button
								className="mr-4"
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
							</Button>
							<Button
								kind="secondary"
								disabled={!transactionsData?.currentCredits}
								onClick={() => {
									setWithdrawModalIsOpen(true)
								}}
							>
								Withdraw
							</Button>
						</div>
					</div>
				</div>

				<hr className="my-10" />

				<div className="px-6 -card --shadow xl:px-12 md:px-8">
					<div className="-table-responsive max-w-[100vw]">
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
														className="mr-2 bg-green-500"
														length="1.2rem"
													></Square>
													Completed
												</div>
											</td>
											<td className="text-center text-blue-600">
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
				<Button
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
				</Button>
			) : (
				<div>
					<div>
						Logged in as: {paypalConnection.meta.name} <br />
						{paypalConnection.meta.email}
					</div>
					<div>
						<Button>Unlink</Button>

						<Button
							className="opacity-20"
							onClick={() => depositMutation.mutate()}
						>
							Deposit 2$
						</Button>
					</div>
				</div>
			)}
		</>
	)
}
