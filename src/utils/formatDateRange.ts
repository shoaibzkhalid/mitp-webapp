import dayjs from 'dayjs'

export function formatDateRange(d1: dayjs.Dayjs, d2: dayjs.Dayjs) {
	if (d1.month() === d2.month()) {
		return d1.format(`MMMM Do`) + ' — ' + d2.format(`Do`)
	} else {
		return d1.format(`MMMM Do`) + ' — ' + d2.format(`MMMM Do`)
	}
}
