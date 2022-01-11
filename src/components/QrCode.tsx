import QR from 'qrcode'
import { CSSProperties } from 'react'
import { useQuery } from 'react-query'

interface QrCodeProps {
	url: string

	style?: CSSProperties
	className?: string
}
export function QrCode(props: QrCodeProps) {
	const dataUri = useQuery(['qrcode', props.url], () =>
		QR.toDataURL(props.url, {
			type: 'image/jpeg',
			scale: 12,
			margin: 1,
			errorCorrectionLevel: 'low'
		})
	)

	if (!dataUri.data) return null

	return (
		<img
			src={dataUri.data}
			alt="QR Code for your pot"
			style={props.style}
			className={props.className}
		/>
	)
}
