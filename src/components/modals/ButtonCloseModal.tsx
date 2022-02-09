interface ButtonCloseModalProps {
	onClick: () => any
}
export function ButtonCloseModal(props: ButtonCloseModalProps) {
	return (
		<button
			className="-button -round hover:shadow-md text-sm"
			onClick={props.onClick}
		>
			x
		</button>
	)
}
