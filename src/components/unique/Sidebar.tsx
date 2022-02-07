import Link from 'next/link'
import clsx from 'clsx'
import { useContext } from 'react'
import Router, { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import ReactModal from 'react-modal'
import { CheckInRulesModalInner } from '../modals/CheckInRulesModalInner'
import { PayInRulesModalInner } from '../modals/PayInRulesModalInner'
import { PayoutScheduleModalInner } from '../modals/PayoutScheduleModalInner'
import { ProfileSettingModalInner } from '../modals/ProfileSettingModalInner'
import { GroupSettingsModal } from '../modals/GroupSettingsModal'
import { SidebarPotsSelector } from './SidebarPotsSelector'
import { useNextAppElement } from '../../state/react/useNextAppElement'
import Switch from '../switch'
import ProfileMenu from '../profileMenu'
import { useMediaQuery } from '../../state/react/useMediaQuery'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { toggleSideBar } from '../../utils/common'
import { observer } from 'mobx-react-lite'
import { userState } from '../../state/user'
import { Login } from '../Authentication/Login'
import { Logout } from '../Authentication/Logout'
import { runInAction } from 'mobx'
import { SidebarContext } from '../../state/contexts/sidebarContext'

interface SidebarProps {
	isMobile: boolean
}

export const Sidebar = observer(function Sidebar(props: SidebarProps) {
	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	const { asPath } = useRouter()
	const router = useRouter()
	const activeLink = useMemo(
		() =>
			links.find(
				link =>
					asPath.startsWith(link[0]) ||
					link[1].some((l: string) => asPath.startsWith(l))
			),
		[asPath]
	)
	const [openButtonModal, setOpenButtonModal] = useState(null as any)
	const appElement = useNextAppElement()
	const selectedPot = useSelectedPot()
	const isMobile = useMediaQuery('(max-width: 1024px)')
	const [openProfileModal, setOpenProfileModal] = useState<boolean>(false)

	const potUser = useMemo(
		() => selectedPot.data?.users.find(u => u.id === userState.user?.id),
		[selectedPot.data]
	)

	const isGoogleConnected = !!userState.user?.connections.find(
		c => c.service === 'google'
	)

	return (
		<div
			style={{
				padding: potUser?.readyUpAt ? '100px 0 195px 0' : '100px 0 235px 0'
			}}
			className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 w-65 dark:border-gray-700 dark:bg-gray-900 md:w-80"
		>
			<ReactModal
				isOpen={openProfileModal}
				onRequestClose={() => setOpenProfileModal(false)}
				appElement={appElement}
				style={{
					content: {
						minWidth: 320,
						maxWidth: 600
					}
				}}
			>
				<ProfileSettingModalInner
					closeModal={() => setOpenProfileModal(false)}
				/>
			</ReactModal>
			<div className="absolute top-0 left-0 right-0">
				<div className="relative flex flex-col items-center justify-center px-8 pt-12 border-0">
					{props.isMobile && (
						<button
							className="absolute mr-auto left-4"
							onClick={() => {
								toggleSideBar(!sidebarState.isOpen)
								setSidebarState({ isOpen: !sidebarState.isOpen })
							}}
						>
							<svg className="w-6 h-6 fill-current">
								<use xlinkHref="/img/sprite.svg#icon-close"></use>
							</svg>
						</button>
					)}
					<div
						onClick={() => {
							Router.push('/home')
						}}
						className="cursor-pointer"
					>
						{!isMobile ? (
							<svg
								width="131"
								height="37"
								viewBox="0 0 131 37"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M39.85 0.899999V36H31.3V14.95L23.45 36H16.55L8.65 14.9V36H0.1V0.899999H10.2L20.05 25.2L29.8 0.899999H39.85ZM54.5484 0.899999V36H45.9984V0.899999H54.5484ZM85.9945 0.899999V7.75H76.6945V36H68.1445V7.75H58.8445V0.899999H85.9945ZM117.036 12.2C117.036 14.2333 116.569 16.1 115.636 17.8C114.702 19.4667 113.269 20.8167 111.336 21.85C109.402 22.8833 107.002 23.4 104.136 23.4H98.8355V36H90.2855V0.899999H104.136C106.936 0.899999 109.302 1.38333 111.236 2.35C113.169 3.31666 114.619 4.65 115.586 6.35C116.552 8.05 117.036 10 117.036 12.2ZM103.486 16.6C105.119 16.6 106.336 16.2167 107.136 15.45C107.936 14.6833 108.336 13.6 108.336 12.2C108.336 10.8 107.936 9.71667 107.136 8.95C106.336 8.18333 105.119 7.8 103.486 7.8H98.8355V16.6H103.486Z"
									fill={'currentColor'}
								/>
								<path
									d="M125.487 36.4C123.987 36.4 122.753 35.9667 121.787 35.1C120.853 34.2 120.387 33.1 120.387 31.8C120.387 30.4667 120.853 29.35 121.787 28.45C122.753 27.55 123.987 27.1 125.487 27.1C126.953 27.1 128.153 27.55 129.087 28.45C130.053 29.35 130.537 30.4667 130.537 31.8C130.537 33.1 130.053 34.2 129.087 35.1C128.153 35.9667 126.953 36.4 125.487 36.4Z"
									fill="#6C5DD3"
								/>
							</svg>
						) : (
							<svg
								width="80"
								height="24"
								viewBox="0 0 80 23"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M24.71 0.939999V22H19.58V9.37L14.87 22H10.73L5.99 9.34V22H0.86V0.939999H6.92L12.83 15.52L18.68 0.939999H24.71ZM33.5291 0.939999V22H28.3991V0.939999H33.5291ZM52.3967 0.939999V5.05H46.8167V22H41.6867V5.05H36.1067V0.939999H52.3967ZM71.0213 7.72C71.0213 8.94 70.7413 10.06 70.1813 11.08C69.6213 12.08 68.7613 12.89 67.6013 13.51C66.4413 14.13 65.0013 14.44 63.2813 14.44H60.1013V22H54.9713V0.939999H63.2813C64.9613 0.939999 66.3813 1.23 67.5413 1.81C68.7013 2.39 69.5713 3.19 70.1513 4.21C70.7313 5.23 71.0213 6.4 71.0213 7.72ZM62.8913 10.36C63.8713 10.36 64.6013 10.13 65.0813 9.67C65.5613 9.21 65.8013 8.56 65.8013 7.72C65.8013 6.88 65.5613 6.23 65.0813 5.77C64.6013 5.31 63.8713 5.08 62.8913 5.08H60.1013V10.36H62.8913Z"
									fill={'currentColor'}
								/>
								<path
									d="M76.092 22.24C75.192 22.24 74.452 21.98 73.872 21.46C73.312 20.92 73.032 20.26 73.032 19.48C73.032 18.68 73.312 18.01 73.872 17.47C74.452 16.93 75.192 16.66 76.092 16.66C76.972 16.66 77.692 16.93 78.252 17.47C78.832 18.01 79.122 18.68 79.122 19.48C79.122 20.26 78.832 20.92 78.252 21.46C77.692 21.98 76.972 22.24 76.092 22.24Z"
									fill="#6C5DD3"
								/>
							</svg>
						)}
					</div>
				</div>
			</div>
			<div className="w-full h-full px-5 pb-5 overflow-x-hidden overflow-y-auto border-b border-gray-200 dark:border-gray-700 -sidebar-main md:px-8">
				<div className="relative flex items-center py-4">
					<SidebarPotsSelector />
					<span
						className="absolute cursor-pointer add-pot-icon"
						onClick={() => router.push('/create')}
					>
						<svg className="w-5 h-5 mr-1 fill-current">
							<use xlinkHref="/img/sprite.svg#icon-plus"></use>
						</svg>
					</span>
				</div>

				{links.map(link => (
					<div key={link[0]}>
						{link[4] ? (
							<>
								<button
									className={clsx(
										`px-5 py-4 flex w-full flex-row items-center rounded-xl text-sm font-bold transition-colors`,
										activeLink === link
											? `bg-primary text-white`
											: 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
									)}
									onClick={() => setOpenButtonModal(link[0])}
								>
									{link[3]}
									<div className="ml-4">{link[2]}</div>
								</button>
								<ReactModal
									isOpen={openButtonModal === link[0]}
									onRequestClose={() => setOpenButtonModal(null)}
									appElement={appElement}
								>
									{(() => {
										// Workaround for making Fast Refresh work
										const Comp = link[4]
										return (
											<Comp closeModal={() => setOpenButtonModal(null)}></Comp>
										)
									})()}
								</ReactModal>
							</>
						) : (
							<>
								{link[0] === '/howitworks' || link[0] === '/setswearjarfee' ? (
									<>
										<a
											onClick={e => {
												e.preventDefault()
												if (link[0] === '/howitworks') {
													userState.setHowItWorks(true)
													Router.push('/home')
												} else {
													setOpenProfileModal(true)
												}
											}}
											className={clsx(
												`cursor-pointer px-5 flex flex-row items-start rounded-xl text-sm font-bold transition-colors`,
												link[0] === '/setswearjarfee' ? 'py-2' : 'py-4',
												link[0] === '/setswearjarfee' &&
													!isGoogleConnected &&
													'hidden',
												activeLink === link
													? `bg-primary text-white`
													: 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
											)}
										>
											{link[3]}
											<div className="ml-4">
												<div>{link[2]}</div>
												{link[0] === '/setswearjarfee' && (
													<div className="text-xs font-light text-gray-400">
														{/* Group minimum: ${selectedPot?.data?.pot?.minAmount} */}
														Group minimum: ${potUser?.amount}
													</div>
												)}
											</div>
										</a>
										{}
									</>
								) : (
									<>
										<Link href={link[0]}>
											<a
												id={link[0] === '/overview' ? 'weekly_overview' : ''}
												className={clsx(
													`px-5 py-4 flex flex-row items-center rounded-xl text-sm font-bold transition-colors`,
													activeLink === link
														? `bg-primary text-white`
														: 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
												)}
												target={link[5] ? '_blank' : '_self'}
											>
												{link[3]}
												<div className="ml-4">{link[2]}</div>
											</a>
											{}
										</Link>
									</>
								)}
							</>
						)}
					</div>
				))}

				<div className="mx-5 my-6 border-t border-gray-300 dark:border-gray-700"></div>

				<div className="px-5 mb-4 text-sm text-gray-500">Rules</div>

				{insightButtons.map(button => (
					<div key={button[0]}>
						<button
							className={`px-5 py-4 flex flex-row items-center rounded-xl text-sm font-bold transition-colors text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white`}
							onClick={() => setOpenButtonModal(button)}
						>
							{button[1]}
							<div className="ml-4">{button[0]}</div>
						</button>

						<ReactModal
							isOpen={openButtonModal === button}
							onRequestClose={() => setOpenButtonModal(null)}
							appElement={appElement}
						>
							{(() => {
								// Workaround for making Fast Refresh work
								const Comp = button[2]
								return <Comp closeModal={() => setOpenButtonModal(null)}></Comp>
							})()}
						</ReactModal>
					</div>
				))}
			</div>

			<div className="relative flex flex-col items-center justify-center">
				<div className="w-full px-2 mt-4 md:px-7">
					{/* {isGoogleConnected ? (
						<Logout />
					) : (
						<Login title={'Sign in with Google'} autoLoad={false} />
					)} */}
					<button
						className="py-4 text-xs px md:px-3 md:text-sm google-sigin"
						onClick={e => {
							runInAction(() => {
								userState.tokens = {
									accessToken: null,
									refreshToken: null
								}
								localStorage.setItem('mitp_tokens', '')
							})
							window.location.assign(
								process.env.NODE_ENV === 'production'
									? '/'
									: process.env.NEXT_PUBLIC_LANDINGPAGE
							)
						}}
					>
						<img
							className="w-8 google-login-logo"
							src="./img/google-logo.png"
						></img>
						<span className="ml-10 md:ml-2">
							Logout {userState?.user?.firstName}
						</span>
					</button>
				</div>
				<ProfileMenu potUser={potUser} isGoogleConnected={isGoogleConnected} />
				<div className="mt-20">
					<Switch />
				</div>
				{potUser?.readyUpAt && isGoogleConnected && <></>}

				{!potUser?.readyUpAt && isGoogleConnected && (
					<div className="px-4 pt-2 text-xs italic font-thin text-center text-black dark:text-white">
						Hint: Tap on your avatar to view settings &amp; ready up.
					</div>
				)}

				{!isGoogleConnected && (
					<div className="px-4 pt-2 text-xs italic font-thin text-center text-black dark:text-white">
						Hint: Sign in with google to be able to invite friends & save
						progress..
					</div>
				)}
			</div>
		</div>
	)
})

const links: any[][] = [
	[
		'/home',
		[],
		'Home',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-overview"></use>
		</svg>
	],
	[
		'/overview',
		['/pot'],
		'Weekly Overview',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-discovery"></use>
		</svg>
	],
	[
		'/payouts',
		[],
		'Your Payouts',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-wallet"></use>
		</svg>
	],
	[
		'/setswearjarfee',
		[],
		'Set Swear Jar Fee',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-settings"></use>
		</svg>
	],
	[
		'https://forms.gle/riuAuH1cr6YC5j567',
		[],
		'Send Feedback to Developers',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-document"></use>
		</svg>,
		'',
		'blank'
	]
]

const insightButtons: any[][] = [
	[
		'Check in Rules',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-message"></use>
		</svg>,
		CheckInRulesModalInner
	],
	[
		'Pay in Rules',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-notification"></use>
		</svg>,
		PayInRulesModalInner
	],
	[
		'Pay out Schedule',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-chat"></use>
		</svg>,
		PayoutScheduleModalInner
	]
]
