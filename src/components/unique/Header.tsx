import { useContext } from 'react'
import { SidebarContext } from '../../state/contexts/sidebarContext'
import { toggleSideBar } from '../../utils/common'

export const Header = () => {
	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	return (
		<>
			{/* <div className="flex flex-col flex-col-reverse w-full xl:flex-row">
				<div className="pl-8 pr-4 border-b border-gray-200 py-7 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-b-0"> */}
			<div className="flex items-center justify-between font-poppins xl:justify-center lg:justify-end">
				<button
					className="block lg:hidden"
					onClick={() => handleClickToggleSideBar()}
				>
					<div className="w-8 mx-auto border-2 border-gray-900 rounded-2xl dark:border-white"></div>
					<div className="w-8 mx-auto mt-3 border-2 border-gray-900 rounded-2xl dark:border-white"></div>
				</button>
			</div>
		</>
	)
}
