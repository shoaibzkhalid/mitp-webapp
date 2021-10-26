import { useSelectedPot } from '../../state/useSelectedPot'
import { ModalProps } from './types'

export function CheckInRulesModalInner({ closeModal }: ModalProps) {
	const pot = useSelectedPot()

	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>Check in Rules</div>
				<div className="ml-auto">
					<button
						className="-button -round hover:shadow-lg text-sm"
						onClick={() => closeModal()}
					>
						x
					</button>
				</div>
			</div>

			{pot.data && (
				<>You must log {pot.data.pot.checkinCount} times each week.</>
			)}
		</>
	)
}
