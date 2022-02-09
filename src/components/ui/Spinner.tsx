import clsx from 'clsx'

const sizeClasses = {
	sm: 'h-5 w-5',
	md: 'h-8 w-8'
}

interface SpinnerProps {
	className?: string
	size?: keyof typeof sizeClasses
}
export function Spinner(props: SpinnerProps) {
	return (
		<svg
			className={clsx(
				'animate-spin text-primary',
				sizeClasses[props.size ?? 'sm'],
				props.className
			)}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-30"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			></circle>
			<path
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	)
}
