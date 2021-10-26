import { useEffect, useState } from 'react'

export function useNextAppElement() {
	const [appElement, setAppElement] = useState(null as any)
	useEffect(() => {
		setAppElement(document.getElementById('__next'))
	}, [])
	return appElement
}
