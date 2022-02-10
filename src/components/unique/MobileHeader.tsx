import { useContext } from 'react'
import { SidebarContext } from '../../state/contexts/sidebarContext'
import { toggleSideBar } from '../../utils/common'
import { ButtonSharePot } from './ButtonSharePot'

export const MobileHeader = function MobileHeader() {
	const [sidebarState, setSidebarState] = useContext(SidebarContext)

	const handleClickToggleSideBar = () => {
		toggleSideBar(!sidebarState.isOpen)
		setSidebarState({ isOpen: !sidebarState.isOpen })
	}

	return (
		<>
			<div className="lg:hidden flex items-center p-6">
				<button
					className="block mr-auto"
					onClick={() => handleClickToggleSideBar()}
				>
					<div className="w-8 mx-auto border-2 border-gray-900 rounded-2xl dark:border-white"></div>
					<div className="w-8 mx-auto mt-3 border-2 border-gray-900 rounded-2xl dark:border-white"></div>
				</button>

				{/* <ButtonSharePot /> */}
			</div>
		</>
	)
}
