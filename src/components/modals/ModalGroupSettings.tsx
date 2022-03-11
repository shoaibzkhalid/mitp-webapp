import { useState, useMemo } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { userState } from '../../state/user'
import { Input } from '../ui/Input'
import { TextArea } from '../ui/TextArea'
import { SelectInput } from '../SelectInput'
import ButtonsSwitch from '../buttonsSwitch/ButtonsSwitch'
import MembersList from '../membersList/MembersList'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { queryClient } from '../../state/queryClient'
import clsx from 'clsx'
import classes from './../../pages/create.module.css'
import { createModalComponent } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ButtonCloseModal } from './ButtonCloseModal'
import { ModalPotConfirmModal } from './ModalPotConfirmModal'

export const ModalGroupSettings = createModalComponent(
	function ModalGroupSettings({ onRequestClose }) {
		const { data } = useSelectedPot()
		const [confirmationModal, setConfirmationModal] = useState(false)

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
				// slug: 'test'
			})
		}

		const updatePotMutation = useMutation(
			'updatePot',
			async (params: any) => Api.userPots.update(data!.pot.id, params),
			{
				onSuccess() {
					queryClient.invalidateQueries(['money-pot', data?.pot.id])
					onRequestClose()
				}
			}
		)

		const isAdmin = potUser?.admin

		return (
			<div className="group-details-modal">
				{isAdmin ? (
					<>
						<div className="flex items-center text-xl font-poppins">
							<div className="mt-8 group-detail-modal__headings">
								<div className="text-2xl font-bold">Group Details</div>
								<div className="flex items-center mt-6">
									<h3 className="group-details-modal__title">
										Title of the group
									</h3>
									<div className="flex items-center sm:text-lg lg:text-xl 2xl:text-2xl">
										<div
											className={clsx(
												classes.tooltip,
												'sm:text-2xl lg:text-xl 2xl:text-4xl'
											)}
										>
											<img
												src="/img/info-black.svg"
												alt=""
												className={clsx(classes.group_info_img, 'pl-1')}
											/>
											<span
												className={clsx(
													classes.tooltiptexthome,
													'right-0 left-0 border rounded bg-white text-black dark:bg-dark dark:text-white'
												)}
											>
												This is the activity members of your group must do once
												a week.
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="ml-auto">
								<ButtonCloseModal onClick={onRequestClose} />
							</div>
						</div>
					</>
				) : (
					<div className="">
						<div className="flex justify-end">
							<ButtonCloseModal onClick={onRequestClose} />
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
								<div className="mt-8 ">
									<h3 className={`mb-2  ${!isAdmin && 'text-gray-400'}`}>
										Title of the group
									</h3>
								</div>
							)}
							<div className="flex items-center">
								{isAdmin ? (
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
										inputStyle={{ color: '#31445b' }}
									/>
								) : (
									<h3 className="group-details-modal__title">
										{groupDetails.groupTitle}
									</h3>
								)}
								{isAdmin && <div>{`Admin : ${potAdminUser?.firstName}`}</div>}
							</div>

							{isAdmin ? (
								<TextArea
									className="mt-8 mb-2 group-details-modal__input group-details-modal__text-area"
									rows={4}
									labelClassName="group-details-modal__input-label mb-2 text-white"
									label="Description"
									placeholder="Specific activities, duration, or location requirements for check ins"
									value={groupDetails.description}
									disabled={saveMutation.isLoading}
									setValue={v =>
										setGroupDetails({ ...groupDetails, description: v })
									}
								/>
							) : (
								<div className="mt-8 ">
									<h3 className={`mb-2  ${!isAdmin && 'text-gray-400'}`}>
										Description
									</h3>
									<h3 className="group-details-modal__title">
										{groupDetails.description}
									</h3>
								</div>
							)}

							<div className="flex">
								<SelectInput
									borders={true}
									label="Minimum swear jar fee"
									className="mt-6 mb-6 mr-1 group-details-modal__input"
									labelClassName="group-details-modal__input-label"
									options={[0, 5, 10, 15, 20, 30, 40, 50].map(i => ({
										label: i === 0 ? `Minimum: $${i}` : i + '$',
										value: i
									}))}
									disabled={isAdmin ? false : true}
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
									className="mt-6 mb-6 ml-1 group-details-modal__input"
									label="Check ins required per week"
									labelClassName="group-details-modal__input-label"
									disabled={isAdmin ? false : true}
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
								<h3 className="mb-8 group-details-modal__title">
									This is the minimum amount a group member pays for missing
									their weekly check in to the group. All group members can set
									their swear jar fee at the group minimum or higher.
								</h3>
							)}

							{isAdmin && (
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
							)}

							<div className="flex items-center justify-center mt-6 tall:mt-10">
								<div className="flex items-center justify-center ">
									<Button
										className={'border-red-600'}
										onClick={() => setConfirmationModal(true)}
										kind="tertiary"
									>
										<div className="mr-2">
											<img
												src="/img/leave.svg"
												style={{ width: 20, height: 20 }}
											/>
										</div>
										<div className={'text-red-600'}>Leave/delete this pot</div>
									</Button>
								</div>
							</div>

							<ModalPotConfirmModal
								isOpen={confirmationModal}
								onRequestClose={() => setConfirmationModal(false)}
								openSuccessModal={() => setConfirmationModal(false)}
								style={{ content: { position: 'relative' } }}
							/>

							{isAdmin && (
								<>
									<MembersList
										membersList={data?.users}
										isAdmin={potUser?.admin}
									/>
									<div className="flex justify-center mt-10">
										<Button
											disabled={updatePotMutation.isLoading}
											onClick={() => updatePortGroup()}
										>
											Save
										</Button>
									</div>
								</>
							)}
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
)
