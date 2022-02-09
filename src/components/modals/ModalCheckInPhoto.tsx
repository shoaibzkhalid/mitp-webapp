import { useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../../state/queryClient'
import { useDropzone } from 'react-dropzone'
import { QrCode } from '../ui/QrCode'
import { AppEnv } from '../../env'
import { userState } from '../../state/user'
import { selectedPotState } from '../../state/react/useSelectedPot'
import { useMediaQuery } from '../../state/react/useMediaQuery'
import { useEffect } from 'react'
import { SpinnerBig } from '../SpinnerBig'
import { createModalComponent } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ButtonCloseModal } from './ButtonCloseModal'
import { useIsMobile } from '../../state/react/useIsMobile'

export const ModalCheckInPhoto = createModalComponent<{
	openSuccessModal: () => any
	potId: string
}>(function ModalCheckInPhoto(props) {
	const [isUplaoding, setIsUploading] = useState(false)
	const checkinMutation = useMutation('checkin', async (file: File) => {
		setIsUploading(true)
		await Api.logsCreate(props.potId, file)
		queryClient.invalidateQueries(['money-pot', props.potId])
		setIsUploading(false)
	})

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		multiple: false,
		accept: 'image/jpeg, image/png',
		maxSize: 5 * 1024 * 1024
	})

	const isMobile = useIsMobile()

	// Automatically send file if we're on mobile
	useEffect(() => {
		if (isMobile && acceptedFiles.length > 0) {
			checkinMutation.mutateAsync(acceptedFiles[0]).then(() => {
				props.onRequestClose()
				props.openSuccessModal()
			})
		}
	}, [acceptedFiles])

	return (
		<div className="flex flex-col h-full py-4 px-8">
			<div className="text-xl font-poppins flex items-center justify-center">
				<div className="font-bold">Log from Mobile</div>
				<div className="absolute right-4">
					<ButtonCloseModal onClick={props.onRequestClose} />
				</div>
			</div>
			<div className="text-gray-500 flex justify-center text-center mt-2">
				Scan this QR code on your phone to get logged<br></br>in right away.
			</div>
			<div className="flex justify-center py-8">
				<div className="box max-w-[260px] p-[15px]">
					<QrCode
						url={`${AppEnv.webBaseUrl}/qr-login?p=${
							selectedPotState.moneyPotId
						}&t=${encodeURIComponent(userState.tokens.refreshToken)}`}
						className="w-full"
					/>
				</div>
			</div>

			<h2
				style={{
					lineHeight: '0.1em',
					margin: '10px 0 20px'
				}}
				className="text-center w-full border-b-2 border-gray-300"
			>
				<span className="bg-white dark:bg-dark text-gray-500 dark:text-white px-2 font-bold">
					OR
				</span>
			</h2>

			<div className="flex justify-center text-center items-center flex-col my-4">
				<div>
					<h2 className="text-2xl font-bold">Choose Photo</h2>
				</div>
				<div className="text-gray-600 mt-1">
					Drag and drop to enter photo select from files
				</div>
			</div>

			{isUplaoding ? (
				<>
					<SpinnerBig />
				</>
			) : (
				<>
					<div
						className="flex justify-center items-center text-center border-dashed border-2 border-gray-400 rounded-2xl mt-3 cursor-pointer"
						{...getRootProps()}
						style={{
							backgroundColor: '#F2F2F2',
							color: '#fff',
							minHeight: '150px'
						}}
					>
						<input {...getInputProps()} />
						<div className="flex flex-col items-center">
							<img src="/img/camera.svg" width="25" />
							<p className="mt-2 text-gray-600 font-bold">
								Choose from library
							</p>
						</div>
					</div>
				</>
			)}
			<div className="flex justify-center pt-2 pb-6">
				<Button
					className={'mt-3'}
					onClick={() => {
						checkinMutation.mutateAsync(acceptedFiles[0]).then(() => {
							props.onRequestClose()
							props.openSuccessModal()
						})
					}}
				>
					Save
				</Button>
			</div>
		</div>
	)
})
