import { useSelectedPot } from '../../state/react/useSelectedPot'
import { Button } from '../ui/Button'
import { createModalComponent } from '../ui/Modal'

export const ModalCheckInSuccess = createModalComponent(
	function ModalCheckInSuccess(props) {
		const pot = useSelectedPot()
		const usersWithCheckins = pot.data?.users.filter(
			u => u.checkinsThisWeek > 0
		).length
		const users = pot.data?.users.length || 1

		return (
			<>
				<div className="flex flex-col items-center h-full justify-evenly">
					<img src="/img/success.svg" />
					<div className="text-3xl font-bold font-poppins">Success!</div>
					<div className="text-sm text-center font-poppins text-bombay sm:text-lg">
						{usersWithCheckins} out of {users} member{users === 1 || 's'} have
						checked in <br /> this week
					</div>
					<div>
						<Button onClick={props.onRequestClose}>Onwards!</Button>
					</div>
				</div>
			</>
		)
	}
)
