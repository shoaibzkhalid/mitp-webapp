interface CheckInButtonProps {
	disabled?: boolean
	className?: any
	setPhotoModalIsOpen?: any
}

export function CheckInButton(props: CheckInButtonProps) {
	return (
		<>			
			<button
				className={
					props.className || 'mt-5 w-full max-w-sm -button -primary text-lg'
				}
				style={{
					background:
						'linear-gradient(166.98deg, #8679E2 -3.04%, #6C5DD3 90.61%)'
				}}
				onClick={() => {
					props.setPhotoModalIsOpen(true)
				}}
			>
				<img className="mr-3" src="./img/camera.png"></img>
				Check In
			</button>
		</>
	)
}
