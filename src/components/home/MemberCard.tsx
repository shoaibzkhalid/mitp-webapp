interface UserItem {
	amount: string
	checkinsThisWeek: number
	firstName: string
	id: string
	lastName: string
}

interface MemberCardProps {
	users: UserItem[]
}

export default function MemberCard(props: MemberCardProps) {
	const { users } = props
	return (
		<>
			<button className="p-4 w-full rounded-2xl bg-gray-100 dark:bg-gray-900">
				Review Rules & Ready Up
			</button>
			{users?.map(user => {
				return (
					<div className="flex py-6">
						<img className="w-24 h-24 mr-7" src="./img/avatar.png"></img>
						<ul className="flex-grow">
							<li className="flex items-center justify-between text-base">
								{user.firstName}
								<svg className="w-4 h-4 fill-current">
									<use xlinkHref="/img/sprite.svg#icon-arrow-right"></use>
								</svg>
							</li>
							<li className="py-1 px-2 bg-red-500 w-max text-sm mt-3">
								Not Ready
							</li>
						</ul>
					</div>
				)
			})}
			<button className="p-4 w-full rounded-2xl bg-gray-100 dark:bg-gray-900">
				Show all
			</button>
		</>
	)
}
