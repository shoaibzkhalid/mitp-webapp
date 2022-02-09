import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { Api } from '../../api'
import { userState } from '../../state/user'
import { selectedPotState } from '../../state/react/useSelectedPot'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { ApiPot } from '../../types'
import Head from 'next/head'
import { Spinner } from '../../components/ui/Spinner'
import { useEffect } from 'react'
import { GoogleLoginResponse, useGoogleLogin } from 'react-google-login'
import { AppEnv } from '../../env'
import { Button } from '../../components/ui/Button'

export default observer(function PotById(props: { pot: ApiPot }) {
	const usersCount = props.pot._count!.toUsers
	const adminName = props.pot.toUsers?.[0]?.user?.firstName

	const title = `Join ${props.pot.title}`
	const description = adminName
		? `Join ${adminName}'s accountability group by clicking on the invite link.`
		: `Join this accountability group by clicking on the invite link.`

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:title" content={title} />
				<meta property="og:type" content="website" />
				<meta
					property="og:image"
					content="https://storage.googleapis.com/mitp-userdata/pot_join_icon.png"
				/>
				<meta property="og:description" content={description} />
				<meta name="theme-color" content="#6C5DD3" />

				{/* We don't want these pages to end up in search engines and pollute our SEO */}
				<meta name="robots" content="noindex" />
			</Head>
			<div className="w-full max-w-lg mx-auto my-8 px-2">
				<p className="text-2xl">You have been invited to a pot</p>
				<h1 className="text-5xl font-semibold" style={{ lineHeight: 1.5 }}>
					Join {props.pot.title}
				</h1>

				<div className="p-2 bg-gray-200 rounded shadow mt-6 mb-10">
					<div className="font-bold">Description</div>
					<div className="text-gray-600">{props.pot.description}</div>
					<div className="mt-4">
						This pot has {usersCount} member{usersCount === 1 || 's'}.
					</div>
				</div>

				<JoinPotButton potId={props.pot.id} />
			</div>
		</>
	)
})

interface JoinPotButtonProps {
	potId: string
}
const JoinPotButton = observer(function JoinPotButton(
	props: JoinPotButtonProps
) {
	useEffect(() => {
		userState.load()
	}, [])

	const router = useRouter()
	const userPots = useQuery('userPots', () => Api.userPots.list(), {
		enabled: !!userState.user
	})
	const isLoading = !userState.loaded || (userState.user && userPots.isLoading)
	const isJoined = userPots.data?.some(
		userPot => userPot.moneyPotId === props.potId
	)

	// If/once the user is logged in, this method can make them join the pot and
	// redirect to the dashboard
	const makeJoin = async () => {
		if (!isJoined) await Api.userPots.join(props.potId)
		runInAction(() => {
			selectedPotState.moneyPotId = props.potId
		})
		router.push('/home')
	}

	const google = useGoogleLogin({
		clientId: AppEnv.googleClientId,
		async onSuccess(r: GoogleLoginResponse) {
			const tokens = await Api.public.googleAuth(r.tokenId)
			runInAction(() => {
				userState.tokens = tokens
			})
			await userState.load()
			makeJoin()
		},
		onFailure(e) {
			console.log(e)
		}
	})

	return (
		<div className="flex items-center justify-center">
			{isLoading ? (
				<Spinner size="md" />
			) : (
				<Button
					onClick={() => {
						if (userState.user) makeJoin()
						else google.signIn()
					}}
				>
					{isJoined ? <>Go to pot</> : <>Join now</>}
				</Button>
			)}
		</div>
	)
})

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const id = ctx.params.id
	if (typeof id !== 'string')
		return {
			notFound: true
		} as GetServerSidePropsResult<any>

	const pot = await Api.public.getMoneyPot(ctx.params.id as string)
	if (!pot)
		return {
			notFound: true
		} as GetServerSidePropsResult<any>

	return {
		props: {
			pot: pot.pot
		}
	} as GetServerSidePropsResult<any>
}
