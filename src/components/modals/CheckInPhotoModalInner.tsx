import { useMutation } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../../state/queryClient'
import { ModalProps } from './types'
import { useDropzone } from 'react-dropzone'
import { QrCode } from '../QrCode'
import { AppEnv } from '../../env'
import { userState } from '../../state/user'
import { selectedPotState } from '../../state/react/useSelectedPot'
import { useMediaQuery } from '../../state/react/useMediaQuery'
import { useEffect } from 'react'

export function CheckInPhotoModalInner({
	closeModal,
	potId,
	openSuccessModal
}: ModalProps) {
	const checkinMutation = useMutation('checkin', async (file: File) => {
		await Api.logsCreate(potId, file)
		queryClient.invalidateQueries(['money-pot', potId])
	})

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		multiple: false,
		accept: 'image/jpeg, image/png',
		maxSize: 5 * 1024 * 1024
	})

	const isMobile = useMediaQuery('(max-width: 1024px)')

	// Automatically send file if we're on mobile
	useEffect(() => {
		if (isMobile && acceptedFiles.length > 0) {
			checkinMutation.mutateAsync(acceptedFiles[0]).then(() => {
				closeModal()
				openSuccessModal()
			})
		}
	}, [acceptedFiles])

	return (
		<div className="flex flex-col h-full">
			<div className="text-xl font-poppins flex items-center">
				<div>Choose Photo</div>
				<div className="ml-auto">
					<button
						className="-button -round hover:shadow-lg text-sm"
						onClick={() => closeModal()}
					>
						x
					</button>
				</div>
			</div>
			<p className="text-gray-400 my-4">
				Drag and drop to enter photo select from files
			</p>
			<div
				className="flex justify-center items-center text-center rounded-2xl mt-3"
				{...getRootProps()}
				style={{
					backgroundColor: '#2C2E38',
					color: '#fff',
					minHeight: '150px'
				}}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center">
					<img src="/img/camera.svg" width="25" />
					<p className="mt-2">Choose from library</p>
				</div>
			</div>
			<div>
				<button
					className={'mt-5 -button -shark text-lg bg-shark w-full sm:w-auto'}
					onClick={() => {
						checkinMutation.mutateAsync(acceptedFiles[0]).then(() => {
							closeModal()
							openSuccessModal()
						})
					}}
				>
					Save
				</button>
			</div>

			<div className="hidden xl:block">
				<div className="text-xl font-poppins mt-6">Log from mobile</div>
				<div className="grid grid-cols-2 gap-6">
					<div className="text-gray-400 mt-6">
						Scan this QR code on your phone to get logged in right away.
					</div>
					<div className="flex items-center justify-center">
						<QrCode
							url={`${AppEnv.webBaseUrl}/qr-login?p=${
								selectedPotState.moneyPotId
							}&t=${encodeURIComponent(userState.tokens.refreshToken)}`}
							className="w-full max-w-[220px]"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
