export function formatDuration(seconds: number) {
	const days = Math.floor(seconds / (3600 * 24))
	seconds = seconds % (3600 * 24)
	const hours = Math.floor(seconds / 3600)
	seconds = seconds % 3600
	const minutes = Math.floor(seconds / 60)
	seconds = seconds % 60

	const o: [string, number][] = [
		['day', days],
		['hour', hours],
		['minute', minutes]
	]
	const timeData = o.map(([word, count]) => {
		return `${count} ${word}${count !== 1 ? 's' : ''}`
	})
	return timeData[0] + ', ' + timeData[1] + ', ' + timeData[2]
}
