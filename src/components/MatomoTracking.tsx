import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { userState } from '../state/user'

export const MatomoTracking = observer(function MatomoTracking() {
	useEffect(() => {
		const w = window as any as { _paq: string[][] }
		const _paq = (w._paq = w._paq || [])
		_paq.push(['enableLinkTracking'])
		_paq.push(['enableHeartBeatTimer'])
		const u = 'https://moneyinthepot.matomo.cloud/'
		_paq.push(['setTrackerUrl', u + 'matomo.php'])
		_paq.push(['setSiteId', '1'])
		const d = document,
			g = d.createElement('script'),
			s = d.getElementsByTagName('script')[0]
		g.async = true
		g.src = '//cdn.matomo.cloud/moneyinthepot.matomo.cloud/matomo.js'
		s.parentNode?.insertBefore(g, s)
		console.log('matomo loaded')
	}, [])

	const router = useRouter()

	useEffect(() => {
		const w = window as any as { _paq: string[][] }
		const userId = userState.user?.id || ''
		w._paq.push(['setUserId', userId])
		w._paq.push(['setDocumentTitle', document.title])
		w._paq.push(['trackPageView'])
	}, [router.asPath, userState.user?.id])

	return null
})
