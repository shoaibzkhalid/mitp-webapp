import { userState } from '../../state/user'
import { useSelectedPot } from '../../state/useSelectedPot'
import { ModalProps } from './types'

export function PayInRulesModalInner({ closeModal }: ModalProps) {
	const pot = useSelectedPot()
	const user = pot.data?.users.find(user => user.id === userState.user?.id)

	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>Pay in Rules</div>
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
				<>
					If you fail to log {pot.data.pot.checkinCount} times in a week, you
					will have to contribute ${parseInt(user?.amount || '0')} to the pot.
				</>
			)}
		</>
	)
}
