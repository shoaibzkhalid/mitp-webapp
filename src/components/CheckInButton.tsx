interface CheckInButtonProps {
	disabled?: boolean
	className?: any
	background?: any
	cameraPic?: any
	setPhotoModalIsOpen: (isOpen: boolean) => void
}

export function CheckInButton(props: CheckInButtonProps) {
	return (
		<>
			<button
				className={
					props.className || 'mt-5 w-full max-w-sm -button -primary text-lg'
				}
				onClick={() => props.setPhotoModalIsOpen(true)}
			>
				{props.cameraPic !== false && (
					<img className="mr-3" src="./img/camera.png"></img>
				)}
				Check In
			</button>
		</>
	)
}
