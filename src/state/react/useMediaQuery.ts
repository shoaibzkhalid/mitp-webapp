import { useEffect, useState } from 'react'

export function useMediaQuery(q: string) {
	const [result, setResult] = useState(false)
	useEffect(() => {
		const mq = window.matchMedia(q)
		const cb = (m: MediaQueryListEvent) => setResult(m.matches)
		mq.addEventListener('change', cb)
		if (mq.matches !== result) setResult(mq.matches)
		return () => mq.removeEventListener('change', cb)
	}, [])
	return result
}
