import clsx from 'clsx'
import * as intro from 'intro.js'
import 'intro.js/introjs.css'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { userState } from '../../state/user'

interface HowItWorksProps {
	label: string
	enabled?: any
}
export function HowItWorksIntro(props: HowItWorksProps) {
	const pots = useQuery('userPots', Api.userPots.list)

	const options =
		pots.data?.map(pot => ({
			value: pot.moneyPot!.id,
			label: (pot.moneyPot!.title || 'No title') as any
		})) ?? []

	function steps() {
		return [
			{
				element: document.getElementById('checkin_div'),
				title: 'Check In',
				intro: `Check in before the week is up with photo proof you've completed the activity. (Screenshots work too)`,
				tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white')
			},
			{
				element: document.getElementById('weekly_overview'),
				title: 'Weekly Overview',
				intro: `In Weekly Overview you will see all check ins by your group. View others photo logs, or check your own. All members must complete their check ins before the end of the week.`,
				tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white')
			},
			{
				element: document.getElementById('walkthrough_pot'),
				intro: `Those that fail to complete their weekly check ins pay in to the group pot. The amount they pay in for failing the week can be changed by you (the group admin) in your pot settings. We gave you $5 in your pot to help you launch your legendary new group. Invite friends to activate those credits.`,
				tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white'),
				position: 'left'
			},
			...(options.length > 1
				? [
						{
							element: document.getElementById('gear_icon'),
							title: 'Change Group Name',
							intro: `Last Step:  This is the default name for all new sessions. You can change this by clicking on the gear icon here.`,
							tooltipClass: clsx(
								'bg-white text-black dark:bg-dark dark:text-white'
							),
							position: 'left'
						}
				  ]
				: [])
		]
	}

	useEffect(() => {
		if (props.enabled)
			intro()
				.setOptions({
					steps: steps()
				})
				.oncomplete(() => {
					userState.setHowItWorks(false)
				})
				.onexit(() => {
					userState.setHowItWorks(false)
				})
				.start()
	}, [props.label, props.enabled])

	return null
}
