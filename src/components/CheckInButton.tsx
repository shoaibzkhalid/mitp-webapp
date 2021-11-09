import { useRef } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../api'
import { queryClient } from '../state/queryClient'

interface CheckInButtonProps {
	potId: string
	disabled?: boolean
	className?: any
}
export function CheckInButton(props: CheckInButtonProps) {
	const checkinInputRef = useRef<HTMLInputElement | null>(null)
	const checkinMutation = useMutation(
		'checkin',
		(file: File) => Api.logsCreate(props.potId, file),
		{
			onSuccess() {
				queryClient.invalidateQueries(['money-pot', props.potId])
			}
		}
	)

	return (
		<>
			<input
				type="file"
				ref={checkinInputRef}
				style={{
					position: 'absolute',
					left: '-10000px',
					visibility: 'hidden'
				}}
				disabled={props.disabled}
				onInput={e => {
					if (e.currentTarget.files && e.currentTarget.files.length > 0)
						checkinMutation.mutate(e.currentTarget.files![0])
				}}
			/>
			<button
				className={
					props.className || 'mt-5 w-full max-w-sm -button -primary text-lg'
				}
				style={{
					background:
						'linear-gradient(166.98deg, #8679E2 -3.04%, #6C5DD3 90.61%)'
				}}
				onClick={() => {
					checkinInputRef.current?.click()
				}}
			>
				<img className="mr-3" src="./img/camera.png"></img>
				Check In
			</button>
		</>
	)
}
