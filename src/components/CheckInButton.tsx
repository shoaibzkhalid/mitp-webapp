import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { selectedPotState } from '../state/react/useSelectedPot'
import { ModalCheckInPhoto } from './modals/ModalCheckInPhoto'
import { ModalCheckInSuccess } from './modals/ModalCheckInSuccess'
import { Button } from './ui/Button'

interface CheckInButtonProps {
	disabled?: boolean
}
export const CheckInButton = observer(function CheckInButton(
	props: CheckInButtonProps
) {
	const [openModal, setOpenModal] = useState(null as null | 'photo' | 'success')

	return (
		<>
			<Button
				className={'mt-5 w-full max-w-sm text-lg'}
				onClick={() => setOpenModal('photo')}
			>
				<img className="mr-3" src="./img/camera.png"></img>
				Check In
			</Button>

			<ModalCheckInPhoto
				isOpen={openModal === 'photo'}
				onRequestClose={() => setOpenModal(null)}
				potId={selectedPotState.moneyPotId}
				openSuccessModal={() => setOpenModal('success')}
			></ModalCheckInPhoto>
			<ModalCheckInSuccess
				isOpen={openModal === 'success'}
				onRequestClose={() => setOpenModal(null)}
				style={{
					content: {
						height: '70%',
						top: '10%'
					}
				}}
			></ModalCheckInSuccess>
		</>
	)
})
