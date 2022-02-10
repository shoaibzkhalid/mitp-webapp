import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { selectedPotState } from '../state/react/useSelectedPot'
import { ModalCheckInPhoto } from './modals/ModalCheckInPhoto'
import { ModalCheckInSuccess } from './modals/ModalCheckInSuccess'
import { Button } from './ui/Button'
import { useIsMobile } from '../state/react/useIsMobile'
import { useMutation } from 'react-query'
import { Api } from '../api'
import { queryClient } from '../state/queryClient'

interface CheckInButtonProps {
	disabled?: boolean
}

export const CheckInButton = observer(function CheckInButton(
	props: CheckInButtonProps
) {
	const [openModal, setOpenModal] = useState(null as null | 'photo' | 'success')
	const isMobile = useIsMobile()
	const [file, setFile] = useState(null)

	const checkinMutation = useMutation('checkin', async (file: File) => {
		await Api.logsCreate(selectedPotState.moneyPotId, file)
		queryClient.invalidateQueries(['money-pot', selectedPotState.moneyPotId])
	})

	useEffect(() => {
		if (isMobile && file) {
			checkinMutation.mutateAsync(file).then(() => {
				setOpenModal('success')
			})
		}
	}, [file])

	return (
		<>
			<Button
				className={'mt-5 w-full max-w-sm text-lg'}
				onClick={() => {
					if (isMobile) {
						document.getElementById('mobile-hidden-input').click()
					} else {
						setOpenModal('photo')
					}
				}}
			>
				<img className="mr-3" src="./img/camera.png"></img>
				Check In
			</Button>

			<input
				type="file"
				hidden
				id="mobile-hidden-input"
				accept="image/png, image/jpeg"
				onChange={e => {
					setFile(e.target.files[0])
				}}
			/>

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
