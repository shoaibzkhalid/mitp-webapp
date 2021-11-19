import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../api'
import { Input } from '../components/Input'
import { SpinnerBig } from '../components/SpinnerBig'
import { userState } from '../state/user'
import { selectedPotState } from '../state/react/useSelectedPot'
import clsx from 'clsx'
import classes from './create.module.css'

function createPotNewState() {
	return observable({
		step: 0,
		title: 'Workout for at least 10 minutes',
		description: '',
		checkinCount: 1,
		minAmount: 0
	})
}
type PotNewState = ReturnType<typeof createPotNewState>

export default observer(function PotNew() {
	const router = useRouter()

	const state = useMemo(() => createPotNewState(), [])
	const [stepCompleted, setStepCompleted] = useState(false)

	if (!userState.loaded) return <SpinnerBig />

	const steps = useMemo(() => {
		// return userState.user ? [StepRequirements, StepTribute] : [StepRequirements]
		return [StepRequirements]
	}, [])

	const createPotMutation = useMutation(
		'create-pot',
		async (state: PotNewState) => {
			if (!userState.user) {
				const newUserTokens = await Api.public.createUser({
					email: null,
					firstName: '',
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
	const stepImg = [
		'/img/Target_optimized.gif',
		'/img/Piggy Bank_optimized.gif',
		'/img/Piggy Bank_optimized.gif',
		'/img/Gift_optimized.gif'
	]
	return (
		<div className="relative sm:h-screen">
			<div
				className={clsx(
					'w-full h-full flex flex-col pt-8 px-4 pb-4 text-white sm:flex-row sm:pt-14 sm:px-14 sm:pb-8 xl:pb-4 xl:pt-16 2xl:pt-32 2xl:px-32 2xl:pb-20',
					classes.onboarding__card
				)}
			>
				<div className="w-full p-3 sm:w-6/12">
					<StepComponent
						state={state}
						setStepCompleted={setStepCompleted}
					></StepComponent>
					<div className="flex justify-center sm:hidden">
						<img src={stepImg[state.step]} style={{ height: '350px' }} />
					</div>
					<div className="flex justify-center">
						{/* {!userState.user ? ( */}
						<button
							className={clsx(
								'w-6/12 text-center py-4 rounded-md mt-10 shadow-md lg:mt-16 xl:mt-20 2xl:mt-24 lg:text-xl xl:text-2xl',
								classes.onboarding__button
							)}
							disabled={!stepCompleted || createPotMutation.isLoading}
							onClick={nextStep}
						>
							Generate session
						</button>
					</div>
				</div>

				<div className="w-full relative flex flex-col items-center justify-center px-3 sm:w-6/12">
					<div className="flex absolute justify-center hidden sm:block sm:top-10 lg:-top-10">
						<img
							src={stepImg[state.step]}
							className={classes.onboarding__image}
						/>
					</div>
					<div className="w-full flex justify-end mt-4 bottom-8 sm:mt-24 sm:absolute">
						<button
							className="flex items-center text-xl xl:text-2xl 2xl:text-3xl"
							onClick={nextStep}
						>
							Do this later
							<svg className="ml-2 w-3 h-3 fill-current sm:w-5 h-5">
								<use xlinkHref="/img/sprite.svg#icon-arrow-right"></use>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
})

interface StepProps {
	state: PotNewState
	setStepCompleted: (completed: any) => any
}

const StepRequirements = observer((props: StepProps) => {
	useEffect(
		() => props.setStepCompleted(props.state.title.length > 0),
		[props.state.title, props.state.checkinCount]
	)

	return (
		<div>
			<h1 className="text-3xl font-bold lg:text-4xl xl:text-5xl 2xl:text-7xl">
				Create your Session
			</h1>
			<p className="mt-4 text-left sm:text-xl lg:text-2xl 2xl:text-3xl sm:mt-10">
				Get your own private group chat for accountability with your friends and
				family.
			</p>
			<div className="mt-10 xl:mt-14 2xl:mt-28 sm:text-2xl lg:text-xl 2xl:text-4xl">
				What do they have to do?
			</div>
			<Input
				placeholder="Workout for at least 10 minutes"
				type="text"
				className="mt-8 text-white"
				inputClassName={clsx('outline-none sm:text-2xl', classes.session__text)}
				setValue={v =>
					runInAction(() => {
						props.state.title = v
					})
				}
			></Input>
		</div>
	)
})

const StepTribute = observer((props: StepProps) => {
	return (
		<>
			<h1 className="text-3xl font-bold lg:text-5xl 2xl:text-7xl">
				Set the missed week tribute
			</h1>

			<div className="italic py-4 opacity-75 sm:text-xl lg:text-2xl 2xl:text-3xl sm:mt-10">
				Can be changed anytime, and does not become active until members ready
				up.
			</div>

			<label
				className="block mt-8 sm:text-2xl lg:text-xl 2xl:text-4xl"
				htmlFor="selectInput"
			>
				Members pay at least this when they skip weekly check-in
			</label>
			<select
				id="selectInput"
				className={clsx(
					'px-5 py-4 mt-4 w-full shadow-md rounded-md sm:text-2xl',
					classes.onboarding__select
				)}
				onChange={e =>
					runInAction(() => {
						props.state.minAmount = parseInt(e.target.value)
					})
				}
			>
				{[0, 5, 10, 15, 20, 30, 40, 50].map(v => {
					return (
						<option value={'' + v} selected={props.state.minAmount === v}>
							{v === 0 ? 'No contribution' : `${v}$`}
						</option>
					)
				})}
			</select>
		</>
	)
})
