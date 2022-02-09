import { useRouter } from 'next/router'
import { Button } from '../ui/Button'
import { createModalComponent } from '../ui/Modal'

export const ModalStripeConnect = createModalComponent(
	function ModalStripeConnect() {
		const router = useRouter()

		return (
			<>
				<div className="px-0 sm:px-6 text-center flex flex-col justify-center h-full">
					<div className="flex justify-center">
						<img src="/img/stripe-logo.svg" width={150} height={60} />
					</div>
					<div className="text-black font-bold text-xl mt-2 flex">
						<img src="/img/stripe-wallet.svg" width={28} height={20} />
						<span className="ml-2">Connect a card with stripe</span>
					</div>
					<div className="text-gray-500 text-sm mt-2">
						In order to ready up, you must first connect a valid payment method.
					</div>
					<div className="mt-6 mb-4">
						<Button onClick={() => router.push('/payouts')}>My Payouts</Button>
					</div>
				</div>
			</>
		)
	}
)
