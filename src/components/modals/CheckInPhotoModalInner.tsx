import { useMutation } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../../state/queryClient'
import { ModalProps } from './types'
import { useDropzone } from 'react-dropzone'

export function CheckInPhotoModalInner({
	closeModal,
	potId,
	openSuccessModal
}: ModalProps) {
	const checkinMutation = useMutation(
		'checkin',
		(file: File) => Api.logsCreate(potId, file),
		{
			onSuccess() {
				queryClient.invalidateQueries(['money-pot', potId])
			}
		}
	)

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		multiple: false,
		accept: 'image/jpeg, image/png',
		maxSize: 5 * 1024 * 1024
	})

	return (
		<div className="flex flex-col h-full justify-evenly">
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
			<p style={{ color: '#808191' }}>
				Drag and Drop to enter photo select from files
			</p>
			<div
				className="flex justify-center items-center text-center rounded-2xl mt-3"
				{...getRootProps()}
				style={{
					backgroundColor: '#2C2E38',
					color: '#fff',
					height: 250
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
		</div>
	)
}
