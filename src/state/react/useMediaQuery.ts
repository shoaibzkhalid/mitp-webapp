import { useEffect, useState } from 'react'

export function useMediaQuery(q: string) {
	const [result, setResult] = useState(false)
	useEffect(() => {
		const mq = window.matchMedia(q)
		const cb = (m: MediaQueryListEvent) => setResult(m.matches)

		if (mq.addEventListener) {
			mq.addEventListener('change', cb)
			if (mq.matches !== result) setResult(mq.matches)
			return () => mq.removeEventListener('change', cb)
		} else {
			mq.addListener(cb)
			if (mq.matches !== result) setResult(mq.matches)
			return () => mq.removeListener(cb)
		}
	}, [])
	return result
}
