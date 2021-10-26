import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useContext, useMemo, useState } from 'react'
import ReactModal from 'react-modal'
import { CheckInRulesModalInner } from '../modals/CheckInRulesModalInner'
import { PayInRulesModalInner } from '../modals/PayInRulesModalInner'
import { PayoutScheduleModalInner } from '../modals/PayoutScheduleModalInner'
import { UserSettingsModalInner } from '../modals/UserSettingsModalInner'
import { SidebarPotsSelector } from './SidebarPotsSelector'
import { useNextAppElement } from '../../state/useNextAppElement'
import { SidebarContext } from '../../state/sidebarContext'
import { useSelectedPot } from '../../state/useSelectedPot'

interface SidebarProps {
	isMobile: boolean
}
export function Sidebar(props: SidebarProps) {
	const { asPath } = useRouter()
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
	const [sidebarState, setSidebarState] = useContext(SidebarContext)
	const pot = useSelectedPot()

	return (
		<div style={{ height: '100vh' }} className="overflow-y-auto w-full">
			<div className="flex items-center justify-center p-8">
				{props.isMobile && (
					<button
						className="mr-auto"
						onClick={() =>
							setSidebarState({
								isOpen: false
							})
						}
					>
						x
					</button>
				)}
				<svg
					width="131"
					height="37"
					viewBox="0 0 131 37"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M39.85 0.899999V36H31.3V14.95L23.45 36H16.55L8.65 14.9V36H0.1V0.899999H10.2L20.05 25.2L29.8 0.899999H39.85ZM54.5484 0.899999V36H45.9984V0.899999H54.5484ZM85.9945 0.899999V7.75H76.6945V36H68.1445V7.75H58.8445V0.899999H85.9945ZM117.036 12.2C117.036 14.2333 116.569 16.1 115.636 17.8C114.702 19.4667 113.269 20.8167 111.336 21.85C109.402 22.8833 107.002 23.4 104.136 23.4H98.8355V36H90.2855V0.899999H104.136C106.936 0.899999 109.302 1.38333 111.236 2.35C113.169 3.31666 114.619 4.65 115.586 6.35C116.552 8.05 117.036 10 117.036 12.2ZM103.486 16.6C105.119 16.6 106.336 16.2167 107.136 15.45C107.936 14.6833 108.336 13.6 108.336 12.2C108.336 10.8 107.936 9.71667 107.136 8.95C106.336 8.18333 105.119 7.8 103.486 7.8H98.8355V16.6H103.486Z"
						fill="currentColor"
					/>
					<path
						d="M125.487 36.4C123.987 36.4 122.753 35.9667 121.787 35.1C120.853 34.2 120.387 33.1 120.387 31.8C120.387 30.4667 120.853 29.35 121.787 28.45C122.753 27.55 123.987 27.1 125.487 27.1C126.953 27.1 128.153 27.55 129.087 28.45C130.053 29.35 130.537 30.4667 130.537 31.8C130.537 33.1 130.053 34.2 129.087 35.1C128.153 35.9667 126.953 36.4 125.487 36.4Z"
						fill="#6C5DD3"
					/>
				</svg>
			</div>

			<SidebarPotsSelector></SidebarPotsSelector>

			<div className="text-gray-500 text-sm px-5 my-4 mt-6">
				Your Group &mdash; {pot.data?.users.length} member
				{pot.data?.users.length !== 1 && 's'}
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
						<Link href={link[0]}>
							<a
								className={clsx(
									`px-5 py-4 flex flex-row items-center rounded-xl text-sm font-bold transition-colors`,
									activeLink === link
										? `bg-primary text-white`
										: 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
								)}
							>
								{link[3]}
								<div className="ml-4">{link[2]}</div>
							</a>

							{}
						</Link>
					)}
				</div>
			))}

			<div className="border-t border-gray-300 dark:border-gray-700 mx-5 mt-7 mb-10"></div>

			<div className="text-gray-500  text-sm px-5 mb-4">Insights</div>

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
	)
}

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
		'Payouts',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-wallet"></use>
		</svg>
	],
	[
		'/settings',
		[],
		'Settings',
		<svg className="-icon">
			<use xlinkHref="/img/sprite.svg#icon-settings"></use>
		</svg>,
		UserSettingsModalInner
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
