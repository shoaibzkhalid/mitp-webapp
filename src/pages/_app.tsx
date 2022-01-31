import '../styles/tailwind.css'
import '../styles/globals.css'
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
dayjs.extend(dayjsDuration)
dayjs.extend(dayjsRelativeTime)
dayjs.extend(dayjsAdvancedFormat)
dayjs.Ls.en.weekStart = 1

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
  		
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
		const accessToken = getUrlParameter('accessToken', window.location.href);
		const refreshToken = getUrlParameter('refreshToken', window.location.href);
		if(accessToken && refreshToken) {
			userState.tokens.accessToken = accessToken
			userState.tokens.refreshToken = refreshToken
			userState.save()
			userState.load()
		}
	}, [])

    const getUrlParameter = (name, url) => {
        name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&]*)');
        var results = regex.exec(url);
        return results === null ? '' : results[1];
    }

	return (
		<QueryClientProvider client={queryClient}>
			<MatomoTracking />
			<div>
				<Component {...pageProps} />
			</div>
		</QueryClientProvider>
	)
}
export default MyApp
