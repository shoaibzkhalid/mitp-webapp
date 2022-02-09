import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { SpinnerBig } from '../SpinnerBig'
import { createModalComponent } from '../ui/Modal'
import { ButtonCloseModal } from './ButtonCloseModal'

export const ModalUserViewLogs = createModalComponent<{
	potId: string
	userId: string
	viewingLogsMode: string
}>(function ModalUserViewLogs(props) {
	const userLogs = useQuery(['user-logs', props.potId, props.userId], () =>
		Api.logsList(props.potId, props.userId)
	)

	if (props.viewingLogsMode === 'week') {
		userLogs.data.logs = userLogs.data.logs.filter(log => {
			if (
				new Date(log.createdAt) > dayjs().startOf('week').toDate() &&
				new Date(log.createdAt) < dayjs().endOf('week').toDate()
			) {
				return log
			}
		})
	}

	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>User logs</div>
				<div className="ml-auto">
					<ButtonCloseModal onClick={props.onRequestClose} />
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
})
