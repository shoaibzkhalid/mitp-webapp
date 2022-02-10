import { OverlayLoadingAnimation } from './OverlayLoadingAnimation'

export function SpinnerBig() {
	return (
		<div className="p-14 flex justify-center items-center h-screen">
			<div className="">
				<OverlayLoadingAnimation />
			</div>
		</div>
	)
}
