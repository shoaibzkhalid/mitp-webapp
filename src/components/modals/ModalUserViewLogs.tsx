import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { userState } from '../../state/user'
import { SpinnerBig } from '../SpinnerBig'
import { createModalComponent } from '../ui/Modal'
import { ButtonCloseModal } from './ButtonCloseModal'

export const ModalUserViewLogs = createModalComponent<{
	potId: string
	userId: string
	viewingLogsMode: string
}>(function ModalUserViewLogs(props) {
	const pot = useSelectedPot()
	const potUser = pot.data?.users.find(u => u.id === userState.user?.id)

	const userLogs = useQuery(['user-logs', props.potId, props.userId], () =>
		Api.logsList(props.potId, props.userId)
	)

	const [currentLogIndex, setCurrentLogIndex] = useState(0)
	const [currentLogId, setCurrentLogId] = useState(
		userLogs.data?.logs[currentLogIndex].id
	)

	if (props.viewingLogsMode === 'week' && userLogs.data?.logs) {
		userLogs.data.logs = userLogs.data?.logs.filter(log => {
			if (
				new Date(log.createdAt) > dayjs().startOf('week').toDate() &&
				new Date(log.createdAt) < dayjs().endOf('week').toDate()
			) {
				return log
			}
		})
	}

	console.log('userLogs', potUser)

	return (
		<>
			<div className="flex items-center text-xl font-poppins">
				<div className="text-2xl font-bold">User logs</div>
				<div className="ml-auto">
					<ButtonCloseModal onClick={props.onRequestClose} />
				</div>
			</div>

			{!userLogs.data ? (
				<SpinnerBig />
			) : userLogs.data.logs.length === 0 ? (
				<div className="text-gray-500">No logs.</div>
			) : (
				<div className="mb-7 truncate">
					<div className="flex flex-row items-center justify-between mb-3">
						<div className="flex flex-row items-center">
							<img
								className="mr-2 w-10 max-w-xs rounded-full"
								src={userState.user!.avatarUri}
							/>

							<div className="w-1/2">
								<span className="font-medium">{potUser.firstName} </span>
								completed {potUser.checkinsThisWeek}/
								{pot?.data.pot.checkinCount} check ins this week.
							</div>
						</div>

						<div className="flex flex-row">
							<img
								className="mr-2 cursor-pointer x w-5 h-5"
								src="/img/calendar.svg"
							/>
							<span>
								{dayjs(userLogs.data.logs[currentLogIndex].createdAt).format(
									'DD MMM YYYY, HH:mm A'
								)}
							</span>
						</div>
					</div>

					{userLogs.data?.logs[currentLogIndex].pictureUri ? (
						<>
							<div
								className="flex top-1/2 left-10 bg-white rounded-3xl opacity-80 justify-center items-center w-8 h-8 absolute cursor-pointer"
								onClick={() => {
									setCurrentLogIndex(currentLogIndex + 1)
									setCurrentLogId(userLogs.data.logs[currentLogIndex + 1].id)
								}}
							>
								<svg className="w-3 h-3 fill-white-500 sm:w-5">
									<use xlinkHref="/img/sprite.svg#icon-arrow-left"></use>
								</svg>
							</div>
							<img
								src={userLogs.data?.logs[currentLogIndex].pictureUri}
								style={{
									height: props.viewingLogsMode === 'week' ? '100%' : '110px',
									width: props.viewingLogsMode === 'week' ? '100%' : '110px',
									borderRadius: '10px'
								}}
							/>
							{currentLogIndex ? (
								<div
									className="flex top-1/2 right-10 rounded-3xl bg-white opacity-80 justify-center items-center w-8 h-8 absolute cursor-pointer"
									onClick={() => {
										setCurrentLogIndex(currentLogIndex - 1)
										setCurrentLogId(userLogs.data.logs[currentLogIndex - 1].id)
									}}
								>
									<svg className="w-3 h-3 fill-white-500 sm:w-5">
										<use xlinkHref="/img/sprite.svg#icon-arrow-right"></use>
									</svg>
								</div>
							) : null}

							<div className="absolute bottom-1/4" style={{ left: '45%' }}>
								<div className="flex w-full justify-center">
									{userLogs.data?.logs
										.slice(0)
										.reverse()
										.map(log => (
											<div
												className={`mr-2 ${
													log.id === currentLogId ? 'bg-primary' : 'bg-bombay'
												} rounded-3xl h-2 w-2`}
											></div>
										))}
								</div>
							</div>
						</>
					) : (
						<div className="text-gray-500">No image.</div>
					)}

					<p className="mt-2 leading-1">
						Lorem ipsum dolor, sit amet consectetur adipisicing elit. At Lorem
					</p>
				</div>
			)}
		</>
	)
})
