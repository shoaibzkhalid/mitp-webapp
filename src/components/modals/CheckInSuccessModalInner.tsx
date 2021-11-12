import { ModalProps } from './types'
import { useDropzone } from 'react-dropzone'

export function CheckInSuccessModalInner({ closeModal }: any) {

	return (
		<>
			<div className="flex flex-col justify-evenly h-full items-center">
                <img src="/img/success.svg" />
                <div className="text-3xl font-medium font-bold font-poppins">
                    Success!
                </div>
                <div className="font-poppins text-center text-bombay sm:text-lg text-sm">
                    3 out of 10 have checked in <br></br>this week
                </div>
                <div>
                    <button style={{
                        padding: "10px 90px"
                    }} className="text-white font-poppins max-w-sm -button text-lg bg-shark">Onwards!</button>
                </div>                
            </div>
		</>
	)
}
