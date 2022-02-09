import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import classes from './Styles.module.css'
import clsx from 'clsx'
import { themeState } from '../../state/react/useTheme'
import { userState } from '../../state/user'
import { ModalProfileSetting } from '../modals/ModalProfileSetting'
import { ApiUser } from '../../types'

interface ProfileMenuProps {
	potUser: ApiUser
	isGoogleConnected: boolean
}

export const ProfileMenu = observer(function ProfileMenu(
	props: ProfileMenuProps
) {
	const { theme } = themeState
	const [openProfileModal, setOpenProfileModal] = useState(false)
	const { potUser, isGoogleConnected } = props

	return (
		<div
			className={clsx(
				'absolute w-full md:px-7 px-2',
				potUser?.readyUpAt ? 'top-14' : 'bottom-20 top-14'
			)}
		>
			<div
				className={clsx(
					classes.sidebar__profile,
					theme === 'dark' ? classes.profile_dark : '',
					'w-full'
				)}
			>
				<ModalProfileSetting
					isOpen={openProfileModal}
					onRequestClose={() => setOpenProfileModal(false)}
					style={{
						content: {
							minWidth: 320,
							maxWidth: 600
						}
					}}
				/>
				<div
					className={classes.sidebar__user}
					onClick={() => setOpenProfileModal(true)}
				>
					<div className={classes.sidebar__ava}>
						<img
							className={classes.sidebar__pic}
							src={
								userState?.user?.avatarUri
									? userState?.user.avatarUri
									: '/img/ava.png'
							}
						/>
					</div>
					<div className={clsx(classes.sidebar__desc, 'pl-2')}>
						<div className={clsx(classes.sidebar__man, 'text-xs md:text-sm')}>
							{userState?.user?.firstName}
						</div>
						<div
							className={clsx(
								classes.sidebar__status,
								classes.caption,
								'text-xs'
							)}
						>
							{!props?.potUser?.readyUpAt &&
								isGoogleConnected &&
								'Set swear jar fee & ready up 0/1'}
							{!isGoogleConnected && 'Enter Name'}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
})
