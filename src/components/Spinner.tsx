import Lottie from 'react-lottie'
import * as animationDataLight from './../styles/data.json'
import * as animationDataDark from './../styles/datadark.json'
import { themeState } from './../state/react/useTheme'

interface SpinnerProps {
	className?: string
}
export function Spinner({ className }: SpinnerProps) {
	const { theme } = themeState

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: theme === 'light' ? animationDataLight : animationDataDark,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice'
		}
	}
	return <Lottie options={defaultOptions} />
}
