import { createModalComponent } from '../ui/Modal'
import { Button } from '../ui/Button'

export const ModalPotConfirmModal = createModalComponent<{
	openSuccessModal: () => any
	potId: string
	btnText: string
}>(function ModalPotConfirmModal(props) {
	return (
		<div className="flex flex-col px-8 py-4">
			<div>
				Are you sure you want to {props.btnText.toLowerCase()} this group? Once
				you {props.btnText.toLowerCase()}, you will no longer be able to join
				this group again.
			</div>
			<div className="flex justify-between align-center w-ful">
				<Button
					className={'mt-3 border-red-600'}
					onClick={() => props.openSuccessModal()}
					kind="tertiary"
				>
					<div className={'text-red-600'}>{props.btnText}</div>
				</Button>
				<Button
					className={'mt-3'}
					onClick={() => props.onRequestClose()}
					kind="secondary"
				>
					Cancel
				</Button>
			</div>
		</div>
	)
})
