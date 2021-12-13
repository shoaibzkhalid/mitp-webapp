import { useState } from 'react'
import { SelectInput } from '../SelectInput'
import { ModalProps } from './types'
import clsx from 'clsx'
import { userState } from '../../state/user'

export function WithdrawModalInner({ closeModal }: ModalProps) {
	const [user, setUser] = useState({
		firstName: userState.user!.firstName,
		lastName: userState.user!.lastName
	})

	const [otherAmountIsSelected, setOtherAmountIsSelected] = useState(false)
	const [amount, setAmount] = useState('200.0')

	return (
		<>
			<div className="text-xl font-poppins flex items-center">
				<div>Withdraw</div>
				<div className="ml-auto">
					<button
						className="-button -round hover:shadow-lg text-sm"
						onClick={closeModal}
					>
						x
					</button>
				</div>
			</div>

			<div className="font-poppins py-6">
				<div className="py-2 text-gray-400">Available Credits</div>
				<div className="py-2">$476.00</div>
			</div>

			<div className="font-poppins">
				<div className="text-gray-400">Payment method</div>
				<div className="py-3">
					<SelectInput
						height="undefined"
						selectClassName="bg-alabaster p-4 focus:outline-none"
						options={[
							{ label: `Paypal (${user.firstName} ${user.lastName})`, value: 1 }
						]}
						setValue={() => {}}
					/>
				</div>
			</div>

			<div className="font-poppins py-6">
				<div className="text-gray-400">Amount</div>
				<div className="py-3">
					<div className="radio-holder">
						<label className="container">
							<span className="text-md">$476.00</span>
							<input
								type="radio"
								checked={otherAmountIsSelected ? false : true}
								name="radio"
								onClick={e => {
									setOtherAmountIsSelected(false)
								}}
							/>
							<span className="checkmark"></span>
						</label>
					</div>
					<div className="radio-holder">
						<label className="container">
							<span className="text-md">Other amount</span>
							<input
								type="radio"
								checked={otherAmountIsSelected ? true : false}
								name="radio"
								onClick={e => {
									setOtherAmountIsSelected(true)
								}}
							/>
							<span className="checkmark"></span>
						</label>
					</div>
				</div>

				<div className="py-3 ml-8">
					<div className="flex items-center">
						<div className="" style={{ width: '60%' }}>
							<div className="flex">
								<input
									style={{ width: '20%' }}
									disabled
									placeholder="$"
									className="w-full rounded-md p-3 bg-white dark:bg-transparent focus:outline-none bg-alabaster p-4"
								/>
								<input
									disabled={otherAmountIsSelected ? false : true}
									value={otherAmountIsSelected ? amount : 0}
									dir="rtl"
									type="text"
									className={clsx(
										'w-full rounded-md p-3 bg-white dark:bg-transparent focus:outline-none bg-alabaster p-4',
										otherAmountIsSelected ? '' : 'text-gray-100'
									)}
									onChange={e => {
										setAmount(e.target.value)
									}}
								/>
							</div>
						</div>
						<div className="ml-5 text-xl text-bold">USD</div>
					</div>
					<div className="text-gray-400 text-sm mt-3 font-thin italic">
						You can only withdraw $20 in credits or more
					</div>
				</div>

				<hr className="my-5"></hr>

				<div className="py-3 flex justify-between">
					<div>Total Amount</div>
					{otherAmountIsSelected ? (
						<>
							<div>${amount}</div>
						</>
					) : (
						<>
							<div>$476</div>
						</>
					)}
				</div>

				<hr className="mt-5"></hr>

				<div className="flex justify-end mt-5">
					<button
						style={{ fontWeight: 100 }}
						className={
							'mt-5 -button -shark text-lg bg-shark w-full sm:w-auto font-extralight'
						}
					>
						Withdraw
					</button>
				</div>
			</div>
		</>
	)
}
