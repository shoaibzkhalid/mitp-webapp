import * as intro from 'intro.js'
import 'intro.js/introjs.css'
import { useEffect } from 'react'
import { userState } from './../state/user'

interface HowItWorksProps {
	label: string
	enabled?: any
	steps: () => object[]
}
export function HowItWorks(props: HowItWorksProps) {
	useEffect(() => {
		if (props.enabled)
			intro()
				.setOptions({
					steps: props.steps()
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
