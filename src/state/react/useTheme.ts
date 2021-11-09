import { observable, runInAction } from 'mobx'

type ThemeMode = 'dark' | 'light'
export const themeState = observable({
	theme: 'light' as ThemeMode,

	async changeMode(mode: ThemeMode) {
		runInAction(() => {
			themeState.theme = mode
		})
	}
})
