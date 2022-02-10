import { observer } from 'mobx-react-lite'
import classes from './Styles.module.css'
import clsx from 'clsx'
import { themeState } from '../../state/react/useTheme'

export const ThemeSwitcher = observer(function ThemeSwitcher() {
	const { theme, changeMode } = themeState
	const toggleDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
		changeMode(event.target.checked ? 'dark' : 'light')
		const html = document.querySelector('html')
		event.target.checked
			? html?.classList.add('dark')
			: html?.classList.remove('dark')
	}

	return (
		<label className={classes.switch}>
			<input
				className={classes.switch__input}
				type="checkbox"
				onChange={toggleDarkMode}
			/>
			<span className={classes.switch__in}>
				<span
					className={clsx(
						classes.switch__box,
						theme === 'dark' ? classes.dark_switch__box : ''
					)}
				></span>
				<span
					className={clsx(
						classes.switch__icon,
						theme === 'dark' ? classes.dark_switch__in : ''
					)}
				>
					<svg className={clsx(classes.icon, classes.icon_moon)}>
						<use xlinkHref="/img/sprite.svg#icon-moon"></use>
					</svg>
					<svg className={clsx(classes.icon, classes.icon_sun)}>
						<use xlinkHref="img/sprite.svg#icon-sun"></use>
					</svg>
				</span>
			</span>
		</label>
	)
})
