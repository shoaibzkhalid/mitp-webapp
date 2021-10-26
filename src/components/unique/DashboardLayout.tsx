import clsx from 'clsx'
import { when } from 'mobx'
import { observer } from 'mobx-react-lite'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import {
	SidebarContext,
	SidebarContextProvider
} from '../../state/sidebarContext'
import { useMediaQuery } from '../../state/useMediaQuery'
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
			// if (!userState.user) router.push('/paypal/login-initiate')
		})
		return () => pr.cancel()
	}, [])

	const isMobile = useMediaQuery('(max-width: 1100px)')
	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	return (
		<>
			<Head>
				<title>Dashboard - Camelot</title>
			</Head>

			{userState.user ? (
				<SpinnerBig />
			) : (
				<div className="flex flex-row">
					{isMobile ? (
						<div
							className={clsx(
								'w-full max-w-xs p-6 -sidebar-wrapper-mobile',
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

					<div className="w-full flex flex-col items-center">
						{isMobile && (
							<div
								className="w-full border-b border-gray-200"
								style={{ maxWidth: '1100px' }}
							>
								<button
									onClick={() =>
										setSidebarState({
											isOpen: true
										})
									}
								>
									(open menu, icon pending)
								</button>
							</div>
						)}
						<div className="w-full px-6" style={{ maxWidth: '1100px' }}>
							<Component></Component>
						</div>
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
