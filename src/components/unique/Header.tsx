import { useContext } from 'react'
import { SidebarContext } from '../../state/contexts/sidebarContext'
import { toggleSideBar } from '../../utils/common'
import Notification from '../notification'

export const Header = () => {
	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	return (
		<>
			{/* <div className="w-full flex flex-col flex-col-reverse xl:flex-row">
				<div className="pl-8 pr-4 py-7 border-b border-gray-200 dark:border-gray-700 md:py-1 md:px-3 xl:px-12 xl:pt-12 xl:w-4/12 xl:border-b-0"> */}
			<div className="font-poppins flex justify-between items-center xl:justify-center lg:justify-end">
				<button
					className="block lg:hidden"
					onClick={() => handleClickToggleSideBar()}
				>
					<div className="w-8 mx-auto border-2 border-gray-900 rounded-2xl dark:border-white"></div>
					<div className="w-8 mt-3 mx-auto border-2 border-gray-900 rounded-2xl dark:border-white"></div>
				</button>
			</div>
			{/* </div>
			</div> */}
		</>
	)
}
