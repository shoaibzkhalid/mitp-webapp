import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { selectedPotState, useSelectedPot } from '../state/react/useSelectedPot'
import { ModalCheckInPhoto } from './modals/ModalCheckInPhoto'
import { ModalCheckInSuccess } from './modals/ModalCheckInSuccess'
import { Button } from './ui/Button'
import { useIsMobile } from '../state/react/useIsMobile'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../api'
import { queryClient } from '../state/queryClient'
import { kindClasses } from '../components/ui/Button'
import { toast } from 'react-toastify'
import { themeState } from '../state/react/useTheme'
import { userState } from '../state/user'
import dayjs from 'dayjs'

interface CheckInButtonProps {
	disabled?: boolean
	kind?: keyof typeof kindClasses
	camera?: string
}

export const CheckInButton = observer(function CheckInButton(
	props: CheckInButtonProps
) {
	const [openModal, setOpenModal] = useState(null as null | 'photo' | 'success')
	const isMobile = useIsMobile()
	const [file, setFile] = useState(null)
	const pot = useSelectedPot()

	const userLogs = useQuery(
		['user-logs', pot.data.pot.id, userState.user.id],
		() => Api.logsList(pot.data.pot.id, userState.user.id)
	)

	const checkedInAlready =
		userLogs.data?.logs[0] &&
		dayjs().isSame(userLogs.data?.logs[0].createdAt, 'day')

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
				disabled={props.disabled}
				kind={props.kind}
				onClick={() => {
					if (checkedInAlready) {
						toast(
							'You have checked in already today. Come back tomorrow for the next check in.',
							{ type: 'error', theme: themeState.theme }
						)
						return
					}

					if (isMobile) {
						document.getElementById('mobile-hidden-input').click()
					} else {
						setOpenModal('photo')
					}
				}}
			>
				<img
					className="mr-3"
					src={
						props.camera === 'black'
							? './img/camera-black.png'
							: './img/camera.png'
					}
					width={32}
					height={32}
				></img>
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
