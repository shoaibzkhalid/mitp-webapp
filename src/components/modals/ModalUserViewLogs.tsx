import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../../api'
import { queryClient } from '../../state/queryClient'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { userState } from '../../state/user'
import { SpinnerBig } from '../SpinnerBig'
import { Input } from '../ui/Input'
import { createModalComponent } from '../ui/Modal'
import { ButtonCloseModal } from './ButtonCloseModal'

export const ModalUserViewLogs = createModalComponent<{
	potId: string
	userId: string
	viewingLogsMode: string
}>(function ModalUserViewLogs(props) {
	const { potId, userId, onRequestClose, viewingLogsMode } = props

	const pot = useSelectedPot()
	const [desFieldActive, setDesFieldActive] = useState(false)
	const potUser = pot.data?.users.find(u => u.id === userState.user?.id)

	const userLogs = useQuery(['user-logs', potId, userId], () =>
		Api.logsList(potId, userId)
	)

	useEffect(() => {}, [userLogs])

	const [currentLogIndex, setCurrentLogIndex] = useState(0)

	const [logState, setLogState] = useState({
		description: userLogs.data?.logs[currentLogIndex]?.description
	})

	// console.log('logState', userLogs.data?.logs[currentLogIndex]?.description)

	const saveDescriptionMutation = useMutation(
		'updatePot',
		async (description: any) =>
			Api.logUpdate(userLogs.data.logs[currentLogIndex]?.id, {
				description
			}),
		{
			onSuccess() {
				queryClient.invalidateQueries(['user-logs', potId])
			}
		}
	)

	const deleteDescriptionMutation = useMutation('delete-log', async () => {
		await Api.logDescDelete(userLogs.data.logs[currentLogIndex]?.id)
		queryClient.invalidateQueries(['user-logs', potId])
	})

	useEffect(() => {
		setCurrentLogId(userLogs.data?.logs[currentLogIndex]?.id)
	}, [userLogs.data?.logs])

	const [currentLogId, setCurrentLogId] = useState(
		userLogs.data?.logs[currentLogIndex]?.id || null
	)

	if (viewingLogsMode === 'week' && userLogs.data?.logs) {
		userLogs.data.logs = userLogs.data?.logs.filter(log => {
			if (
				new Date(log.createdAt) > dayjs().startOf('week').toDate() &&
				new Date(log.createdAt) < dayjs().endOf('week').toDate()
			) {
				return log
			}
		})
	}

	// console.log('currentLogId', currentLogId, userLogs.data?.logs)

	return (
		<>
			<div className="flex items-center text-xl font-poppins">
				<div className="text-2xl font-bold">User logs</div>
				<div className="ml-auto">
					<ButtonCloseModal onClick={onRequestClose} />
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
								{dayjs(userLogs.data.logs[currentLogIndex]?.createdAt).format(
									'DD MMM YYYY, HH:mm A'
								)}
							</span>
						</div>
					</div>

					{userLogs.data?.logs[currentLogIndex]?.pictureUri ? (
						<div
							style={{ height: 'calc(100% - 300px)' }}
							className="relative border-solid border-2 border-grey-500 rounded-md"
						>
							{currentLogIndex !== userLogs.data.logs.length - 1 && (
								<div
									className="flex top-1/2 left-10 bg-white rounded-3xl opacity-80 justify-center items-center w-8 h-8 absolute cursor-pointer"
									onClick={() => {
										setLogState({
											...logState,
											description:
												userLogs.data.logs[currentLogIndex + 1]?.description
										})
										setCurrentLogIndex(currentLogIndex + 1)
										setCurrentLogId(userLogs.data.logs[currentLogIndex + 1]?.id)
									}}
								>
									<svg className="w-3 h-3 fill-white-500 sm:w-5">
										<use xlinkHref="/img/sprite.svg#icon-arrow-left"></use>
									</svg>
								</div>
							)}
							<img
								src={userLogs.data?.logs[currentLogIndex]?.pictureUri}
								style={{
									height: viewingLogsMode === 'week' ? '100%' : '110px',
									width: viewingLogsMode === 'week' ? '100%' : '110px',
									borderRadius: '10px'
								}}
							/>
							{currentLogIndex !== 0 && (
								<div
									className="flex top-1/2 right-10 rounded-3xl bg-white opacity-80 justify-center items-center w-8 h-8 absolute cursor-pointer"
									onClick={() => {
										setCurrentLogIndex(currentLogIndex - 1)
										setLogState({
											...logState,
											description:
												userLogs.data.logs[currentLogIndex - 1]?.description
										})
										setCurrentLogId(userLogs.data.logs[currentLogIndex - 1]?.id)
									}}
								>
									<svg className="w-3 h-3 fill-white-500 sm:w-5">
										<use xlinkHref="/img/sprite.svg#icon-arrow-right"></use>
									</svg>
								</div>
							)}

							{userLogs.data.logs ? (
								<div
									className="absolute"
									style={{ left: '45%', bottom: '30px' }}
								>
									<div className="flex w-full justify-center">
										{userLogs.data.logs
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
							) : null}
						</div>
					) : (
						<div className="text-gray-500">No image.</div>
					)}

					{!desFieldActive && (
						<>
							{userLogs.data?.logs[currentLogIndex]?.description ? (
								<p
									className={`mt-4 leading-1 text-center`}
									onDoubleClick={() => setDesFieldActive(true)}
								>
									{userLogs.data?.logs[currentLogIndex]?.description}
								</p>
							) : (
								<p
									className={`mt-4 leading-1 text-center text-gray-300`}
									onDoubleClick={() => setDesFieldActive(true)}
								>
									Add a description here...
								</p>
							)}
						</>
					)}

					{desFieldActive && (
						<Input
							placeholder="Add a description here..."
							inputClassName="focus:outline-none bg-alabaster p-4 text-center"
							inputStyle={{
								color: '#000000'
							}}
							value={logState.description}
							setValue={v => setLogState({ ...logState, description: v })}
							onBlur={() => {
								saveDescriptionMutation.mutate(logState.description)
								setDesFieldActive(false)
							}}
						/>
					)}

					<button
						onClick={() => {
							setLogState({ ...logState, description: '' })
							deleteDescriptionMutation.mutate(null)
						}}
						className="absolute bottom-7 right-10 -button -round hover:shadow-md"
					>
						<img src="/img/trash-1.svg" width={15} height={15} />
					</button>
				</div>
			)}
		</>
	)
})
