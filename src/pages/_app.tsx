import '../styles/tailwind.css'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { userState } from '../state/user'
import { runInAction } from 'mobx'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../state/queryClient'
import { MatomoTracking } from '../components/MatomoTracking'
import { useRouter } from 'next/router'
import dayjsDuration from 'dayjs/plugin/duration'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime'
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat'
import dayjs from 'dayjs'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { themeState } from '../state/react/useTheme'

dayjs.extend(dayjsDuration)
dayjs.extend(dayjsRelativeTime)
dayjs.extend(dayjsAdvancedFormat)
dayjs.Ls.en.weekStart = 1

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()

	useEffect(() => {
		userState.load().finally(() =>
			runInAction(() => {
				setTimeout(() => {
					runInAction(() => {
						userState.loaded = true
					})
				}, 1000)
			})
		)
	}, [])

	useEffect(() => {
		;(window as any).useTokens = (a: string, b: string) => {
			runInAction(() => {
				userState.tokens.accessToken = a
				userState.tokens.refreshToken = b
				userState.save()
			})
		}
		const refreshToken = getUrlParameter('refreshToken', window.location.href)
		if (refreshToken) {
			userState.tokens.refreshToken = refreshToken
			userState.save()
			userState.load()
		}
	}, [])

	const getUrlParameter = (name, url) => {
		name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]')
		var regex = new RegExp('[\\?&]' + name + '=([^&]*)')
		var results = regex.exec(url)
		return results === null ? '' : results[1]
	}

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, user-scalable=0"
				/>
				<link rel="shortcut icon" href="/favicon.ico" />
				<script
					type="application/javascript"
					src="https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver"
				></script>
			</Head>
			<ToastContainer theme={themeState.theme} />
			<QueryClientProvider client={queryClient}>
				<MatomoTracking />
				<div>
					<Component {...pageProps} />
				</div>
			</QueryClientProvider>
		</>
	)
}
export default MyApp
