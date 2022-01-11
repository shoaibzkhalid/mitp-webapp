import { useState, useMemo } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { userState } from '../../state/user'
import { Input } from '../Input'
import { TextArea } from '../TextArea'
import { SelectInput } from '../SelectInput'
import { ModalProps } from './types'
import ButtonsSwitch from '../buttonsSwitch/ButtonsSwitch'
import MembersList from '../membersList/MembersList'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { queryClient } from '../../state/queryClient'
import clsx from 'clsx'

export function GroupSettingsModal({ closeModal }: ModalProps) {
	const { data } = useSelectedPot()
	const [groupDetails, setGroupDetails] = useState({
		groupTitle: data?.pot.title,
		description: data?.pot.description,
		payInMinimum: data?.pot.minAmount,
		checkInFrequency: data?.pot.checkinCount,
		inviteMode: !data?.pot.inviteAdminMode ? 'anyone' : 'only',
		timeZone: data?.pot.timeZone
	})

	const [groupDetailsIsSelected, setGroupDetailsIsSelected] =
		useState<boolean>(true)

	const potAdminUser = useMemo(() => data.users.find(u => u.admin), [data])

	const potUser = useMemo(
		() => data?.users.find(u => u.id === userState.user?.id),
		[data]
	)

	const frequencyOptions = [
		'1x per week',
		'2x per week',
		'3x per week',
		'4x per week',
		'5x per week',
		'6x per week',
		'7x per week'
	]

	const saveMutation = useMutation('save-user', Api.user.update, {
		onSuccess() {
			userState.load()
		}
	})

	const updatePortGroup = () => {
		updatePotMutation.mutate({
			title: groupDetails?.groupTitle,
			description: groupDetails?.description,
			checkinCount: groupDetails?.checkInFrequency,
			minAmount: groupDetails?.payInMinimum,
			visibility: data.pot.visibility,
			inviteAdminMode: groupDetails?.inviteMode === 'anyone' ? false : true,
			timeZone: groupDetails?.timeZone
		})
	}

	const updatePotMutation = useMutation(
		'updatePot',
		async (params: any) => Api.userPots.update(data!.pot.id, params),
		{
			onSuccess() {
				queryClient.invalidateQueries(['money-pot', data?.pot.id])
				closeModal()
			}
		}
	)

	const isAdmin = potUser?.admin

	return (
		<div className="group-details-modal">
			{isAdmin ? (
				<>
					<div className="text-xl font-poppins flex items-center">
						<div className="group-detail-modal__headings mt-8">
							<h2>Group Details</h2>
							<h3 className="group-details-modal__title mt-8">
								Title of the group
							</h3>
						</div>
						<div className="ml-auto">
							<button
								className="-button -round shadow-lg text-sm"
								onClick={() => closeModal()}
							>
								x
							</button>
						</div>
					</div>
				</>
			) : (
				<div className="">
					<div className="flex justify-end">
						<button
							className="rounded-full text-sm bg-gray-200 px-3 py-2"
							onClick={() => closeModal()}
						>
							x
						</button>
					</div>
					<div className="flex mt-4 mb-8">
						<div
							className={clsx(
								'p-2 w-2/4 font-bold text-xl text-center cursor-pointer border-b-4',
								groupDetailsIsSelected
									? 'border-primary text-primary'
									: 'border-gray-400 text-gray-400'
							)}
							onClick={() => {
								setGroupDetailsIsSelected(true)
							}}
						>
							Group Details
						</div>
						<div
							className={clsx(
								'p-2 w-2/4 font-bold text-xl text-center cursor-pointer border-b-4 border-gray-400 text-gray-400',
								!groupDetailsIsSelected
									? 'border-primary text-primary'
									: 'border-gray-400 text-gray-400'
							)}
							onClick={() => {
								setGroupDetailsIsSelected(false)
							}}
						>
							Group Members
						</div>
					</div>
				</div>
			)}

			<form
				className="mt-2"
				onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
				}}
			>
				{groupDetailsIsSelected ? (
					<>
						{!isAdmin && (
							<div className="group-detail-modal__headings mt-8">
								<h3 className="group-details-modal__title mb-2">
									Title of the group
								</h3>
							</div>
						)}
						<div className="flex items-center">
							<Input
								className={clsx(
									'group-details-modal__input',
									isAdmin ? 'mr-8' : ''
								)}
								placeholder="Weekly Workouts"
								value={groupDetails.groupTitle}
								disabled={saveMutation.isLoading}
								setValue={v =>
									setGroupDetails({ ...groupDetails, groupTitle: v })
								}
							/>
							{isAdmin && <div>{`Admin : ${potAdminUser?.firstName}`}</div>}
						</div>

						<TextArea
							className="group-details-modal__input group-details-modal__text-area mt-8 mb-2"
							rows={4}
							labelClassName="group-details-modal__input-label mb-2 text-white"
							label="Description"
							value={groupDetails.description}
							disabled={saveMutation.isLoading}
							setValue={v =>
								setGroupDetails({ ...groupDetails, description: v })
							}
						/>
						<div className="flex">
							<SelectInput
								borders={true}
								label="Minimum swear jar fee"
								className="group-details-modal__input mt-6 mb-6 mr-1"
								labelClassName="group-details-modal__input-label"
								options={[0, 5, 10, 15, 20, 30, 40, 50].map(i => ({
									label: i === 0 ? `Minimum: $${i}` : i + '$',
									value: i
								}))}
								disabled={false}
								value={Number(groupDetails.payInMinimum)}
								setValue={v =>
									setGroupDetails({
										...groupDetails,
										payInMinimum: v as string
									})
								}
							/>
							<SelectInput
								borders={true}
								className="group-details-modal__input mt-6 mb-6 ml-1"
								label="Check ins required per week"
								labelClassName="group-details-modal__input-label"
								disabled={false}
								options={frequencyOptions.map((i, index: number) => ({
									label: i,
									value: index + 1
								}))}
								value={groupDetails.checkInFrequency}
								setValue={v =>
									setGroupDetails({
										...groupDetails,
										checkInFrequency: v as number
									})
								}
							/>
						</div>

						{isAdmin && (
							<h3 className="group-details-modal__title mb-8">
								This is the minimum amount a group member pays for missing their
								weekly check in to the group. All group members can set their
								swear jar fee at the group minimum or higher.
							</h3>
						)}

						<ButtonsSwitch
							button1Data="Anyone can invite"
							button2Data="Only I can invite"
							setInviteMode={v =>
								setGroupDetails({
									...groupDetails,
									inviteMode: v
								})
							}
							inviteMode={groupDetails?.inviteMode}
						/>
						{isAdmin && (
							<MembersList membersList={data?.users} isAdmin={potUser?.admin} />
						)}
						<div className="flex justify-center mt-10">
							<button
								className="bg-primary px-20 py-3 text-white rounded-lg"
								disabled={updatePotMutation.isLoading}
								onClick={() => updatePortGroup()}
							>
								Save
							</button>
						</div>
					</>
				) : (
					<>
						<MembersList membersList={data?.users} isAdmin={potUser?.admin} />
					</>
				)}
			</form>
		</div>
	)
}
