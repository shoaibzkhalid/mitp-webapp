import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { Input } from '../../components/Input'
import { SpinnerBig } from '../../components/SpinnerBig'
import { userState } from '../../state/user'
import { selectedPotState } from '../../state/react/useSelectedPot'

function createPotNewState() {
	return observable({
		step: 0,
		title: '',
		description: '',
		checkinCount: 1,
		minAmount: 0,
		userEmail: '',
		userFirstName: ''
	})
}
type PotNewState = ReturnType<typeof createPotNewState>

export default observer(function PotNew() {
	const router = useRouter()

	const state = useMemo(() => createPotNewState(), [])
	const [stepCompleted, setStepCompleted] = useState(false)

	if (!userState.loaded) return <SpinnerBig />

	const steps = useMemo(() => {
		return userState.user
			? [StepRequirements, StepTribute, StepSchedule]
			: [StepRequirements]
	}, [])

	const createPotMutation = useMutation(
		'create-pot',
		async (state: PotNewState) => {
			if (!userState.user) {
				const newUserTokens = await Api.public.createUser({
					email: state.userEmail || null,
					firstName: state.userFirstName,
					lastName: ''
				})

				runInAction(() => {
					userState.tokens = newUserTokens
				})

				await userState.load()
			}

			return Api.userPots.create(state)
		},
		{
			onSuccess(d) {
				runInAction(() => {
					selectedPotState.moneyPotId = d.id
				})

				router.push('/home')
			}
		}
	)

	const nextStep = () => {
		if (state.step < steps.length - 1) {
			return runInAction(() => {
				state.step += 1
			})
		}

		createPotMutation.mutate(state)
	}

	const StepComponent = steps[state.step]

	return (
		<div className="w-full max-w-3xl mx-auto my-10 px-7 pb-7 -card --shadow">
			<StepComponent
				state={state}
				setStepCompleted={setStepCompleted}
			></StepComponent>

			<div className="flex flex-col items-center justify-center mt-7">
				<button
					className="-button -dark"
					disabled={!stepCompleted || createPotMutation.isLoading}
					onClick={nextStep}
				>
					Next
				</button>
			</div>
		</div>
	)
})

interface StepProps {
	state: PotNewState
	setStepCompleted: (completed: any) => any
}
const stepTitleClassName = 'text-center font-bold text-xl mt-7'

const StepRequirements = observer((props: StepProps) => {
	useEffect(
		() => props.setStepCompleted(props.state.title.length > 0),
		[props.state.title, props.state.checkinCount]
	)

	return (
		<>
			<div className="flex justify-center">
				<img src="/img/Target_optimized.gif" style={{ height: '300px' }} />
			</div>

			<div className={stepTitleClassName}>Set check in requirements</div>

			{/* <label className="block mt-7" htmlFor="checkInsPerWeek">
				Check ins per week
			</label>
			<select
				id="checkInsPerWeek"
				className="px-5 py-4 w-full shadow-md rounded-md"
				onChange={e =>
					runInAction(() => {
						props.state.checkinCount = parseInt(e.target.value)
					})
				}
			>
				{new Array(7).fill(0).map((_, i) => {
					return (
						<option
							value={'' + (i + 1)}
							selected={props.state.checkinCount === i + 1}
						>
							{i + 1}x per week
						</option>
					)
				})}
			</select> */}

			<Input
				label="What do they have to do?"
				placeholder="Workout for at least 10 minutes"
				type="text"
				value={props.state.title}
				className="mt-7"
				setValue={v =>
					runInAction(() => {
						props.state.title = v
					})
				}
			></Input>
		</>
	)
})

const StepTribute = observer((props: StepProps) => {
	return (
		<>
			<div className="flex justify-center">
				<img src="/img/Piggy Bank_optimized.gif" style={{ height: '300px' }} />
			</div>

			<div className={stepTitleClassName}>Set the missed week tribute</div>

			<div className="italic text-center py-4 opacity-75">
				Can be changed anytime, and does not become active until members ready
				up.
			</div>

			<label className="block mt-8" htmlFor="selectInput">
				Members pay at least this when they skip weekly check-in
			</label>
			<select
				id="selectInput"
				className="px-5 py-4 w-full shadow-md rounded-md"
				onChange={e =>
					runInAction(() => {
						props.state.minAmount = parseInt(e.target.value)
					})
				}
			>
				{[0, 5, 10, 15, 20, 30, 40, 50].map(v => {
					return (
						<option value={'' + v} selected={props.state.minAmount === v + 1}>
							{v === 0 ? 'No contribution' : `${v}$`}
						</option>
					)
				})}
			</select>
		</>
	)
})

const StepSchedule = observer((props: StepProps) => {
	return (
		<>
			<div className="flex justify-center">
				<img src="/img/Gift_optimized.gif" style={{ height: '300px' }} />
			</div>

			<div className={stepTitleClassName}>Set payout schedule</div>

			<label className="block mt-7" htmlFor="selectInput">
				When does the group share the winnings?
			</label>
			<select
				id="selectInput"
				className="px-5 py-4 w-full shadow-md rounded-md"
				onChange={e =>
					runInAction(() => {
						props.state.minAmount = parseInt(e.target.value)
					})
				}
			>
				<option value="monthly" selected={true}>
					Monthly
				</option>
			</select>
		</>
	)
})

const StepUserInfo = observer(function StepUserInfo(props: StepProps) {
	return (
		<>
			<div className="flex justify-center">
				<img src="/img/Gift_optimized.gif" style={{ height: '300px' }} />
			</div>

			<div className={stepTitleClassName}>Account information</div>

			<Input
				label="Email"
				type="email"
				value={props.state.userEmail}
				className="mt-7"
				setValue={(v: string) =>
					runInAction(() => {
						props.state.userEmail = v
						props.state.userFirstName = v.split('@')[0]
					})
				}
			></Input>

			{/* <Input
				label="First name"
				type="text"
				value={props.state.userFirstName}
				className="mt-7"
				setValue={v =>
					runInAction(() => {
						props.state.userFirstName = v
					})
				}
			></Input> */}
		</>
	)
})
