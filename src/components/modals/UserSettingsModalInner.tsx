import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { AppEnv } from '../../env'
import { queryClient } from '../../state/queryClient'
import { userState } from '../../state/user'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { Input } from '../Input'
import { SelectInput } from '../SelectInput'
import { ModalProps } from './types'

export function UserSettingsModalInner({ closeModal }: ModalProps) {
	const [user, setUser] = useState({
		firstName: userState.user!.firstName,
		lastName: userState.user!.lastName,
		email: userState.user!.email
	})

	const saveMutation = useMutation('save-user', Api.user.update, {
		onSuccess() {
			userState.load()
		}
	})

	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>Account Settings</div>
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
					saveMutation.mutate(user)
				}}
			>
				<div className="grid gap-4 grid-cols-2">
					<Input
						label="First Name"
						value={user.firstName}
						disabled={saveMutation.isLoading}
						setValue={v => setUser({ ...user, firstName: v })}
					/>
					<Input
						label="Last Name"
						value={user.lastName}
						disabled={saveMutation.isLoading}
						setValue={v => setUser({ ...user, lastName: v })}
					/>
					<Input
						label="Email"
						value={user.email}
						disabled={saveMutation.isLoading}
						setValue={v => setUser({ ...user, email: v })}
					/>
				</div>

				<button
					className="-button -primary -sm mt-4"
					disabled={saveMutation.isLoading}
				>
					Save
				</button>
			</form>

			<PotLink />
			<PotSettings />
			<PotAdminSettings />
			<UserLogout />
		</>
	)
}

const PotLink = observer(function PotLink() {
	const selectedPot = useSelectedPot()
	if (!selectedPot.data) return null

	return (
		<>
			<div className="text-xl font-poppins flex items-center mt-6 mb-2">
				Pot Link
			</div>

			<Input
				value={AppEnv.webBaseUrl + '/pot/' + selectedPot.data.pot.slug}
				disabled={true}
			/>
		</>
	)
})

const PotSettings = observer(function PotSettings() {
	const selectedPot = useSelectedPot()
	if (!selectedPot.data) return null

	const user = selectedPot.data.users.find(u => u.id === userState.user?.id)
	if (!user) return null

	const [pl, setPl] = useState({
		amount: user.amount
	})

	const updateMutation = useMutation(
		'updateUserPot',
		async (data: typeof pl) =>
			Api.userPots.updateUser(selectedPot.data!.pot.id, user.id, data),
		{
			onSuccess() {
				queryClient.invalidateQueries(['money-pot', selectedPot.data?.pot.id])
			}
		}
	)

	return (
		<>
			<div className="text-xl font-poppins flex items-center mt-6 mb-2">
				Pot Settings
			</div>

			<form
				onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
					updateMutation.mutate(pl)
				}}
			>
				<div className="grid gap-4 grid-cols-2">
					<SelectInput
						label="Contribution amount"
						disabled={false}
						options={[0, 5, 10, 15, 20, 30, 40, 50]
							.filter(
								v =>
									v >= parseInt(selectedPot.data!.pot.minAmount) ||
									v === parseInt(pl.amount)
							)
							.map(i => ({
								label: i === 0 ? 'No contribution' : i + '$',
								value: i + ''
							}))}
						value={pl.amount}
						setValue={v => setPl({ ...pl, amount: v })}
					/>
				</div>

				<button
					className="-button -primary -sm mt-4"
					disabled={updateMutation.isLoading}
				>
					Save
				</button>
			</form>
		</>
	)
})

const PotAdminSettings = observer(function PotAdminSettings() {
	const selectedPot = useSelectedPot()

	if (!selectedPot.data || !selectedPot.data.isAdmin) return null

	const [pot, setPot] = useState({
		title: selectedPot.data.pot.title,
		description: selectedPot.data.pot.description,
		checkinCount: selectedPot.data.pot.checkinCount,
		minAmount: selectedPot.data.pot.minAmount,
		visibility: selectedPot.data.pot.visibility
	})

	const updatePotMutation = useMutation(
		'updatePot',
		async (data: typeof pot) =>
			Api.userPots.update(selectedPot.data!.pot.id, data),
		{
			onSuccess() {
				queryClient.invalidateQueries(['money-pot', selectedPot.data?.pot.id])
			}
		}
	)

	return (
		<>
			<div className="text-xl font-poppins flex items-center mt-6 mb-2">
				Pot Admin Settings
			</div>

			<form
				onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
					updatePotMutation.mutate(pot)
				}}
			>
				<div className="grid gap-4 grid-cols-2">
					<Input
						label="Title"
						value={pot.title}
						disabled={false}
						setValue={v => setPot({ ...pot, title: v })}
					/>
					<Input
						label="Description"
						value={pot.description}
						disabled={false}
						setValue={v => setPot({ ...pot, description: v })}
					/>
					<SelectInput
						label="Checkin count"
						disabled={false}
						options={new Array(7).fill(0).map((_, i) => ({
							label: i + 1 + '',
							value: i + 1 + ''
						}))}
						value={pot.checkinCount + ''}
						setValue={v => setPot({ ...pot, checkinCount: parseInt(v) })}
					/>
					<SelectInput
						label="Min contribution amount"
						disabled={false}
						options={[0, 5, 10, 15, 20, 30, 40, 50].map(i => ({
							label: i === 0 ? 'No minimum value' : i + '$',
							value: i + ''
						}))}
						value={pot.minAmount}
						setValue={v => setPot({ ...pot, minAmount: v })}
					/>
				</div>

				<button
					className="-button -primary -sm mt-4"
					disabled={updatePotMutation.isLoading}
				>
					Save
				</button>
			</form>
		</>
	)
})

const UserLogout = observer(function UserLogout() {
	return (
		<>
			<div className="text-xl font-poppins flex items-center mt-6 mb-2">
				Logout from MITP
			</div>

			<button
				className="-button -primary -sm mt-4"
				onClick={() => {
					runInAction(() => {
						userState.tokens.accessToken = ''
						userState.tokens.refreshToken = ''
					})
					userState.save()
					window.location.assign('/')
				}}
			>
				Logout
			</button>
		</>
	)
})
