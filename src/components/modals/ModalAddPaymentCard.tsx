import {
	CardElement,
	Elements,
	useElements,
	useStripe
} from '@stripe/react-stripe-js'
import { loadStripe, StripeCardElementChangeEvent } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { Api } from '../../api'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { createModalComponent } from '../ui/Modal'
import { ButtonCloseModal } from './ButtonCloseModal'

let stripe: any

export const ModalAddPaymentCard = createModalComponent(
	function ModalAddPaymentCard(props) {
		if (!stripe)
			stripe = loadStripe(
				'pk_test_51KS10EGJs4qyPh0iDxXXmUmVQhQfriHv2zGjdB0nRpMaSPA15KJ8xDj5ar7T4sDKyvuUetoSafHGlX5EZI7sCybM00AkLidihA'
			)

		return (
			<Elements stripe={stripe}>
				<Form {...props} />
			</Elements>
		)
	}
)

function Form(props: any) {
	const elements = useElements()
	const stripe = useStripe()
	const [form, setForm] = useState({
		name: '',
		cardComplete: false
	})

	// Keeps form.cardComplete up-to-date with the card element
	useEffect(() => {
		const el = elements?.getElement('card')
		const handler = (e: StripeCardElementChangeEvent) =>
			setForm({ ...form, cardComplete: e.complete })
		el?.on('change', handler)
		return () => el?.off('change', handler) as any
	})

	const saveCard = useMutation(async () => {
		// stripe.card
		await Api.user.saveStripeCard(form.name)
		props.onRequestClose()
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
				<Input
					label="Cardholder Name"
					value={form.name}
					setValue={v => setForm({ ...form, name: v })}
				/>

				<div className="mt-4"></div>
				<label>Card</label>
				<div className="p-4 px-5 border bg-white rounded">
					<CardElement />
				</div>

				<div className="mt-4"></div>
				<Button
					disabled={
						saveCard.isLoading || form.name.length < 3 || !form.cardComplete
					}
				>
					Add card
				</Button>
			</div>
		</>
	)
}
