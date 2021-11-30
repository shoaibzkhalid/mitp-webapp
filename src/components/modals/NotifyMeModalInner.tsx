export function NotifyMeModalInner({ closeModal }: any) {
	return (
		<div className="text-xl font-poppins px-2 sm:px-8">
			<div className="flex justify-end">
				<button
					className="-button -round hover:shadow-lg text-sm"
					onClick={() => closeModal()}
				>
					x
				</button>
			</div>

			<div className="flex justify-center">
				<img src="/img/mailbox.svg" />
			</div>

			<div className="p-0 sm:p-4 mt-10 flex items-center bg-gray-100 rounded-xl">
				<div className="px-3 py-2 text-gray-400 text-sm border-r border-gray-300">
					Status
				</div>
				<div className="w-full px-3 py-2">
					<select className="w-full outline-none focus:outline-none bg-gray-100 text-black dark:text-dark text-sm">
						<option>Enabled</option>
						<option>Disabled</option>
					</select>
				</div>
			</div>

			<div className="mt-10 text-center dark:text-white text-sm sm:text-xl">
				Get notified 24 hours before missing your weekly check-in and paying the
				pot
			</div>

			<div className="mt-10 rounded-xl border border-gray-300 p-3 bg-white">
				<div className="flex">
					<img src="/img/message-icon.svg" className="px-0 sm:px-3" style={{
                        maxWidth: 60,
                        minWidth: 30
                    }} />
					<input 
                        placeholder="Enter your email address" 
                        className="w-full px-3 outline-none focus:outline-none text-sm dark:text-dark"
                    />
				</div>
			</div>

            <div className="flex justify-center">
                <button className="mt-10 px-14 py-4 bg-shark rounded-xl text-white text-thin">
                    Save
                </button>
            </div>
		</div>
	)
}
