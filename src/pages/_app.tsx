import '../styles/tailwind.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { userState } from '../state/user'
import { runInAction } from 'mobx'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../state/queryClient'

import dayjsDuration from 'dayjs/plugin/duration'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(dayjsDuration)
dayjs.extend(dayjsRelativeTime)

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		userState.load().finally(() =>
			runInAction(() => {
				userState.loaded = true
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
	}, [])

	useEffect(() => {
		// document.getElementsByTagName('html')[0].classList.add('dark')
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<Component {...pageProps} />
			</div>
		</QueryClientProvider>
	)
}
export default MyApp
