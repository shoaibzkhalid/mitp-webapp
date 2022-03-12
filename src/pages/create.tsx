import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../api'
import { Input } from '../components/ui/Input'
import { SpinnerBig } from '../components/SpinnerBig'
import { userState } from '../state/user'
import { selectedPotState } from '../state/react/useSelectedPot'
import clsx from 'clsx'
import classes from './create.module.css'
import { useIsMobile } from '../state/react/useIsMobile'

function createPotNewState() {
	return observable({
		step: 0,
		title: '',
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
		return [StepRequirements]
	}, [])

	// Check here
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

	const generateSession = () => {
		createPotMutation.mutate(state)
	}

	const createLaterSession = () => {
		state.title = 'Workout for at least 10 minutes'
		createPotMutation.mutate(state)
	}

	const StepComponent = steps[state.step]

	return (
		<div
			className={clsx(
				classes.onboarding_container,
				'relative sm:h-screen md:overflow-hidden sm:overflow-auto'
			)}
			style={{
				background: '#24008b'
			}}
		>
			<div
				className="flex justify-end pt-4 text-xl text-white cursor-pointer xl:pt-8 2xl:pt-8 sm:px-20 2xl:px-32 lg:pt-8 md:pt-8 sm:pt-8"
				onClick={() => {
					router.push('/home')
				}}
			>
				X
			</div>
			<div
				className={clsx(
					'w-full h-screen flex flex-col text-white sm:flex-row sm:px-14 xl:pt-12 2xl:pt-24 2xl:px-24 lg:pt-10 md:pt-10 pt-0',
					classes.onboarding__card
				)}
			>
				<div className="w-full p-3 sm:w-6/12" style={{ background: '#24008b' }}>
					<StepComponent
						state={state}
						setStepCompleted={setStepCompleted}
						generateSession={generateSession}
						disabled={!stepCompleted || createPotMutation.isLoading}
					></StepComponent>
					<div className="flex justify-center sm:hidden">
						<img
							src={'/img/Target_optimized.gif'}
							style={{ height: '250px' }}
						/>
					</div>
					<div className="absolute flex flex-col items-center w-full sm:w-fit bottom-12 sm:bottom-auto">
						<div className="flex justify-end block w-full mt-4 text-white bottom-20 sm:hidden sm:mt-24 lg:mt-0 sm:absolute">
							<button
								className="flex items-center text-xl xl:text-2xl 2xl:text-3xl xl:pr-34 lg:pr-24 md:pr-16"
								onClick={createLaterSession}
							>
								Do this later
								<svg className="w-3 h-3 h-5 ml-2 fill-current sm:w-5">
									<use xlinkHref="/img/sprite.svg#icon-arrow-right"></use>
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div
					className="relative flex flex-col items-center w-full px-3 sm:w-6/12"
					style={{ background: '#24008b' }}
				>
					<div className="hidden pb-16 sm:block sm:top-10 lg:-top-10">
						<img
							src={'/img/Target_optimized.gif'}
							className={classes.onboarding__image}
						/>
					</div>
					<div className="justify-end hidden w-full mt-4 text-white bottom-20 sm:flex sm:mt-24 lg:mt-0 sm:absolute">
						<button
							className="flex items-center text-xl xl:text-2xl 2xl:text-3xl xl:pr-34 lg:pr-24 md:pr-16"
							onClick={createLaterSession}
						>
							Setup with defaults
							<svg className="w-3 h-3 h-5 ml-2 fill-current sm:w-5">
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
	disabled: boolean
	generateSession: any
}

const StepRequirements = observer((props: StepProps) => {
	const [suggestionDropdown, setSuggestionDropDown] = useState<boolean>(false)
	const [perWeekDropdown, setPerWeekDropDown] = useState<boolean>(false)
	const [perWeekSelection, setPerWeekSelection] = useState('Once per week')
	const isMobile = useIsMobile()

	useEffect(
		() => props.setStepCompleted(props.state.title.length > 0),
		[props.state.title, props.state.checkinCount]
	)

	const openQuickSuggestionMenu = () => {
		setSuggestionDropDown(!suggestionDropdown)
	}

	const updatePerWeekSelection = e => {
		setPerWeekSelection(e.currentTarget.innerHTML)
		runInAction(() => {
			props.state.checkinCount = e.currentTarget.value
		})
		setPerWeekDropDown(!perWeekDropdown)
	}

	const updateTitle = (e: any): void => {
		runInAction(() => {
			props.state.title = e.currentTarget.innerHTML
		})
		setSuggestionDropDown(false)
	}

	return (
		<div>
			<h1 className="text-2xl font-bold lg:text-3xl xl:text-4xl 2xl:text-6xl">
				What activity does your group need to do?
			</h1>
			<p className="font-light text-left text-gray-200 sm:text-lg lg:text-xl 2xl:text-2xl sm:mt-8">
				You're seconds away from getting your own group for accountability with
				friends.
			</p>
			<div className="flex items-center mt-10 xl:mt-14 2xl:mt-28 sm:text-lg lg:text-xl 2xl:text-2xl">
				Set the activity your group does together
				<div
					className={clsx(
						classes.tooltip,
						'sm:text-2xl lg:text-xl 2xl:text-4xl'
					)}
				>
					<img
						src="/img/info.png"
						alt=""
						className={clsx(classes.info_img, 'pl-1')}
					/>
					<span className={classes.tooltiptext}>
						This is the activity your group does together. Type in your own, or
						choose from the dropdown menu
					</span>
				</div>
			</div>
			<div className="relative">
				<Input
					placeholder="Workout for at least 10 minutes"
					type="text"
					className="mt-4 text-white"
					inputClassName={clsx(
						'outline-none pr-10 md:text-lg lg:text-2xl',
						classes.session__text
					)}
					value={props.state.title}
					setValue={v =>
						runInAction(() => {
							props.state.title = v
						})
					}
				></Input>

				<div
					// style={{display: "flex", justifyContent: "flex-end"}}
					className="absolute right-0 flex pr-3 mt-3 cursor-pointer"
					onClick={() => {
						setPerWeekDropDown(!perWeekDropdown)
					}}
				>
					<span>{perWeekSelection}</span>
					<div>
						<svg className="relative create_icon_down__2Hk64 create-page-frequency-arrow">
							<use href="/img/sprite.svg#icon-arrow-down-fat"></use>
						</svg>
					</div>
				</div>
				<div
					className={clsx('flex justify-end absolute right-1 top-20')}
					style={{ color: 'rgb(167, 153, 209);' }}
				>
					<ul
						style={{ padding: '0px 5px' }}
						className={clsx(
							'w-full border-none whitespace-nowrap flex flex-col items-center right-0 mt-3',
							perWeekDropdown ? 'block' : 'hidden',
							classes.per_week_ul
						)}
					>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="1"
						>
							Once per week
						</li>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="2"
						>
							Twice per week
						</li>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="3"
						>
							3x per week
						</li>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="4"
						>
							4x per week
						</li>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="5"
						>
							5x per week
						</li>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="6"
						>
							6x per week
						</li>
						<li
							className={clsx(classes.per_week_menu)}
							onClick={updatePerWeekSelection}
							value="7"
						>
							7x per week
						</li>
					</ul>
				</div>

				<div
					className="cursor-pointer"
					onClick={() => openQuickSuggestionMenu()}
				>
					<svg className={clsx(classes.icon_down, 'absolute')}>
						<use xlinkHref="/img/sprite.svg#icon-arrow-down-fat"></use>
					</svg>
				</div>
				<ul
					id="quick-suggestion"
					className={clsx(
						classes.quick_suggestion,
						'absolute w-full mt-1 py-2',
						suggestionDropdown ? classes.open : ''
					)}
				>
					<li className={classes.menu_option} onClick={updateTitle}>
						Run, jog, or walk for at least a mile
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Run, jog, or walk for at least half a mile
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Complete a workout at the gym
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Get out of bed before 7am
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Cook a healthy meal weekly
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Learn something weekly
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Language learning weekly
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Weekly Productivity, study, work, and solve difficult problems
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Weekly Programming, build and share your code
					</li>
					<li className={classes.menu_option} onClick={updateTitle}>
						Weekly Studying, complete an hour of studying
					</li>
				</ul>

				<button
					className={clsx(
						`absolute ${
							!isMobile && suggestionDropdown
								? 'top-65'
								: `${
										isMobile && suggestionDropdown
											? 'top-96 mt-14'
											: `${isMobile ? 'top-20' : 'top-1'}`
								  } `
						} px-4 text-center py-4 rounded-md sm:mt-10 shadow-md lg:mt-16 xl:mt-24 2xl:mt-24 lg:text-xl xl:text-2xl`,
						classes.onboarding__button
					)}
					disabled={props.disabled}
					onClick={props.generateSession}
				>
					Generate session
				</button>
			</div>
		</div>
	)
})
