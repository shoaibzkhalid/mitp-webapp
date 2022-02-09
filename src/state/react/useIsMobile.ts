import { useMediaQuery } from './useMediaQuery'

export function useIsMobile() {
	return useMediaQuery('(max-width: 1024px)')
}
