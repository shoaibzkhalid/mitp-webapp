import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import ReactModal from 'react-modal'
import { useNextAppElement } from '../state/react/useNextAppElement'
import { selectedPotState } from '../state/react/useSelectedPot'
import { CheckInPhotoModalInner } from './modals/CheckInPhotoModalInner'
import { CheckInSuccessModalInner } from './modals/CheckInSuccessModalInner'

interface CheckInButtonProps {
	disabled?: boolean
}

export const CheckInButton = observer(function CheckInButton(
	props: CheckInButtonProps
) {
	const [openModal, setOpenModal] = useState(null as null | 'photo' | 'success')

	const appElement = useNextAppElement()

	return (
		<>
			<button
				className={'mt-5 w-full max-w-sm -button -primary text-lg'}
				onClick={() => setOpenModal('photo')}
			>
				<img className="mr-3" src="./img/camera.png"></img>
				Check In
			</button>

			<ReactModal
				isOpen={openModal === 'photo'}
				onRequestClose={() => setOpenModal(null)}
				appElement={appElement}
			>
				<CheckInPhotoModalInner
					closeModal={() => setOpenModal(null)}
					potId={selectedPotState.moneyPotId}
					openSuccessModal={() => setOpenModal('success')}
				></CheckInPhotoModalInner>
			</ReactModal>
			<ReactModal
				isOpen={openModal === 'success'}
				onRequestClose={() => setOpenModal(null)}
				appElement={appElement}
				style={{
					content: {
						height: '70%',
						top: '10%'
					}
				}}
			>
				<CheckInSuccessModalInner
					closeModal={() => setOpenModal(null)}
					openSuccessModal={() => setOpenModal(null)}
				></CheckInSuccessModalInner>
			</ReactModal>
		</>
	)
})
