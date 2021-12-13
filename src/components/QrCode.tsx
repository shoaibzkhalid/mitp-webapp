import QR from 'qrcode'
import { useQuery } from 'react-query'

interface QrCodeProps {
	url: string
}
export function QrCode(props: QrCodeProps) {
	const dataUri = useQuery(['qrcode', props.url], () => QR.toDataURL(props.url))

	if (!dataUri.data) return null

	return <img src={dataUri.data} alt="QR Code for your pot" />
}
