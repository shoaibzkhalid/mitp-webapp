import { OverlayLoadingAnimation } from './OverlayLoadingAnimation'

export function SpinnerBig() {
	return (
		<div className="flex items-center justify-center h-screen p-14">
			<div className="">
				<OverlayLoadingAnimation />
			</div>
		</div>
	)
}
