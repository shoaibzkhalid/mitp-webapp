import clsx from 'clsx'
import cuid from 'cuid'
import { useMemo } from 'react'

interface SelectProps {
	label?: string | JSX.Element
	disabled?: boolean
	id?: string
	className?: string
	labelClassName?: string
	selectClassName?: string
	placeholder?: string
	height?: string

	options: Array<{
		label: string
		value: number | string
	}>
	value?: number | string
	setValue: (value: string | number) => unknown
}
export function SelectInput(props: SelectProps) {
	const id = useMemo(() => cuid(), [])

	return (
		<div className={props.className}>
			{props.label && (
				<label htmlFor={id} className={clsx('block', props.labelClassName)}>
					{props.label}
				</label>
			)}

			<div className="shadow-md rounded-md pr-2">
				<select
					placeholder={props.placeholder}
					id={props.id}
					className={clsx(
						'w-full rounded-md p-3 bg-white dark:bg-transparent',
						props.selectClassName
					)}
					style={{ height: props.height ? undefined : '48px' }}
					onChange={e => props.setValue(e.target.value)}
				>
					{props.options.map(option => (
						<option
							value={option.value}
							selected={option.value === props.value}
						>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}
