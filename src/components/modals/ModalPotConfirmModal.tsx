import { createModalComponent } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useMemo } from 'react'
import { userState } from '../../state/user'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { useRouter } from 'next/router'
import { runInAction } from 'mobx'
import { useMutation } from 'react-query'
import { queryClient } from '../../state/queryClient'
import { Api } from '../../api'

export const ModalPotConfirmModal = createModalComponent<{
	openSuccessModal: () => any
}>(function ModalPotConfirmModal(props) {
	const pot = useSelectedPot()
	const router = useRouter()
	const selectedPot = pot?.data
	const potAdminUser = useMemo(
		() => pot.data?.users.find(u => u.admin),
		[pot.data]
	)

	const showPotDelete = potAdminUser?.id === userState.user?.id
	const btnTxt = showPotDelete ? 'Delete' : 'Leave'

	const potUser = useMemo(
		() => pot.data?.users.find(u => u.id === userState.user?.id),
		[pot.data]
	)

	const leaveDeletePotMutation = useMutation(
		'kickPotUser',
		async (params: any) => {
			try {
				if (showPotDelete) {
					Api.userPots.deletePot(pot.data.pot.id)
					return
				}
				Api.userPots.deletePotUser(pot.data.pot.id, params.userId)
			} catch (e) {
				console.log('error', e)
			}
		},
		{
			onSuccess() {
				console.log('success')
				queryClient.invalidateQueries(['money-pot', selectedPot?.pot.id])
			}
		}
	)

	const leaveDeletePot = () => {
		const params = {
			userId: potUser.id
		}
		try {
			leaveDeletePotMutation.mutate(params)

			runInAction(() => {
				userState.resetNotify()
			})
			router.push('/home')
		} catch (e) {
			console.log('error', e)
		}
	}

	return (
		<div className="flex flex-col px-8 py-4">
			<div>
				Are you sure you want to {btnTxt.toLowerCase()} this group? Once you{' '}
				{btnTxt.toLowerCase()}, you will no longer be able to join this group
				again.
			</div>
			<div className="flex justify-between align-center w-ful">
				<Button
					className={'mt-3 border-red-600'}
					onClick={() => leaveDeletePot()}
					kind="tertiary"
				>
					<div className={'text-red-600'}>{btnTxt}</div>
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
