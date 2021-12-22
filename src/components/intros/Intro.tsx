import clsx from 'clsx'
import * as intro from 'intro.js'
import 'intro.js/introjs.css'
import { useEffect } from 'react'

interface IntroProps {
	label: string
	enabled?: any
	isJustCreated: boolean
}
export function Intro(props: IntroProps) {
	function steps() {
		if (props.isJustCreated)
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
					tooltipClass: clsx(
						'bg-white text-black dark:bg-dark dark:text-white'
					),
					position: 'left'
				},
				{
					title: 'Bookmark',
					intro: `Last Step:  Take a minute to add this page to your bookmarks bar by tapping on the icon above.`,
					tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white')
				}
			]
		else
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
					tooltipClass: clsx(
						'bg-white text-black dark:bg-dark dark:text-white'
					),
					position: 'left'
				},
				{
					title: 'Bookmark',
					intro: `Last Step:  Take a minute to add this page to your bookmarks bar by tapping on the icon above.`,
					tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white')
				}
			]
	}

	useEffect(() => {
		if (
			props.enabled &&
			localStorage.getItem('intro_completed_' + props.label) !== 'true'
		)
			intro()
				.setOptions({
					steps: steps()
				})
				.oncomplete(() => {
					localStorage.setItem('intro_completed_' + props.label, 'true')
				})
				.onexit(() => {
					localStorage.setItem('intro_completed_' + props.label, 'true')
				})
				.start()
	}, [props.label, props.enabled])

	return null
}
