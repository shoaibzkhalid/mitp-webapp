import { ModalProps } from './types'
import { Input } from '../Input'

export function ProfileSettingModalInner({ closeModal }: ModalProps) {
	return (
		<>
			<div className="px-0 sm:px-6">
				<div
					className="text-xl font-poppins flex items-center justify-center pt-4"
				>
					<div>Weekend Workouts</div>
					<div className="absolute right-2 sm:right-12">
						<button
							className="-button -round hover:shadow-lg text-sm"
							onClick={() => closeModal()}
						>
							x
						</button>
					</div>
				</div>

				<div
					className="flex justify-center mt-10"
				>
					<div className="relative">
						<img
							className="inline-block w-full max-w-sm"
							src="/img/ava.png"
						/>
						<img className="inline-block absolute right-2 -bottom-2 cursor-pointer" src="/img/edit-icon.svg" style={{
							maxHeight: 70,
							maxWidth: 70,							
						}} />
					</div>
				</div>

				<div className="mt-10">
					<Input
						placeholder="Enter first name"
						inputClassName="focus:outline-none"
						inputStyle={{
							backgroundColor: '#f7f7f7',
							color: '#d0d0d6',
							padding: '20px 20px'
						}}
					/>
				</div>

				<div
					className="mt-10 flex flex-col items-center rounded-2xl border-dashed border-gray-300 border-4"				
				>
					<div className="mt-3 text-gray-400">0/1</div>
					<div className="mt-3 font-bold text-xl">
						Connect PayPal
					</div>
					<div className="mt-3 mb-3 text-primary">
						-Go to my payouts-
					</div>
				</div>

				<div
					className="mt-10 flex items-center justify-between"
				>
					<div className="text-md font-bold sm:font-extrabold sm:text-xl">
						Ready up to join pot
					</div>
					<div className="flex items-center">
						<span className="mr-3 text-gray-400">
							leave/join
						</span>
						<label className="flex items-center cursor-pointer">
							<div className="relative">
								<input type="checkbox" id="toggleB" className="sr-only" />
								<div className="checkbox-bg block bg-gray-600 w-14 h-8 rounded-full"></div>
								<div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
							</div>
						</label>
					</div>
				</div>

				<div className="mt-10">
					<ul className="list-disc">
						<li>
							Members pay in $5 to the pot for missed week. Check in by Sunday
							to be safe.
						</li>
						<li>Profits shared at end of month. Must be in pot to earn.</li>
					</ul>
				</div>

				<div className="text-gray-400 mt-10">
					By connecting with paypal you are agreeing to{' '}
					<span className="text-primary">terms and conditions</span> and <span className="text-primary">privacy policy</span>
				</div>
			</div>
		</>
	)
}
