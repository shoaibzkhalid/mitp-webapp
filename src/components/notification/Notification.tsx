import classes from './Styles.module.css'
import clsx from 'clsx'

interface NotificationProps {
	message: string
}

export default function Notification(props: NotificationProps) {
	const { message } = props
	return (
		<div className={clsx(classes.notification, classes.visible)}>
			{message}!
		</div>
	)
}
