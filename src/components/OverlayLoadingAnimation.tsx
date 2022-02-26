import Lottie from 'react-lottie'
import * as animationDataLight from '../styles/data.json'
import * as animationDataDark from '../styles/datadark.json'
import { themeState } from '../state/react/useTheme'

export function OverlayLoadingAnimation() {
	const { theme } = themeState

	const options = {
		loop: true,
		autoplay: true,
		animationData: theme === 'light' ? animationDataLight : animationDataDark,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice'
		}
	}
	return (
		<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white">
			<div className="w-full max-w-[8rem]">
				<Lottie options={options} height={100} width={100} />
			</div>
		</div>
	)
}
