import clsx from 'clsx'

interface SquareProps {
	className: string
	length: string
}
export function Square(props: SquareProps) {
	return (
		<div
			className={clsx(props.className, 'rounded-md')}
			style={{ height: props.length, width: props.length }}
		></div>
	)
}
