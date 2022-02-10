import Tippy from '@tippyjs/react'
import { AppEnv } from '../../env'
import { useSelectedPot } from '../../state/react/useSelectedPot'
import { copyToClipboard } from '../../state/utils/copyToClipboard'

export function ButtonSharePot() {
	const pot = useSelectedPot()

	return (
		<Tippy
			interactive
			interactiveBorder={10}
			placement="bottom"
			content={
				<div className="border dark:border-gray-500 shadow p-4 bg-white dark:bg-dark rounded-xl">
					<button
						className="hover:underline block w-full text-left"
						onClick={() =>
							// TODO: New notification system
							copyToClipboard(`${AppEnv.webBaseUrl}/pot/${pot.data?.pot.slug}`)
						}
					>
						Copy invite link
					</button>
					<div className="text-sm text-gray-400 -mt-1" onClick={() => {}}>
						Share it with your friends.
					</div>
					<a
						className="mt-4 hover:underline block w-full text-left"
						target="_blank"
						href={
							AppEnv.apiBaseUrl +
							'/pdf/flyer1/' +
							encodeURIComponent(pot.data?.pot.slug) +
							'?link=' +
							encodeURIComponent(
								`${AppEnv.webBaseUrl}/pot/${pot.data?.pot.slug}`
							)
						}
					>
						View pot poster
					</a>
					<div className="text-sm text-gray-400 -mt-1">Includes a QR code!</div>
				</div>
			}
		>
			<button className="flex items-center justify-center">
				<div className="mx-2">Share</div>
				<svg className="-icon">
					<use xlinkHref="/img/sprite.svg#icon-more"></use>
				</svg>
			</button>
		</Tippy>
	)
}
