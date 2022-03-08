import { useEffect, useRef, useState } from 'react'
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
import { queryClient } from '../state/queryClient'
import Notification from '../components/notification/Notification'
import { ModalAddPaymentCard } from '../components/modals/ModalAddPaymentCard'

export default wrapDashboardLayout(function PayoutsPage() {
	const router = useRouter()
	const selectedPot = useSelectedPot()

	const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

	const pot = useSelectedPot()

	useEffect(() => {
		toggleSideBar(false)
	}, [])

	if (!selectedPot.isLoading && selectedPot.data === null) {
		router.push('/new')
	}
	if (!selectedPot.data) return <OverlayLoadingAnimation />

	const payouts = useQuery(['payouts', userState.user?.id], () =>
		Api.transactionsList()
	)

	const potUser = pot.data?.users.find(u => u.id === userState.user?.id)

	return (
		<>
			<Head>
				<title>{`Your Group - ${selectedPot.data?.pot.title}`}</title>
			</Head>

			<ModalWithdraw
				isOpen={withdrawModalIsOpen}
				onRequestClose={() => setWithdrawModalIsOpen(false)}
			/>

			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				<MobileHeader />

				<div className="px-6 py-12 font-poppins">
					<div className="mb-3 text-2xl">Hi {userState?.user?.firstName},</div>
					<div className="text-5xl font-semibold">Payouts 💰</div>
				</div>

				<div className="grid lg:grid-cols-3">
					<div className="col-span-3">
						<div className="h-full p-8 -card --shadow">
							<div className="flex justify-between">
								<div>
									<PaymentMethod></PaymentMethod>
								</div>
								<div>Your Swear Jar Fee: ${potUser.amount}</div>
							</div>
						</div>
					</div>
					{/* <div className="flex flex-col items-center justify-center text-center">
						<div className="text-xl font-bold">Your account credits</div>
						<div className="my-10 font-bold text-primary text-7xl">
							{!transactionsData ? (
								<div className="flex items-center justify-center">
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
					</div> */}
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
								{payouts.data?.transactions.map(tr => {
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
	const [notificationMessage, setNotificationMessage] = useState('')
	const setNotificationMessageRef = useRef(setNotificationMessage)
	setNotificationMessageRef.current = setNotificationMessage

	const [currModal, setCurrModal] = useState(null as null | 'addCard')

	const card = useQuery('userCard', async () => {
		return Api.user.getStripeCard()
	})

	const deleteCard = useMutation(async () => {
		await Api.user.deleteStripeCard()
		queryClient.invalidateQueries('userCard')
		setNotificationMessage('Payment card has been removed.')
		setTimeout(() => setNotificationMessageRef.current(''), 5000)
	})

	return (
		<>
			{notificationMessage !== '' && (
				<Notification
					key={notificationMessage}
					message={notificationMessage}
					info="copied"
				/>
			)}

			<ModalAddPaymentCard
				isOpen={currModal === 'addCard'}
				onRequestClose={() => {
					setCurrModal(null)
					queryClient.invalidateQueries('userCard')
				}}
			/>

			{card.isLoading || card.data === null ? (
				<Button
					onClick={() => setCurrModal('addCard')}
					disabled={card.isLoading}
				>
					Add payment card
				</Button>
			) : (
				<>
					<div className="mb-5">
						Saved card: {card.data.card.brand.toUpperCase()} ending with{' '}
						{card.data.card.last4}
					</div>
					<Button
						onClick={() => deleteCard.mutate()}
						disabled={deleteCard.isLoading || card.isLoading}
					>
						Remove payment card
					</Button>
				</>
			)}
		</>
	)
}
