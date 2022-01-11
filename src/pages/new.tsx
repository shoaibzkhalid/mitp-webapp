import Head from 'next/head'
import { useRouter } from 'next/router'
import { wrapDashboardLayout } from '../components/unique/DashboardLayout'
import { useSelectedPot } from '../state/react/useSelectedPot'
import { Header } from '../components/unique/Header'

export default wrapDashboardLayout(function NewPage() {
	const router = useRouter()
	const selectedPot = useSelectedPot()

	if (selectedPot.data) {
		return router.push('/home')
	}

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
								className="px-16 py-3 rounded-lg bg-primary text-white text-xl"
								onClick={() => {
									router.push('/create')
								}}
							>
								Create Pot
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
})
