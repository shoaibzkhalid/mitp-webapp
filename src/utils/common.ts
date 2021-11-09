export function toggleSideBar(isOpen: boolean) {
	console.log('isOpen', isOpen)
	const html = document.querySelector('html')
	if (isOpen) html?.classList.add('no-scroll')
	else html?.classList.remove('no-scroll')
}
