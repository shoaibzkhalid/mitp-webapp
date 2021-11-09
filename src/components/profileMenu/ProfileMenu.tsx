import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import classes from './Styles.module.css'
import clsx from 'clsx'
import { themeState } from '../../state/react/useTheme'
import { runInAction } from 'mobx'
import { userState } from '../../state/user'

export const ProfileMenu = observer(function ProfileMenu() {
	const { theme } = themeState
	const [profileMenuActive, setProfileMenuActive] = useState<boolean>(false)

	return (
		<div
			className={clsx(
				classes.sidebar__profile,
				theme === 'dark' ? classes.profile_dark : ''
			)}
		>
			<div
				className={classes.sidebar__details}
				style={{ display: profileMenuActive ? 'block' : 'none' }}
			>
				{/* <a className={classes.sidebar__link} href="#">
					<div className={classes.sidebar__icon}>
						<svg className={classes.icon_profile}>
							<use xlinkHref="/img/sprite.svg#icon-profile"></use>
						</svg>
					</div>
					<div className={classes.sidebar__text}>Profile</div>
				</a> */}
				<a
					className={classes.sidebar__link}
					href="#"
					onClick={e => {
						e.preventDefault()
						e.stopPropagation()
						runInAction(() => {
							userState.tokens.accessToken = ''
							userState.tokens.refreshToken = ''
						})
						userState.save()
						window.location.assign('/')
					}}
				>
					<div className={classes.sidebar__icon}>
						<svg className={classes.icon_logout}>
							<use xlinkHref="/img/sprite.svg#icon-logout"></use>
						</svg>
					</div>
					<div className={classes.sidebar__text}>Log out</div>
				</a>
			</div>
			<div
				className={clsx(
					classes.sidebar__user,
					profileMenuActive ? classes.active : ''
				)}
				onClick={() => setProfileMenuActive(!profileMenuActive)}
			>
				<div className={classes.sidebar__ava}>
					<img className={classes.sidebar__pic} src="/img/ava.png" alt="" />
				</div>
				<div className={classes.sidebar__desc}>
					<div className={classes.sidebar__man}>
						{userState.user?.firstName}
					</div>
					<div className={clsx(classes.sidebar__status, classes.caption)}>
						{/* Free account */}
					</div>
				</div>
				<div className={classes.sidebar__arrow}>
					<svg
						className={classes.icon_arrows}
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						style={{ transform: 'rotate(180deg)' }}
					>
						<path
							d="M12.7201 15.7803C12.5796 15.921 12.3889 16.0001 12.1901 16.0003H11.8101C11.6117 15.998 11.4218 15.9192 11.2801 15.7803L6.1501 10.6403C6.10323 10.5938 6.06604 10.5385 6.04065 10.4776C6.01527 10.4167 6.0022 10.3513 6.0022 10.2853C6.0022 10.2193 6.01527 10.154 6.04065 10.093C6.06604 10.0321 6.10323 9.9768 6.1501 9.93031L6.8601 9.22031C6.90572 9.17375 6.96018 9.13676 7.02027 9.1115C7.08037 9.08625 7.14491 9.07324 7.2101 9.07324C7.27529 9.07324 7.33982 9.08625 7.39992 9.1115C7.46002 9.13676 7.51447 9.17375 7.5601 9.22031L12.0021 13.6723L16.4421 9.22231C16.4886 9.17545 16.5439 9.13825 16.6048 9.11287C16.6657 9.08748 16.7311 9.07441 16.7971 9.07441C16.8631 9.07441 16.9285 9.08748 16.9894 9.11287C17.0503 9.13825 17.1056 9.17545 17.1521 9.22231L17.8521 9.93231C17.899 9.9788 17.9362 10.0341 17.9615 10.095C17.9869 10.156 18 10.2213 18 10.2873C18 10.3533 17.9869 10.4187 17.9615 10.4796C17.9362 10.5405 17.899 10.5958 17.8521 10.6423L12.7201 15.7803Z"
							fill="currentColor"
						/>
					</svg>
				</div>
			</div>
		</div>
	)
})
