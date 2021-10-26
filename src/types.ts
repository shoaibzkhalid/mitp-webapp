interface ModelBase {
	id: string
	createdAt: string
	updatedAt: string
}

export interface ApiUser extends ModelBase {
	firstName: string
	lastName: string
	email: string
}

export interface ApiPot extends ModelBase {
	title: string
	slug: string
	description: string
	minAmount: string
	checkinCount: number
	visibility: number
	startedAt: string
}

export interface ApiPotLog extends ModelBase {
	pictureUri: string | null
	user_MoneyPotId: string
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

export interface ApiTransaction extends ModelBase {
	delta: string
	status: string
	note: string
	metadata: object | null
	from?: any
	fromId: string
	fromKind: string
	to?: any
	toId: string
	toKind: string
}

export interface ApiUserConnection extends ModelBase {
	service: string
	remoteId: string
	meta: any
	userId: string
}
