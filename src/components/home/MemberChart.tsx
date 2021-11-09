import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelectedPot } from '../../state/react/useSelectedPot'

const blue = '#A0D7E7'
const purple = '#6C5DD3'
const borderColor = '#E4E4E4'

interface MemberChartProps {
	checkinUserChartValue: number[]
}

export default observer(function MemberChart(props: MemberChartProps) {
	const { checkinUserChartValue } = props
	const pot = useSelectedPot()

	if (!pot.data) return null

	const options = useMemo(() => {
		return {
			colors: [purple, '#FFC0CB', borderColor],
			chart: {
				height: '100%',
				type: 'donut'
			},
			plotOptions: {
				pie: {
					donut: {
						size: '71%',
						polygons: {
							strokeWidth: 0
						}
					},
					expandOnClick: false
				}
			},
			dataLabels: {
				enabled: false
			},
			states: {
				hover: {
					filter: {
						type: 'darken',
						value: 0.9
					}
				}
			},
			legend: {
				show: false
			},
			tooltip: {
				enabled: false
			}
		}
	}, [])

	return (
		<ReactApexChart
			options={options as any}
			type="donut"
			series={checkinUserChartValue}
		/>
	)
})
