import * as intro from 'intro.js'
import 'intro.js/introjs.css'
import { useEffect } from 'react'

interface IntroProps {
	label: string
	enabled?: any
	steps: () => object[]
}
export function Intro(props: IntroProps) {
	useEffect(() => {
		if (
			props.enabled &&
			localStorage.getItem('intro_completed_' + props.label) !== 'true'
		)
			intro()
				.setOptions({
					steps: props.steps()
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
