import { useRouter } from 'next/router'
import { Button } from '../ui/Button'
import { createModalComponent } from '../ui/Modal'
import { useMediaQuery } from '../../state/react/useMediaQuery'

export const ModalStripeConnect = createModalComponent(
	function ModalStripeConnect() {
		const router = useRouter()
		const isMobile = useMediaQuery('(max-width: 380px)')

		return (
			<>
				<div className="flex flex-col justify-center h-full px-0 text-center sm:px-6">
					<div className="flex justify-center">
						<img src="/img/stripe-logo.svg" width={150} height={60} />
					</div>
					<div className="flex mt-2 text-xl font-bold text-black">
						<img
							src="/img/stripe-wallet.svg"
							width={isMobile ? 22 : 28}
							height={20}
						/>
						<span className="ml-2" style={{ fontSize: isMobile ? '14px' : '' }}>
							Connect a card with stripe
						</span>
					</div>
					<div
						className="mt-2 text-sm text-gray-500"
						style={{ fontSize: isMobile ? '12px' : '' }}
					>
						In order to ready up, you must first connect a valid payment method.
					</div>
					<div className="flex justify-center mt-6 mb-4">
						<Button onClick={() => router.push('/payouts')}>My Payouts</Button>
					</div>
				</div>
			</>
		)
	}
)
