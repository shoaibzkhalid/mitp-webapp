import clsx from 'clsx'
import cuid from 'cuid'
import { useMemo } from 'react'

interface InputProps {
	label?: string | JSX.Element
	type?: string
	disabled?: boolean
	placeholder?: string
	value?: any
	setValue?: (value: any) => any
	onBlur?: () => any

	className?: string
	labelClassName?: string
	inputClassName?: string

	inputStyle?: any
}
export function Input(props: InputProps) {
	const id = useMemo(() => cuid(), [])

	return (
		<div className={props.className}>
			{props.label && (
				<label htmlFor={id} className={clsx('block', props.labelClassName)}>
					{props.label}
				</label>
			)}
			<div className="border rounded-md bg-white dark:border-gray-500 dark:bg-opacity-5">
				<input
					style={props.inputStyle}
					type={props.type || 'text'}
					id={id}
					disabled={props.disabled}
					placeholder={props.placeholder}
					value={props.value}
					onInput={e => props.setValue?.(e.currentTarget.value)}
					className={clsx(
						props.inputClassName,
						'w-full rounded-md p-3 bg-transparent'
					)}
					onBlur={e => (props.onBlur ? props.onBlur() : console.log())}
				/>
			</div>
		</div>
	)
}
