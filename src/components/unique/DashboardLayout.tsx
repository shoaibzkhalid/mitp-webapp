import clsx from 'clsx'
import { when } from 'mobx'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import {
	SidebarContext,
	SidebarContextProvider
} from '../../state/contexts/sidebarContext'
import { useIsMobile } from '../../state/react/useIsMobile'
import { userState } from '../../state/user'
import { OverlayLoadingAnimation } from '../OverlayLoadingAnimation'
import { Sidebar } from './Sidebar'

const DashboardLayout = observer(function DashboardLayout(props: {
	contents: () => JSX.Element
}) {
	const router = useRouter()
	const Component = props.contents

	useEffect(() => {
		const pr = when(() => userState.loaded)
		pr.then(() => {
			if (!userState.user)
				router.push(
					process.env.NODE_ENV === 'production'
						? '/'
						: process.env.NEXT_PUBLIC_LANDINGPAGE
				)
		})
		return () => pr.cancel()
	}, [])

	const isMobile = useIsMobile()
	const [sidebarState] = useContext(SidebarContext)

	return (
		<>
			<Head>
				<title>Dashboard - Camelot</title>
			</Head>
			{!userState.loaded ? (
				<OverlayLoadingAnimation />
			) : (
				<div className="flex">
					<div
						className={clsx(
							'fixed',
							isMobile && '-sidebar-wrapper-mobile',
							sidebarState.isOpen && '--open'
						)}
					>
						<Sidebar />
					</div>

					{!isMobile && <div className="w-80 max-w-[100vw] shrink-0"></div>}

					<div className="flex-grow">
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
