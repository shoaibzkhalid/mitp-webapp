import clsx from 'clsx'
import { useState } from 'react'
import classes from './Styles.module.css'

const ButtonsSwitch = ({
	button1Data,
	button2Data,
	setInviteMode,
	inviteMode
}) => {
	const [btnSelected, setBtnSelected] = useState('btn1')

	// const btnClick = e => {
	// 	const btnswtichComponents = document.querySelectorAll('.btnswitch__btn')
	// 	if (!e.target.classList.contains('active')) {
	// 		removeActive(btnswtichComponents)
	// 		e.target.classList.add('active')
	// 		e.target.classList.contains('btnswitch__left')
	// 			? setBtnSelected('btn1')
	// 			: setBtnSelected('btn2')
	// 	} else return null
	// }

	// const removeActive = elements => {
	// 	elements.forEach(item => {
	// 		item.classList.remove('active')
	// 	})
	// }

	const btnClick = e => {
		setInviteMode(e.target.id)
	}

	return (
		<div className={clsx(classes.btnswitch, 'my-5')}>
			<button
				id="anyone"
				className={clsx(
					'-button -sm  btnswitch__btn btnswitch__btn-left',
					classes.btnswitch__left,
					inviteMode === 'anyone' ? 'active' : ''
				)}
				onClick={e => btnClick(e)}
			>
				{button1Data}
			</button>
			<button
				id="only"
				className={clsx(
					'-button -sm btnswitch__btn btnswitch__btn-right',
					classes.btnswitch__right,
					inviteMode !== 'anyone' ? 'active' : ''
				)}
				onClick={e => btnClick(e)}
			>
				{button2Data}
			</button>
		</div>
	)
}

export default ButtonsSwitch
