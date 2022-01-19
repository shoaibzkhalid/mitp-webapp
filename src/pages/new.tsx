import Head from 'next/head'
import { useRouter } from 'next/router'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { Header } from '../components/unique/Header'
import { Login } from '../components/Authentication/Login'
import { userState } from '../state/user'
import clsx from 'clsx'
import { runInAction } from 'mobx'

export default wrapDashboardLayout(function NewPage() {
	const router = useRouter()

	return (
		<>
			<Head>
				<title>New</title>
			</Head>

			<div style={{ maxWidth: '1100px', margin: '0 auto' }}>
				<div className="w-full flex flex-col-reverse xl:flex-row">
					<div className="px-6 py-7 border-b border-gray-200 dark:border-gray-700 sm:px-0 md:py-1 xl:pt-12 xl:w-2/12 xl:border-b-0">
						<div className="font-poppins flex justify-between items-center xl:justify-center lg:justify-end">
							<Header />
						</div>
					</div>
				</div>

				<div
					className="flex justify-center items-center"
					style={{ height: 'calc(100vh - 80px)' }}
				>
					<div className="">
						<div className="flex justify-center mr-4">
							<img src="/img/add-task.svg" />
						</div>
						<div className="font-bold text-3xl text-center my-5">
							Let’s Get Started
						</div>
						<div className="text-center text-gray-400">
							<p>Create your first Pot to get started. It’s free</p>
							<p>and takes seconds.</p>
						</div>
						<div className="flex justify-center my-2">
							<img src="/img/round-arrow.svg" width={25} />
						</div>
						<div className="py-2 flex justify-center">
							<button
								className={clsx(
									'px-16 py-3 rounded-lg bg-primary text-white text-xl',
									userState.tokens.accessToken === null ? 'disable-event' : ''
								)}
								onClick={() => {
									router.push('/create')
									// runInAction(() => {
									// 	userState.tokens = {
									// 		accessToken: null,
									// 		refreshToken: null
									// 	}
									// })
								}}
							>
								Create Pot
							</button>
						</div>
					</div>
				</div>
				{userState.tokens.accessToken === null && (
					<div className="hidden">
						<Login title={''} autoLoad={true}></Login>
					</div>
				)}
			</div>
		</>
	)
})
