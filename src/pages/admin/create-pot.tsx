import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { SpinnerBig } from '../../components/SpinnerBig'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { userState } from '../../state/user'
import { ApiPot } from '../../types'
import { getPotPosterUrl } from '../../utils/common'

const emptyPot = {
	title: '',
	description: '',
	checkinCount: 3,
	minAmount: 0
}

export default observer(function AdminCreatePot() {
	if (
		!userState.loaded ||
		!userState.user ||
		!userState.user.permissions.includes(1)
	)
		return <SpinnerBig />

	const [potsHistory, setPotsHistory] = useState([] as ApiPot[])
	const [pot, setPot] = useState(emptyPot)
	const create = useMutation('createAdminPot', async () => {
		const p = await Api.post<ApiPot>('admin/money-pot', pot)
		setPotsHistory([p, ...potsHistory])
	})

	return (
		<div className="max-w-sm mx-auto">
			<h1 className="text-xl my-5">Create pot (admin)</h1>

			<div className="border rounded-xl shadow bg-gray-200 p-3">
				<Input
					placeholder="Title"
					value={pot.title}
					setValue={v => setPot({ ...pot, title: v })}
				/>
				<div className="mt-3"></div>
				<Input
					placeholder="Description"
					value={pot.description}
					setValue={v => setPot({ ...pot, description: v })}
				/>
				<div className="flex mt-3">
					<Button
						kind="secondary"
						onClick={() => {
							setPot(emptyPot)
						}}
					>
						Reset
					</Button>
					<div className="ml-auto"></div>
					<Button
						onClick={() => create.mutate()}
						disabled={pot.title.length < 3 || create.isLoading}
					>
						Submit
					</Button>
				</div>
			</div>

			<h1 className="text-xl mt-5">Pots created this session</h1>
			<p className="mb-5 opacity-70">
				This list will clear if the page is reloaded (but the pots are not lost)
			</p>

			{potsHistory.map(pot => {
				return (
					<div className="border rounded-xl shadow bg-gray-200 p-3 mb-5">
						<div>{pot.title}</div>
						<div>
							<a
								href={getPotPosterUrl(pot)}
								target="_blank"
								className="text-primary underline"
							>
								Open poster
							</a>
						</div>
					</div>
				)
			})}
		</div>
	)
})
