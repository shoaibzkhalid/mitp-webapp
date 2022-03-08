import {
	Elements,
	PaymentElement,
	useElements,
	useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Api } from '../../api'
import { AppEnv } from '../../env'
import { Button } from '../ui/Button'
import { createModalComponent } from '../ui/Modal'
import { ButtonCloseModal } from './ButtonCloseModal'

let stripe: any

export const ModalAddPaymentCard = createModalComponent(
	function ModalAddPaymentCard(props) {
		if (!stripe) stripe = loadStripe(AppEnv.stripeApiKey)

		const setupIntent = useQuery(
			'createCardSetupIntent',
			() => Api.user.stripeCreateCardSetupIntent(),
			{
				refetchOnWindowFocus: false
			}
		)

		if (!setupIntent.data) return <p>Loading...</p>
		return (
			<Elements
				stripe={stripe}
				options={{
					clientSecret: setupIntent.data.clientSecret
				}}
			>
				<Form {...props} />
			</Elements>
		)
	}
)

interface FormProps {
	onRequestClose(): any
}
function Form(props: FormProps) {
	const stripe = useStripe()
	const elements = useElements()
	const [cardComplete, setCardComplete] = useState(false)
	const [error, setError] = useState('')

	const saveCard = useMutation(async () => {
		setError('')
		const res = await stripe.confirmSetup({
			elements,
			confirmParams: {
				return_url: AppEnv.webBaseUrl + '/payouts'
			},
			redirect: 'if_required'
		})
		if (res.error) setError(res.error.message)
		else props.onRequestClose()
	})

	return (
		<>
			<div className="flex items-center justify-center">
				<div className="font-bold text-xl">Add new card</div>
				<div className="ml-auto">
					<ButtonCloseModal onClick={props.onRequestClose} />
				</div>
			</div>
			<div>
				{error && <div>Error: {error}</div>}

				<PaymentElement onChange={e => setCardComplete(e.complete)} />

				<div className="mt-4"></div>
				<Button
					disabled={saveCard.isLoading || !cardComplete}
					onClick={() => saveCard.mutate()}
				>
					Add card
				</Button>
			</div>
		</>
	)
}
