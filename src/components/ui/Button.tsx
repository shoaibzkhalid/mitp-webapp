import clsx from 'clsx'
import React from 'react'

export const kindClasses = {
	primary:
		'border-primary bg-primary text-white hover:shadow-lg hover:shadow-[#6C5DD340] active:opacity-80 disabled:border-gray-300 disabled:text-gray-400 disabled:shadow-none disabled:active:opacity-100',
	secondary:
		'border-primary text-primary hover:shadow-lg hover:shadow-[#6C5DD340] active:opacity-80 disabled:border-gray-300 disabled:text-gray-400 disabled:shadow-none disabled:active:opacity-100',
	tertiary:
		'border-primary bg-white text-dark hover:shadow-lg hover:shadow-[#6C5DD340] active:opacity-80 disabled:border-gray-300 disabled:text-gray-400 disabled:shadow-none disabled:active:opacity-100'
}

const sizeClasses = {
	sm: 'p-1 px-2',
	md: 'p-3 px-5'
}

interface ButtonProps {
	children?: React.ReactNode
	onClick?: () => any
	disabled?: boolean
	className?: string
	kind?: keyof typeof kindClasses
	size?: keyof typeof sizeClasses
}
export function Button(props: ButtonProps) {
	return (
		<button
			className={clsx(
				'border rounded-[10px] font-semibold disabled:bg-opacity-10 flex flex-row items-center justify-center',
				kindClasses[props.kind || 'primary'],
				sizeClasses[props.size || 'md'],
				props.className
			)}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{props.children}
		</button>
	)
}
