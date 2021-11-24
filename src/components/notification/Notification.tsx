import classes from './Styles.module.css'
import clsx from 'clsx'

interface NotificationProps {
	message: string
	info?: string
}

export default function Notification(props: NotificationProps) {
	const { message, info } = props
	return (
		<div className={clsx(classes.notification, classes.visible)}>
			<div>
				<span>{message}</span> <span className="font-extrabold">{info}</span>!
			</div>
		</div>
	)
}
