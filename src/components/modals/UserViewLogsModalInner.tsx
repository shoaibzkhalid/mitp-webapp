import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { SpinnerBig } from '../SpinnerBig'
import { ModalProps } from './types'

interface UserViewLogsModalInnerProps {
	potId: string
	userId: string
}
export function UserViewLogsModalInner(
	props: ModalProps & UserViewLogsModalInnerProps
) {
	const userLogs = useQuery(['user-logs', props.potId, props.userId], () =>
		Api.logsList(props.potId, props.userId)
	)

	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>User logs</div>
				<div className="ml-auto">
					<button
						className="-button -round hover:shadow-lg text-sm"
						onClick={() => props.closeModal()}
					>
						x
					</button>
				</div>
			</div>

			{!userLogs.data ? (
				<SpinnerBig />
			) : userLogs.data.logs.length === 0 ? (
				<div className="text-gray-500">No logs.</div>
			) : (
				userLogs.data.logs.map(log => {
					return (
						<div className="mb-7">
							<div>{dayjs(log.createdAt).format('DD MMM YYYY, HH:mm A')}</div>
							{log.pictureUri ? (
								<img
									src={log.pictureUri}
									style={{
										height: 110,
										width: 110,
										borderRadius: '10px'
									}}
								/>
							) : (
								<div className="text-gray-500">No image.</div>
							)}
						</div>
					)
				})
			)}
		</>
	)
}
