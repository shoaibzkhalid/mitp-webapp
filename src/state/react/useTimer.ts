import { useEffect } from 'react'

export function useTimer(f: () => any, ms: number) {
	useEffect(() => {
		f()
		const interval = setInterval(f, ms)
		return () => clearInterval(interval)
	}, [])
}
