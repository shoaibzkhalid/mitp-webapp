import { useSelectedPot } from '../../state/react/useSelectedPot'
import { ModalProps } from './types'

export function CheckInSuccessModalInner(props: ModalProps) {
	const pot = useSelectedPot()
	const usersWithCheckins = pot.data?.users.filter(
		u => u.checkinsThisWeek > 0
	).length

	return (
		<>
			<div className="flex flex-col justify-evenly h-full items-center">
				<img src="/img/success.svg" />
				<div className="text-3xl font-bold font-poppins">Success!</div>
				<div className="font-poppins text-center text-bombay sm:text-lg text-sm">
					{usersWithCheckins} out of {pot.data?.users.length || 1} members have
					checked in <br /> this week
				</div>
				<div>
					<button
						onClick={props.closeModal}
						style={{
							padding: '10px 90px'
						}}
						className="text-white font-poppins max-w-sm -button text-lg bg-shark"
					>
						Onwards!
					</button>
				</div>
			</div>
		</>
	)
}
