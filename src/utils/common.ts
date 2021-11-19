export function toggleSideBar(isOpen: boolean) {
	const html = document.querySelector('html')
	if (isOpen) html?.classList.add('no-scroll')
	else html?.classList.remove('no-scroll')
}

export function getCheckInProgress(value: number, type: string) {
	let percent: string = '0%'
	const checkInValues: number[] = [3, 5, 10, 20, 30]
	const streakValues: number[] = [2, 5, 10, 15, 20]
	const payinValues: number[] = [5, 20, 40, 50]
	if (type === 'checkin' && value) {
		if (checkInValues[0] <= value && value < checkInValues[1]) percent = '20%'
		else if (checkInValues[1] <= value && value < checkInValues[2])
			percent = '40%'
		else if (checkInValues[2] <= value && value < checkInValues[3])
			percent = '60%'
		else if (checkInValues[3] <= value && value < checkInValues[4])
			percent = '80%'
		else if (checkInValues[4] <= value) percent = '100%'
		else percent = '0%'
	} else if (type === 'streak' && value) {
		percent = '25%'
		if (streakValues[0] <= value && value < streakValues[1]) percent = '20%'
		else if (streakValues[1] <= value && value < streakValues[2])
			percent = '40%'
		else if (streakValues[2] <= value && value < streakValues[3])
			percent = '60%'
		else if (streakValues[3] <= value && value < streakValues[4])
			percent = '80%'
		else if (streakValues[4] <= value) percent = '100%'
		else percent = '0%'
	} else if (type === 'payin' && value) {
		if (payinValues[0] <= value && value < payinValues[1]) percent = '25%'
		else if (payinValues[1] <= value && value < payinValues[2]) percent = '50%'
		else if (payinValues[2] <= value && value < payinValues[3]) percent = '75%'
		else if (payinValues[3] <= value) percent = '100%'
		else percent = '0%'
	}
	return percent
}
