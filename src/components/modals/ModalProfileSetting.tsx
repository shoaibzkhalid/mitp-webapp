import { useRef, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '../ui/Input'
import { userState } from '../../state/user'
import { SelectInput } from '../SelectInput'
import { useState } from 'react'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../../state/queryClient'
import dayjs from 'dayjs'
import { ModalStripeConnect } from './ModalStripeConnect'
import { createModalComponent } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ButtonCloseModal } from './ButtonCloseModal'

export const ModalProfileSetting = createModalComponent(
	function ModalProfileSetting({ onRequestClose }) {
		const { data } = useSelectedPot()
		const [stripeModalIsOpen, setStripeModalIsOpen] = useState(false)

		const [user, setUser] = useState({
			firstName: userState.user!.firstName,
			lastName: userState.user!.lastName,
			email: userState.user!.email
		})

		const [fileURL, setFileURL] = useState(userState.user!.avatarUri)
		const [pAmount, setPamount] = useState(data?.pot.minAmount)
		const inputFile = useRef(null)

		const potUser = useMemo(
			() => data?.users.find(u => u.id === userState.user?.id),
			[data]
		)

		const [swearFee, setSwearFee] = useState(potUser?.amount)

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

		return (
			<>
				<ModalStripeConnect
					isOpen={stripeModalIsOpen}
					onRequestClose={() => setStripeModalIsOpen(false)}
					style={{
						content: {
							width: 420,
							height: 280,
							top: '30%'
						}
					}}
				/>
				<div className="px-0 sm:px-6">
					<div className="text-lg font-poppins flex items-center justify-center pt-4">
						<div className="">
							Manage ready up status & modify how you appear to others in your
							group {data?.pot.title}
						</div>
						<div className="absolute right-2 sm:right-8">
							<ButtonCloseModal onClick={onRequestClose} />
						</div>
					</div>

					<div className="flex justify-center mt-10">
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
								className="inline-block absolute right-2 -bottom-2 cursor-pointer"
								src="/img/edit-icon.svg"
								style={{
									maxHeight: 70,
									maxWidth: 70
								}}
								onClick={() => inputFile.current.click()}
							/>
						</div>
					</div>

					<div className="mt-10">
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

					<div className="mt-10">
						<div className="flex items-center justify-between">
							<div className="font-bold text-xl">Swear Jar Fee</div>
							<div className="text-primary cursor-pointer">
								<Link href="/payouts">-My payouts-</Link>
							</div>
						</div>
						<div className="text-gray-400 text-sm mt-2">
							How much is missing a week worth to you?
						</div>
					</div>

					<div className="mt-10">
						<div className="text-md">
							Group members pay this to the pot when failing to check in by end
							of week.
						</div>
						<div className="pt-3 flex">
							<div className="w-9/12">
								<SelectInput
									height="undefined"
									selectClassName="bg-alabaster p-4 focus:outline-none"
									options={[0, 5, 10, 15, 20, 30, 40, 50].map(i => ({
										label: i === 0 ? `Group Minimum: $${i}` : i + '$',
										value: i + ''
									}))}
									value={potUser?.amount}
									setValue={v => {
										setSwearFee(v as string)
										updatePortGroup(v as string)
									}}
								/>
							</div>
							<div className="w-3/12 flex">
								<Button
									className="w-full"
									onClick={() => {
										updatePortGroup(swearFee)
										onRequestClose()
									}}
								>
									Save
								</Button>
							</div>
						</div>
						<div className="text-gray-400 text-md pt-3">
							Change anytime: Can be seen by others in your group
						</div>
					</div>

					<div className="mt-10 flex items-center justify-between">
						<div className="text-md font-bold sm:font-extrabold sm:text-xl">
							Ready up to join pot
						</div>
						<div className="flex items-center">
							<span className="mr-3 text-gray-400">leave/join</span>
							<label className="flex items-center cursor-pointer">
								<div className="relative">
									<input
										checked={potUser.readyUpAt !== null ? true : false}
										type="checkbox"
										id="toggleB"
										className="sr-only"
										onChange={e => {
											setStripeModalIsOpen(true)
											changeReady(e)
										}}
									/>
									<div className="checkbox-bg block bg-gray-600 w-24 h-12 rounded-full"></div>
									<div className="dot absolute left-1 top-1 bg-white w-10 h-10 rounded-full transition"></div>
								</div>
							</label>
						</div>
					</div>

					<div className="mt-10">
						<ul className="list-disc">
							<li>
								{`Members pay in $${potUser?.amount} to the pot for missed week. Check in by Sunday
							to be safe.`}
							</li>
							<li>Profits shared at end of month. Must be in pot to earn.</li>
						</ul>
					</div>

					<div className="text-gray-400 mt-10">
						By connecting with paypal you are agreeing to{' '}
						<span className="text-primary">terms and conditions</span> and{' '}
						<span className="text-primary">privacy policy</span>
					</div>
				</div>
			</>
		)
	}
)
