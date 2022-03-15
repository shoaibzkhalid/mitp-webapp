import Lottie from 'react-lottie'
import * as uploadAnimation from '../styles/upload-animation.json'
import { themeState } from '../state/react/useTheme'

export function UploadAnimation() {
	const { theme } = themeState

	const options = {
		loop: true,
		autoplay: true,
		animationData: uploadAnimation,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice'
		}
	}
	return (
		<div className="flex items-center justify-center bg-white">
			<div className="w-full max-w-[8rem]">
				<Lottie options={options} height={80} width={80} />
			</div>
		</div>
	)
}
