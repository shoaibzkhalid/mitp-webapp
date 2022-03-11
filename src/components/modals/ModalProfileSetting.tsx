import { useRef, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '../ui/Input'
import { userState } from '../../state/user'
import { SelectInput } from '../SelectInput'
import { useState } from 'react'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../../state/queryClient'
import dayjs from 'dayjs'
import { ModalStripeConnect } from './ModalStripeConnect'
import { createModalComponent } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ButtonCloseModal } from './ButtonCloseModal'
import { useMediaQuery } from '../../state/react/useMediaQuery'
import { ModalPotConfirmModal } from './ModalPotConfirmModal'

export const ModalProfileSetting = createModalComponent(
	function ModalProfileSetting({ onRequestClose }) {
		const isMobile = useMediaQuery('(max-width: 380px)')
		const { data } = useSelectedPot()
		const [confirmationModal, setConfirmationModal] = useState(false)
		const [stripeModalIsOpen, setStripeModalIsOpen] = useState(false)
		const [error, setError] = useState('')

		const card = useQuery('userCard', async () => {
			return Api.user.getStripeCard()
		})

		const potUser = useMemo(
			() => data?.users.find(u => u.id === userState.user?.id),
			[data]
		)

		const [swearFee, setSwearFee] = useState(potUser?.amount)

		const [user, setUser] = useState({
			firstName: userState.user!.firstName,
			lastName: userState.user!.lastName,
			email: userState.user!.email,
			swearFee: swearFee
		})

		const [fileURL, setFileURL] = useState(userState.user!.avatarUri)
		const [pAmount, setPamount] = useState(data?.pot.minAmount)
		const inputFile = useRef(null)

		const handleChange = event => {
			if (event.target.files.length > 0) {
				const fileURL = URL.createObjectURL(event.target.files[0])
				setFileURL(fileURL)
				uploadAvatarMutation.mutate(event.target.files[0])
			}
		}

		const uploadAvatarMutation = useMutation(
			'update-user-avatar',
			(file: File) => Api.user.updateAvatar(file),
			{
				onSuccess() {
					queryClient.invalidateQueries(['money-pot', data?.pot.id])
					userState.load()
				}
			}
		)

		const saveUserMutation = useMutation('save-user', Api.user.update, {
			onSuccess() {
				userState.load()
			}
		})

		const updatePortGroup = (minAmount: string) => {
			setPamount(minAmount)
			const params = {
				amount: minAmount
			}
			updateMutation.mutate(params)
		}

		const updateMutation = useMutation(
			'updateUserPot',
			async (param: any) =>
				Api.userPots.updateUser(data!.pot.id, userState.user.id, param),
			{
				onSuccess() {
					queryClient.invalidateQueries(['money-pot', data?.pot.id])
				}
			}
		)

		const changeReady = e => {
			const date2 = dayjs()
			let params = {}
			if (e.target.checked) {
				params = {
					amount: pAmount,
					readyUpAt: date2
				}
			} else {
				params = {
					amount: pAmount,
					readyUpAt: null
				}
			}
			updateMutation.mutate(params)
		}

		console.log('check', user)

		return (
			<>
				<ModalStripeConnect
					isOpen={stripeModalIsOpen}
					onRequestClose={() => setStripeModalIsOpen(false)}
					style={{
						content: {
							maxWidth: 420,
							height: isMobile ? 320 : 280,
							top: '30%'
						}
					}}
				/>
				<div className="px-0 sm:px-6">
					<div className="flex items-center justify-center pt-4 text-lg font-poppins">
						<div>
							<div className="text-2xl font-bold">Your Preferences</div>
							<div className="mt-2 text-sm text-gray-400">
								Set your swear jar fee to ready up, & modify how you appear to
								others in {data?.pot.title}
							</div>
						</div>
						<div className="absolute right-2 sm:right-8">
							<ButtonCloseModal onClick={onRequestClose} />
						</div>
					</div>

					<div className="flex justify-center mt-4 tall:mt-6">
						<div className="relative" style={{ width: 120 }}>
							<img
								className="inline-block w-full max-w-xs rounded-full"
								src={fileURL ? fileURL : '/img/ava.png'}
							/>
							<input
								id="upload"
								type="file"
								onChange={handleChange}
								ref={inputFile}
								accept=".jpg, .jpeg, .png"
								style={{ display: 'none' }}
							/>
							<img
								className="absolute inline-block cursor-pointer right-2 -bottom-2"
								src="/img/edit-icon.svg"
								style={{
									maxHeight: 70,
									maxWidth: 70
								}}
								onClick={() => inputFile.current.click()}
							/>
						</div>
					</div>

					<div className="mt-6 tall:mt-10">
						<Input
							placeholder="Enter first name"
							inputClassName="focus:outline-none bg-alabaster p-4"
							inputStyle={{
								color: '#000000'
							}}
							value={user.firstName}
							setValue={v => setUser({ ...user, firstName: v })}
							onBlur={() => saveUserMutation.mutate(user)}
						/>
					</div>

					<div className="mt-6 tall:mt-10">
						<div className="flex items-center justify-between">
							<div className="text-xl font-bold">Swear Jar Fee</div>
							<div className="cursor-pointer text-primary">
								<Link href="/payouts">-My payouts-</Link>
							</div>
						</div>
						<div className="mt-2 text-sm text-gray-400">
							Your swear jar fee is what group members pay when failing to check
							in by the end of the week. Set your swear jar fee below.
						</div>
					</div>

					<div className="mt-6 tall:mt-10">
						<div className="text-md">
							How much is missing a week worth to you?
						</div>
						<div className="flex pt-3">
							<div className="w-full">
								<Input
									placeholder="Enter your swear jar fee"
									inputClassName="focus:outline-none bg-alabaster p-4"
									inputStyle={{
										color: '#000000'
									}}
									value={user.swearFee}
									setValue={v => {
										if (v <= data.pot.minAmount - 1) {
											setError(
												'Amount must be greater than or equal to group minimum $' +
													data?.pot.minAmount
											)
											return
										}
										setError('')
										setUser({ ...user, swearFee: v })
										setSwearFee(v as string)
										updatePortGroup(v as string)
									}}
								/>
								{error && <div className="text-red-400">Error: {error}</div>}
							</div>
						</div>
						<div className="pt-3 text-gray-400 text-md">
							Change anytime: Can be seen by others in your group
						</div>
					</div>

					<div className="flex items-center justify-between mt-6 tall:mt-10">
						<div className="font-bold text-md sm:font-extrabold sm:text-xl">
							Ready up to join pot
						</div>

						<div className="flex items-center">
							<span className="mr-3 text-gray-400">leave/join</span>
							<label className="flex items-center cursor-pointer">
								<div className="relative">
									<input
										checked={!card.isLoading && card.data !== null}
										type="checkbox"
										id="toggleB"
										className="sr-only"
										onChange={e => {
											if (e.target.checked) {
												setStripeModalIsOpen(true)
											}
											changeReady(e)
										}}
									/>
									<div className="block w-24 h-12 bg-gray-600 rounded-full checkbox-bg"></div>
									<div className="absolute w-10 h-10 transition bg-white rounded-full dot left-1 top-1"></div>
								</div>
							</label>
						</div>
					</div>

					<div className="mt-6 tall:mt-10">
						<ul className="list-disc">
							<li>
								{`Members pay in $${potUser?.amount} to the pot for missed week. Check in by Sunday
							to be safe.`}
							</li>
							<li>Profits shared at end of month. Must be in pot to earn.</li>
						</ul>
					</div>

					<div className="mt-6 text-gray-400 tall:mt-10">
						By connecting with paypal you are agreeing to{' '}
						<Link href={'/terms-of-service'}>
							<a target="_blank">
								<span className="text-primary">terms and conditions</span>
							</a>
						</Link>{' '}
						and{' '}
						<Link href={'/privacy-policy'}>
							<a target="_blank">
								<span className="text-primary">privacy policy</span>
							</a>
						</Link>
					</div>

					<div className="flex items-center justify-center mt-6 tall:mt-10">
						<div className="flex items-center justify-center ">
							<Button
								className={'border-red-600'}
								onClick={() => setConfirmationModal(true)}
								kind="tertiary"
							>
								<div className="mr-2">
									<img src="/img/leave.svg" style={{ width: 20, height: 20 }} />
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
				</div>
			</>
		)
	}
)
