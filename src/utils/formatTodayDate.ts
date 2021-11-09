import dayjs from 'dayjs'
export function formatTodayDate() {
	return `${dayjs().format('dddd, MMMM D')}th`
}
