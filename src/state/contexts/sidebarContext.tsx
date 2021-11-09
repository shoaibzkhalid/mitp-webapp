import { Context, createContext, PropsWithChildren, useState } from 'react'

const defaultValue = {
	isOpen: false
}
export const SidebarContext: Context<
	[typeof defaultValue, (v: typeof defaultValue) => void]
> = createContext([defaultValue, v => {}])

export const SidebarContextProvider = (props: PropsWithChildren<{}>) => {
	const [state, setState] = useState(defaultValue)
	return (
		<SidebarContext.Provider value={[state, setState]}>
			{props.children}
		</SidebarContext.Provider>
	)
}
