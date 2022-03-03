import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { useMediaQuery } from '../../state/react/useMediaQuery'

const blue = '#A0D7E7'
const purple = '#6C5DD3'
const borderColor = '#E4E4E4'

export default observer(function CheckinUpdateChart() {
	const pot = useSelectedPot()
	const shrinkChart = useMediaQuery('(max-width: 480px)')

	if (!pot.data) return null

	const options = useMemo(() => {
		return {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
			colors: [purple],
			chart: {
				type: 'line',
				toolbar: {
					show: false
				},
				sparkline: {
					enabled: true
				}
			},
			grid: {
				borderColor: borderColor,
				strokeDashArray: 0,
				xaxis: {
					lines: {
						show: true
					}
				},
				yaxis: {
					lines: {
						show: false
					}
				}
			},
			tooltip: {
				enabled: false
			},
			stroke: {
				width: 2,
				curve: 'smooth'
			},
			xaxis: {
				axisBorder: {
					show: false
				},
				axisTicks: {
					show: false
				}
			},
			legend: {
				show: false
			},
			dataLabels: {
				enabled: false
			}
		}
	}, [])

	return (
		<ReactApexChart
			options={options as any}
			height="25px"
			width={shrinkChart ? '100px' : undefined}
			series={[
				{
					name: 'Check in',
					data: pot.data.dailyStatistics
				}
			]}
		/>
	)
})
