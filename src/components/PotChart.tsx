import { observer } from 'mobx-react-lite'
import ReactApexChart from 'react-apexcharts'
import { useSelectedPot } from '../state/useSelectedPot'

const blue = '#A0D7E7'
const purple = '#6C5DD3'
const borderColor = '#E4E4E4'

export default observer(function PotChart() {
	const pot = useSelectedPot()

	if (!pot.data) return null

	const options = {
		labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
		colors: [purple, blue],
		chart: {
			height: '100%',
			type: 'bar',
			toolbar: {
				show: false
			}
		},
		grid: {
			borderColor: borderColor,
			strokeDashArray: 0,
			xaxis: {
				lines: {
					show: false
				}
			},
			yaxis: {
				lines: {
					show: false
				}
			},
			padding: {
				top: 0,
				left: 10,
				right: 0,
				bottom: 0
			}
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 0.9
				}
			}
		},
		dataLabels: {
			enabled: false
		},
		plotOptions: {
			bar: {
				columnWidth: '60%'
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			x: {
				show: false
			},
			shared: true,
			intersect: false
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
			tooltip: {
				enabled: false
			}
		},
		yaxis: {
			axisBorder: {
				color: borderColor
			},
			axisTicks: {
				show: false
			},
			tooltip: {
				enabled: false
			}
		}
	}

	return (
		<ReactApexChart
			options={options as any}
			type="bar"
			series={[
				{
					name: 'Check ins',
					data: [60, 25, 44, 37]
				},
				{
					name: 'Pay ins',
					data: [40, 16, 38, 30]
				}
			]}
		/>
	)
})
