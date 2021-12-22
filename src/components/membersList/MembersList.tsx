import clsx from 'clsx'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { useMutation } from 'react-query'
import { queryClient } from '../../state/queryClient'
import { Api } from '../../api'
import { userState } from '../../state/user'
import classes from './Styles.module.css'

const MembersList = ({ membersList, isAdmin }) => {
	const { data } = useSelectedPot()

	const kickPotUser = (userId: number) => {
		const params = {
			userId: userId
		}
		kickPotUserMutation.mutate(params)
	}

	const kickPotUserMutation = useMutation(
		'kickPotUser',
		async (params: any) =>
			Api.userPots.deletePotUser(data!.pot.id, params.userId),
		{
			onSuccess() {
				queryClient.invalidateQueries(['money-pot', data?.pot.id])
			}
		}
	)

	const membersTemplate = membersList.map(member => {
		return (
			<div
				className={clsx(
					'members-list__row pt-4 pb-4',
					classes.membersList__row,
					isAdmin ? '' : 'bg-gray-100 rounded-2xl px-6 my-2'
				)}
			>
				<div className={clsx('members-list__left', classes.membersList__left)}>
					<img
						src={
							member.avatarUri
								? member.avatarUri
								: 'https://moneyinthepot.com/img/avatar.png'
						}
						className={clsx(classes.membersList__image)}
						alt="user image"
					/>
					<span
						className={clsx(
							'members-list__user-name',
							isAdmin ? '' : 'font-bold text-lg'
						)}
					>
						{member.firstName}
					</span>
				</div>

				{isAdmin ? (
					<></>
				) : (
					<>{member.admin && <div className="text-blue-600">Admin</div>}</>
				)}

				<div
					className={clsx('members-list__right', classes.membersList__right)}
				>
					{isAdmin && member.id !== userState.user.id && (
						<a
							href="javascript:void(0)"
							data-js-id={member.id}
							className={clsx(
								'members-list__kick-button',
								classes.membersList__kickbtn
							)}
							onClick={() => kickPotUser(member.id)}
						>
							Kick
						</a>
					)}
				</div>
			</div>
		)
	})

	return (
		<div className={clsx('members-list', classes.membersList)}>
			{isAdmin ? (
				<>
					<span
						className={clsx('members-list__count', classes.membersList__count)}
					>
						<img
							src="https://cdn-icons-png.flaticon.com/512/16/16480.png"
							className={clsx('mr-4', classes.membersList__icon)}
						/>
						{membersList.length} {membersList.length > 1 ? 'Members' : 'Member'}
					</span>
				</>
			) : (
				<div className="flex justify-between border border-primary py-2 px-4 rounded-lg">
					<div className="text-xl font-bold">Total Members</div>
					<div className="text-xl font-bold">{membersList.length}</div>
				</div>
			)}
			{membersTemplate}
		</div>
	)
}

export default MembersList
