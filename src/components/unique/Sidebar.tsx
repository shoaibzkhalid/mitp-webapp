import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Select from 'react-select'
import { Api } from '../../api'
import {
	selectedPotState,
	useSelectedPot
} from '../../state/react/useSelectedPot'
import Link from 'next/link'
import clsx from 'clsx'
import ThemeSwitcher from '../switch'
import { getReactSelectTheme } from '../../state/react/useTheme'
import { useContext, useState } from 'react'
import { ModalProfileSetting } from '../modals/ModalProfileSetting'
import { userState } from '../../state/user'
import { useIsMobile } from '../../state/react/useIsMobile'
import { SidebarContext } from '../../state/contexts/sidebarContext'
import { toggleSideBar } from '../../utils/common'
import { useMediaQuery } from '../../state/react/useMediaQuery'
import { AppEnv } from '../../env'
import { useMemo } from 'react'

export function Sidebar() {
	const haveSmallHeight = useMediaQuery('(max-height: 735px)')
	const router = useRouter()

	return (
		<div
			style={{
				padding: haveSmallHeight ? '50px 0 200px 0' : '100px 0 200px 0'
			}}
			className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 w-65 dark:border-gray-700 dark:bg-gray-900 md:w-80"
		>
			<SidebarHeader />
			<div className="w-full h-full px-6 pb-5 overflow-x-hidden overflow-y-hidden border-b border-gray-200 dark:border-gray-700 -sidebar-main md:px-8">
				<div className="relative flex items-center py-4">
					<SidebarPotSelector />
					<span
						className="absolute cursor-pointer add-pot-icon"
						onClick={() => router.push('/create')}
					>
						<svg className="h-5 mr-1 fill-gray-500" style={{ width: 18 }}>
							<use xlinkHref="/img/sprite.svg#icon-plus"></use>
						</svg>
					</span>
				</div>
				<SidebarLinks />
			</div>
			<div className="relative flex flex-col items-center justify-center">
				<div className="w-full px-2 mt-4 md:px-7">
					<LogoutButton />
				</div>
				<div className="w-full px-2 mt-4 md:px-7">
					<Profile />
				</div>

				<div className="mt-2">
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	)
}

function SidebarHeader() {
	const haveSmallHeight = useMediaQuery('(max-height: 735px)')
	const isMobile = useIsMobile()
	const [sidebarState, setSidebarState] = useContext(SidebarContext)
	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	return (
		<div className="absolute top-0 left-0 right-0">
			<div
				className={clsx(
					'relative flex flex-col items-center justify-center px-8 border-0',
					haveSmallHeight ? 'pt-6' : 'pt-12'
				)}
			>
				{isMobile && (
					<button
						className="absolute mr-auto left-4"
						onClick={() => {
							handleClickToggleSideBar()
						}}
					>
						<svg className="w-6 h-6 fill-current">
							<use xlinkHref="/img/sprite.svg#icon-close"></use>
						</svg>
					</button>
				)}
				<Link href="/home">
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
				</Link>
			</div>
		</div>
	)
}

const SidebarPotSelector = observer(function SidebarPotSelector() {
	const pot = useSelectedPot()
	const pots = useQuery('userPots', Api.userPots.list)
	const router = useRouter()

	const options =
		pots.data?.map(pot => ({
			value: pot.moneyPot!.id,
			label: (pot.moneyPot!.title || 'No title') as any
		})) ?? []
	options.push({
		value: 'new',
		label: (
			<div className="flex items-center justify-center">
				<svg className="-icon mr-2 translate-y-[-2px]">
					<use xlinkHref="/img/sprite.svg#icon-plus"></use>
				</svg>
				Create new pot
			</div>
		)
	})

	const selectPot = (id: string) => {
		if (id === 'new') return router.push('/create')
		runInAction(() => {
			selectedPotState.moneyPotId = id
			userState.resetNotify()
		})
		router.push('/home')
	}

	return (
		<div className="w-full">
			<Select
				placeholder="Switch or create pot..."
				isLoading={pots.isLoading}
				options={options}
				isOptionSelected={option =>
					option.value === selectedPotState.moneyPotId
				}
				onChange={option => selectPot(option.value)}
				value={{
					value: pot.data?.pot!.id,
					label: pot.data?.pot!.title
				}}
				theme={getReactSelectTheme()}
			/>
		</div>
	)
})

function SidebarLinks() {
	const [currentModal, setCurrentModal] = useState(null as null | 'sweatJarFee')
	const { isLoading, data } = useSelectedPot()

	const potUser = useMemo(
		() => data?.users.find(u => u.id === userState.user?.id),
		[data]
	)

	return (
		<>
			<ModalProfileSetting
				isOpen={currentModal === 'sweatJarFee'}
				onRequestClose={() => setCurrentModal(null)}
			/>

			<SidebarLink icon={linkIcons.overview} label="Home" link="/home" />
			<SidebarLink
				icon={linkIcons.discovery}
				label="Weekly Overview"
				link="/overview"
				notifier={userState.notify}
			/>
			<SidebarLink
				icon={linkIcons.wallet}
				label="Your Payouts"
				link="/payouts"
			/>
			<SidebarLink
				icon={linkIcons.settings}
				label={
					<div>
						<div className="font-bold">Set Swear Jar Fee</div>
						<div className="text-xs font-light whitespace-nowrap">
							Group minimum: ${data?.pot.minAmount} Yours: ${potUser?.amount}
						</div>
					</div>
				}
				onClick={() => setCurrentModal('sweatJarFee')}
			/>
			<SidebarLink
				icon={linkIcons.document}
				label={
					<>
						Send feedback to <br /> developers
					</>
				}
				link="https://forms.gle/RZak8BEdDUkG67xJA"
				target="_blank"
			/>
		</>
	)
}

const linkIcons = {
	overview: (
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-overview"></use>
		</svg>
	),
	discovery: (
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-discovery"></use>
		</svg>
	),
	wallet: (
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-wallet"></use>
		</svg>
	),
	settings: (
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-settings"></use>
		</svg>
	),
	document: (
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-document"></use>
		</svg>
	)
}

interface SidebarLinkProps {
	label: any
	icon: any
	link?: string
	onClick?: () => any
	target?: string
	notifier?: any
}
function SidebarLink(props: SidebarLinkProps) {
	const currentPath = useRouter().asPath
	const isActive = props.link && props.link === currentPath

	const button = (
		<div
			className={clsx(
				`text-left cursor-pointer px-5 py-4 flex flex-row items-center rounded-xl text-sm font-bold transition-colors mt-2`,
				isActive
					? `bg-primary text-white`
					: 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
			)}
		>
			<span className="w-8">{props.icon}</span>
			{props.label}

			{props.notifier && (
				<>
					<div className="w-2 h-2 ml-2 bg-red-600"></div>
				</>
			)}
		</div>
	)

	if (props.link)
		return (
			<Link href={props.link}>
				<a target={props.target || '_self'}>{button}</a>
			</Link>
		)
	return <button onClick={props.onClick}>{button}</button>
}

function LogoutButton() {
	const logout = () => {
		userState.clear()
		window.location.assign(
			process.env.NODE_ENV === 'production' ? '/' : AppEnv.DevLandingPageUrl
		)
	}

	return (
		<button
			className={clsx(
				'border rounded-[10px] dark:border-gray-600 shadow font-semibold flex items-center justify-center w-full p-3'
			)}
			onClick={logout}
		>
			<img src="/img/google-logo.svg" className="h-6 mr-1" />
			<div className="opacity-60">Logout</div>
		</button>
	)
}

const Profile = observer(function Profile() {
	const haveSmallHeight = useMediaQuery('(max-height: 850px)')
	const { data } = useSelectedPot()
	const potUser = useMemo(
		() => data?.users.find(u => u.id === userState.user?.id),
		[data]
	)
	const [currentModal, setCurrentModal] = useState(
		null as null | 'profileSettings'
	)
	const user = userState.user

	const logout = () => {
		userState.clear()
		window.location.assign('/')
	}

	return (
		<>
			<ModalProfileSetting
				isOpen={currentModal === 'profileSettings'}
				onRequestClose={() => setCurrentModal(null)}
				style={{
					content: {
						height: haveSmallHeight ? '95%' : 'auto',
						top: haveSmallHeight ? -20 : 40
					}
				}}
			/>

			<div
				className={clsx(
					'flex items-center w-full cursor-pointer',
					'border-2 border-primary rounded-xl p-3 px-4 ',
					'hover:bg-primary hover:text-white transition-colors'
				)}
				onClick={() => setCurrentModal('profileSettings')}
			>
				<img
					src={user?.avatarUri}
					title="Profile picture"
					alt="?"
					className="w-10 h-10 mr-2 rounded-full"
					referrerPolicy="no-referrer"
				/>
				<div className="relative px-2">
					<div
						className="font-bold w-1/2 text-ellipsis"
						style={{ overflow: 'hidden' }}
					>
						{user?.firstName || (
							<span className="text-gray-400">Anonymous</span>
						)}
					</div>
					<div className="text-xs opacity-75 profile">
						Set swear jar fee &amp; ready up
					</div>
					{!potUser?.readyUpAt && (
						<>
							<div className="absolute top-0 right-0 font-thin text-gray-400">
								0/1
							</div>
						</>
					)}
				</div>
				{/* <Tippy
					interactive
					interactiveBorder={10}
					content={
						<div className="w-48 p-4 bg-white border shadow dark:border-gray-500 dark:bg-dark rounded-xl">
							<button
								onClick={logout}
								className="block w-full text-left text-red-600 hover:underline"
							>
								Logout
							</button>
							<button
								onClick={() => setCurrentModal('profileSettings')}
								className="block w-full mt-4 text-left hover:underline"
							>
								Settings
							</button>
						</div>
					}
				>
					<button className="p-2 ml-auto">
						<svg className="-icon">
							<use xlinkHref="/img/sprite.svg#icon-more"></use>
						</svg>
					</button>
				</Tippy>
				<button className="p-2 pr-0" title="Logout" onClick={logout}>
					<svg className="-icon">
						<use xlinkHref="/img/sprite.svg#icon-logout"></use>
					</svg>
				</button> */}
			</div>
		</>
	)
})
