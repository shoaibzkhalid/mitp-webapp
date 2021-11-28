import clsx from 'clsx'
import { when } from 'mobx'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import {
	SidebarContext,
	SidebarContextProvider
} from '../../state/contexts/sidebarContext'
import { useMediaQuery } from '../../state/react/useMediaQuery'
import { userState } from '../../state/user'
import { SpinnerBig } from '../SpinnerBig'
import { Sidebar } from './Sidebar'

const DashboardLayout = observer(function DashboardLayout(props: {
	contents: () => JSX.Element
}) {
	const router = useRouter()
	const Component = props.contents
	useEffect(() => {
		const pr = when(() => userState.loaded)
		pr.then(() => {
			if (!userState.user) router.push('/create')
		})
		return () => pr.cancel()
	}, [])

	const isMobile = useMediaQuery('(max-width: 1024px)')
	const [sidebarState] = useContext(SidebarContext)
	
	return (
		<>
			<Head>
				<title>Dashboard - Camelot</title>
			</Head>

			{!userState.user ? (
				<SpinnerBig />
			) : (
				<div className="flex flex-row h-screen">
					{isMobile ? (
						<div
							className={clsx(
								'w-full max-w-xs -sidebar-wrapper-mobile',
								sidebarState.isOpen && '--open'
							)}
						>
							<Sidebar isMobile={isMobile}></Sidebar>
						</div>
					) : (
						<div className="w-full max-w-xs p-6 border-r border-gray-200 dark:border-gray-700">
							<Sidebar isMobile={isMobile}></Sidebar>
						</div>
					)}
					<div
						className="flex-grow"
					>
						<Component />
					</div>
				</div>
			)}
		</>
	)
})

/**
 * Why this is needed: To make sure that the dashboard contents are never
 * rendered (the function never called) until the user object is populated. This
 * wouldn't work with `children`.
 */
export function wrapDashboardLayout(el: () => any) {
	el = observer(el)
	return function DashboardLayoutWrapper() {
		return (
			<SidebarContextProvider>
				<DashboardLayout contents={el}></DashboardLayout>
			</SidebarContextProvider>
		)
	}
}
