import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelectedPot } from '../../state/react/useSelectedPot'

const blue = '#A0D7E7'
const purple = '#6C5DD3'
const borderColor = '#E4E4E4'

export default observer(function PotChart() {
	const pot = useSelectedPot()

	if (!pot.data) return null

	const options = useMemo(() => {
		return {
			labels: ['Week 1', 'Week 2', 'Week 3', 'This Week'],
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
				y: {
					formatter: function (value: number) {
						return 'N/A' //arr defined as a global variable
					}
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
				},
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
			},
			responsive: [
				{
					breakpoint: 420,
					options: {
						xaxis: {
							labels: {
								rotate: 0,
								style: {
									fontSize: '10px'
								}
							}
						},
						plotOptions: {
							bar: {
								barHeight: '100%',
								columnWidth: '50%'
							}
						},
					}
				}
			]
		}
	}, [])

	return (
		<div className="text-center">
			<ReactApexChart
				options={options as any}
				type="bar"
				series={[
					{
						name: 'Check ins',
						data: [30, 25, 44, 37]
					},
					{
						name: 'Pay ins',
						data: [10, 16, 38, 30]
					}
				]}
			/>
			<p>Group Activity last 30 days</p>
		</div>
	)
})
