import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { Api } from '../api'
import { Spinner } from '../components/Spinner'
import { Square } from '../components/Square'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { userState } from '../state/user'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { Header } from '../components/unique/Header'

export default wrapDashboardLayout(function PayoutsPage() {
	const router = useRouter()
	const { isLoading, data } = useSelectedPot()

	if (!isLoading && data === null) {
		router.push('/create')
	}

	const { data: transactionsData } = useQuery(
		['payouts', userState.user?.id],
		() => Api.transactionsList()
	)

	return (
		<>
			<Head>
				<title>Payouts - Camelot</title>
			</Head>

			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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

				<div className="py-12 font-poppins px-10 xl:px-12 md:px-8">
					<div className="text-2xl mb-3">Hi {userState.user!.firstName},</div>
					<div className="text-5xl font-semibold">Payouts 💰</div>
				</div>

				<div className="grid lg:grid-cols-3 px-10 xl:px-12 md:px-8">
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
									<Spinner></Spinner>
								</div>
							) : (
								'$' + transactionsData.currentCredits
							)}
						</div>
						<button
							className="-button -primary"
							disabled={!transactionsData?.currentCredits}
						>
							Withdraw All Credits
						</button>
					</div>
				</div>

				<hr className="my-10" />

				<div className="-card --shadow px-10 xl:px-12 md:px-8">
					<div className="-table-responsive">
						<table className="-table">
							<thead>
								<tr>
									<th>Transaction</th>
									<th>Status</th>
									<th>Date Processed</th>
									<th>Fees</th>
								</tr>
							</thead>
							<tbody>
								{transactionsData?.transactions.map(tr => {
									return (
										<tr>
											<td>
												<div className="flex flex-row items-center font-bold">
													?
												</div>
											</td>
											<td>Tuesday, 07:22 PM</td>
											<td>
												{dayjs(tr.createdAt).format('DD MMM YYYY, HH:mm A')}
											</td>
											<td>
												<div className="flex flex-row items-center text-green-500">
													<Square
														className="bg-green-500 mr-2"
														length="1.2rem"
													></Square>
													Completed
												</div>
											</td>
											<td className="text-blue-600">
												${parseInt(tr.delta) / 100 || '?'}
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
					<Spinner></Spinner>
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
					</div>
				</div>
			)}
		</>
	)
}
