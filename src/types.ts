interface ModelBase {
	id: string
	createdAt: string
	updatedAt: string
}

export interface ApiUser extends ModelBase {
	firstName: string
	lastName: string
	email: string
	avatarUri: string
	admin: boolean
	readyUpAt: Date | string | null
	connections: ApiUserConnection[]
	permissions: number[]
}

export interface ApiPot extends ModelBase {
	title: string
	slug: string
	description: string
	minAmount: string
	checkinCount: number
	visibility: number
	startedAt: string
	streak: number
	inviteAdminMode: boolean
	timeZone: string

	_count?: {
		toUsers?: number
	}
	toUsers?: ApiUser_MoneyPot[]
}

export interface ApiPotLog extends ModelBase {
	pictureUri: string | null
	user_MoneyPotId: string
	description: string | null
}

export interface ApiUser_MoneyPot extends ModelBase {
	amount: string
	admin: boolean
	joined: boolean
	moneyPot?: ApiPot
	moneyPotId: string
	user?: ApiUser
	userId: string
}

export interface ApiMoneyBundle extends ModelBase {
	amount: string
	accountId: string
	releasedAt: string
	introducedAt: string
	parentIds: string[]
	parentAccountIds: string[]
	isSpent: boolean
	metadata: any
}

export interface ApiUserConnection extends ModelBase {
	service: string
	remoteId: string
	meta: any
	userId: string
}
