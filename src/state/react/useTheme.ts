import { observable, runInAction } from 'mobx'

type ThemeMode = 'dark' | 'light'
export const themeState = observable({
	theme: 'light' as ThemeMode,

	changeMode(mode: ThemeMode) {
		runInAction(() => {
			themeState.theme = mode
		})
	}
})

export function getReactSelectTheme(): any {
	if (themeState.theme === 'light') return undefined
	return {
		colors: {
			neutral0: '#29303d',
			neutral5: 'rgba(255, 255, 255, 0.1)',
			neutral10: 'rgba(255, 255, 255, 0.2)',
			neutral20: 'rgba(255, 255, 255, 0.3)',
			neutral30: 'rgba(255, 255, 255, 0.4)',
			neutral40: 'rgba(255, 255, 255, 0.5)',
			neutral50: 'rgba(255, 255, 255, 0.6)',
			neutral60: 'rgba(255, 255, 255, 0.7)',
			neutral70: 'rgba(255, 255, 255, 0.8)',
			neutral80: 'rgba(255, 255, 255, 0.9)',
			neutral90: 'rgba(255, 255, 255, 1)',
			primary: '#6C5DD3',
			primary25: '#6C5DD3',
			primary50: '#6C5DD3',
			primary75: '#6C5DD3'
		}
	}
}
