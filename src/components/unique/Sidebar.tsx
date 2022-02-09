import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Select from 'react-select'
import { Api } from '../../api'
import { selectedPotState } from '../../state/react/useSelectedPot'
import Link from 'next/link'
import clsx from 'clsx'
import ThemeSwitcher from '../switch'
import { getReactSelectTheme } from '../../state/react/useTheme'
import { useContext, useState } from 'react'
import { ModalProfileSetting } from '../modals/ModalProfileSetting'
import { userState } from '../../state/user'
import Tippy from '@tippyjs/react'
import { useIsMobile } from '../../state/react/useIsMobile'
import { SidebarContext } from '../../state/contexts/sidebarContext'
import { toggleSideBar } from '../../utils/common'

export function Sidebar() {
	return (
		<div
			className={clsx(
				'w-80 max-w-[100vw] h-screen overflow-y-auto bg-white',
				'border-r border-gray-200 dark:border-gray-700 dark:bg-gray-900',
				'flex flex-col'
			)}
		>
			<SidebarHeader />
			<div className="px-6">
				<SidebarPotSelector />
				<div className="mt-10"></div>
				<SidebarLinks />
			</div>
			<div className="mt-auto p-6 pb-5 flex flex-col items-center justify-center">
				<ThemeSwitcher />
				<div className="mt-4"></div>
				<Profile />
			</div>
		</div>
	)
}

function SidebarHeader() {
	const isMobile = useIsMobile()
	const [sidebarState, setSidebarState] = useContext(SidebarContext)
	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	return (
		<div
			className={clsx(
				'flex items-center justify-center p-6',
				isMobile && 'mb-4'
			)}
		>
			<Link href="/home">
				<a className={clsx(!isMobile && 'py-4')}>
					<svg
						height="36"
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
				</a>
			</Link>

			{isMobile && (
				<div className="ml-auto">
					<button onClick={handleClickToggleSideBar}>
						<svg className="-icon">
							<use xlinkHref="/img/sprite.svg#icon-close"></use>
						</svg>
					</button>
				</div>
			)}
		</div>
	)
}

const SidebarPotSelector = observer(function SidebarPotSelector() {
	const pots = useQuery('userPots', Api.userPots.list)
	const router = useRouter()

	const options =
		pots.data?.map(pot => ({
			value: pot.moneyPot!.id,
			label: pot.moneyPot!.title || 'No title'
		})) ?? []

	return (
		<Select
			placeholder="Switch pot..."
			isLoading={pots.isLoading}
			options={options}
			isOptionSelected={option => option.value === selectedPotState.moneyPotId}
			onChange={option => {
				runInAction(() => {
					selectedPotState.moneyPotId = option.value
				})
				router.push('/home')
			}}
			theme={getReactSelectTheme()}
		/>
	)
})

function SidebarLinks() {
	const [currentModal, setCurrentModal] = useState(null as null | 'sweatJarFee')

	return (
		<>
			<ModalProfileSetting
				isOpen={currentModal === 'sweatJarFee'}
				onRequestClose={() => setCurrentModal(null)}
			/>

			<SidebarLink icon={linkIcons.overview} label="Home" link="/home" />
			<SidebarLink
				icon={linkIcons.discovery}
				label="Overview"
				link="/overview"
			/>
			<SidebarLink
				icon={linkIcons.wallet}
				label="Your Payouts"
				link="/payouts"
			/>
			<SidebarLink
				icon={linkIcons.settings}
				label="Set Swear Jar Fee"
				onClick={() => setCurrentModal('sweatJarFee')}
			/>
			<SidebarLink
				icon={linkIcons.document}
				label="Send Feedback"
				onClick={() => {}}
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
}
function SidebarLink(props: SidebarLinkProps) {
	const currentPath = useRouter().asPath
	const isActive = props.link && props.link === currentPath

	const button = (
		<div
			className={clsx(
				`text-left cursor-pointer px-5 py-4 flex flex-row items-start rounded-xl text-sm font-bold transition-colors`,
				isActive
					? `bg-primary text-white`
					: 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
			)}
		>
			<span className="w-8">{props.icon}</span>
			{props.label}
		</div>
	)

	if (props.link)
		return (
			<Link href={props.link}>
				<a>{button}</a>
			</Link>
		)
	return <button onClick={props.onClick}>{button}</button>
}

const Profile = observer(function Profile() {
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
			/>

			<div className="flex items-center w-full">
				<img
					src={user?.avatarUri}
					title="Profile picture"
					alt="?"
					className="h-10 w-10 rounded-full mr-2"
				/>
				<div className="font-bold p-2">
					{user?.firstName || <span className="text-gray-400">Anonymous</span>}
				</div>
				<Tippy
					interactive
					interactiveBorder={10}
					content={
						<div className="border dark:border-gray-500 shadow p-4 bg-white dark:bg-dark rounded-xl w-48">
							<button
								onClick={logout}
								className="hover:underline block w-full text-left text-red-600"
							>
								Logout
							</button>
							<button
								onClick={() => setCurrentModal('profileSettings')}
								className="mt-4 hover:underline block w-full text-left"
							>
								Settings
							</button>
						</div>
					}
				>
					<button className="ml-auto p-2">
						<svg className="-icon">
							<use xlinkHref="/img/sprite.svg#icon-more"></use>
						</svg>
					</button>
				</Tippy>
				<button className="p-2 pr-0" title="Logout" onClick={logout}>
					<svg className="-icon">
						<use xlinkHref="/img/sprite.svg#icon-logout"></use>
					</svg>
				</button>
			</div>
		</>
	)
})
