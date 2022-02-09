import { ModalProps } from './types'

export function PayoutScheduleModalInner({ closeModal }: ModalProps) {
	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>Pay out Schedule</div>
				<div className="ml-auto">
					<button
						className="-button -round hover:shadow-lg text-sm"
						onClick={() => closeModal()}
					>
						x
					</button>
				</div>
			</div>
			You can request a payout at any time. There is a two week delay between
			winning a pot and being able to pay out the won amount.
		</>
	)
}
