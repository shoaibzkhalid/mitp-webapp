import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { Button } from '../ui/Button'

const blue = '#A0D7E7'
const purple = '#6C5DD3'
const borderColor = '#E4E4E4'

export default (function EarningChart() {
	const pot = useSelectedPot()

	if (!pot.data) return null

	const options = useMemo(() => {
		return {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
			series: [
				{
					name: '',
					data: [25, 46, 64, 56, 28]
				}
			],
			colors: [purple],
			chart: {
				height: '100%',
				type: 'bar',
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
			stroke: {
				curve: 'smooth'
			},
			dataLabels: {
				enabled: false
			},
			plotOptions: {
				bar: {
					columnWidth: '80%'
				}
			},
			legend: {
				show: false
			},

			xaxis: {
				axisBorder: {
					show: false,
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
								barHeight: '80%',
								columnWidth: '20%'
							}
						}
					}
				}
			]
		}
	}, [])

	return (
		<div className="flex flex-col px-6 items-center">
			<ReactApexChart
				options={options as any}
				type="bar"
				series={[
					{
						name: '',
						data: [35, 66, 34, 56, 18]
					}
				]}
			/>
			<div className="font-semibold mb-8 mt-8">Your earning this month</div>
			<div className="text-6xl font-bold text-primary">479.4</div>
			<div className="text-sm mb-8">Update your payout method in Settings</div>
			<Button
				className="mb-8"
				// onClick={() => setCurrModal('addCard')}
				// disabled={card.isLoading}
			>
				Withdraw all earning
			</Button>
		</div>
	)
})
