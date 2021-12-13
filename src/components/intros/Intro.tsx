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
					element: document.getElementById('walkthrough_potname'),
					title: 'Welcome to your new group!',
					intro:
						'This is the activity of your group your members do to complete their check ins with the rest of the group. You can change your group activity or add details to it like time, location, or specific requirements (IE; Types of Exercises Allowed) later.'
				},
				{
					element: document.getElementById('walkthrough_checkins'),
					intro: `Users must tap the “check in” button on mobile or desktop and upload photo proof they’ve completed the group activity successfully before the week is over.`
				},
				{
					element: document.getElementById('walkthrough_pot'),
					title: 'This is your group’s pot.',
					intro: `Members of your group who fail their check-in before the week is up pay in to the pot. Note: You set the minimum pay-in for your group, and can always set the value to zero, so group members are able to set their own.`
				},
				{
					intro: `We recommend you take a minute to finish setup, but you can also invite friends or explore. This is your group, and you’re at the helm. Tap "tutorial" at anytime if you want to see this walkthrough again.`
				}
			]
		else
			return [
				{
					element: document.getElementById('walkthrough_checkins'),
					title: 'Welcome to the group!',
					intro:
						'Users must tap the “check in” button on mobile or desktop and upload photo proof they’ve completed the group activity successfully before the week is over. The group activity can be seen at the top of the homepage.',
					tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white')
				},
				{
					element: document.getElementById('walkthrough_pot'),
					intro: `This is your group’s pot. Members of your group who fail their check-in before the week is up pay in to the pot. You get paid at the end of the month based on how big the pot is.`,
					tooltipClass: clsx('bg-white text-black dark:bg-dark dark:text-white')
				},
				{
					intro: `Review & agree to this groups rules when you're ready to join it. Tap "tutorial" at anytime if you want to see this walkthrough again.`,
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
