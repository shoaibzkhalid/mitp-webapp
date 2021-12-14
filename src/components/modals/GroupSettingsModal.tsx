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

export function GroupSettingsModal({ closeModal }: ModalProps) {
	const { data } = useSelectedPot()
	const [groupDetails, setGroupDetails] = useState({
		groupTitle: data?.pot.title,
		description: data?.pot.description,
		payInMinimum: data?.pot.minAmount,
		checkInFrequency: data?.pot.checkinCount,
		inviteMode: !data?.pot.inviteAdminMode ? 'anyone' : 'only'
	})

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
		const params = {
			title: groupDetails?.groupTitle,
			description: groupDetails?.description,
			checkinCount: groupDetails?.checkInFrequency,
			minAmount: groupDetails?.payInMinimum,
			visibility: data.pot.visibility,
			inviteAdminMode: groupDetails?.inviteMode === 'anyone' ? false : true
		}
		updatePotMutation.mutate(params)
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

	return (
		<div className="group-details-modal">
			<div className="text-xl font-poppins flex items-center">
				<div className="group-detail-modal__headings mt-8">
					<h2>Group Details</h2>
					<h3 className="group-details-modal__title mt-8 mb-8">
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

			<form
				onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
				}}
			>
				<div className="flex items-center">
					<Input
						className="group-details-modal__input mr-8"
						placeholder="Weekly Workouts"
						value={groupDetails.groupTitle}
						disabled={saveMutation.isLoading}
						setValue={v => setGroupDetails({ ...groupDetails, groupTitle: v })}
					/>
					<div>{`Admin : ${potAdminUser?.firstName}`}</div>
				</div>

				<TextArea
					className="group-details-modal__input group-details-modal__text-area mt-8 mb-8"
					rows={4}
					labelClassName="group-details-modal__input-label mb-8"
					label="Description"
					value={groupDetails.description}
					disabled={saveMutation.isLoading}
					setValue={v => setGroupDetails({ ...groupDetails, description: v })}
				/>
				<div className="flex">
					<SelectInput
						label="Pay Ins Minimum"
						className="group-details-modal__input mt-8 mb-8 mr-1"
						labelClassName="group-details-modal__input-label"
						options={[5, 10, 15, 20, 30, 40, 50].map(i => ({
							label: i === 5 ? `Group Minimum: $${i}` : i + '$',
							value: i
						}))}
						disabled={false}
						value={Number(groupDetails.payInMinimum)}
						setValue={v =>
							setGroupDetails({ ...groupDetails, payInMinimum: v as string })
						}
					/>
					<SelectInput
						className="group-details-modal__input mt-8 mb-8 ml-1"
						label="Min contribution amount"
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
				<h3 className="group-details-modal__title mt-8 mb-8">
					This is the minimum amount a group member pays for missing their
					weekly check in.
				</h3>

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
				<MembersList membersList={data?.users} isAdmin={potUser?.admin} />
				<button
					className="-button -primary -sm mt-4 m-auto"
					disabled={updatePotMutation.isLoading}
					onClick={() => updatePortGroup()}
				>
					Save
				</button>
			</form>
		</div>
	)
}
