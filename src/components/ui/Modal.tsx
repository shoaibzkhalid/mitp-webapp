import React from 'react'
import ReactModal from 'react-modal'
import { useNextAppElement } from '../../state/react/useNextAppElement'

export type ModalProps<T = {}> = T & {
	isOpen: boolean
	onRequestClose: () => any
	style?: ReactModal.Styles
}

export function createModalComponent<T>(
	Component: (props: ModalProps<T>) => any
) {
	return function Modal(props: ModalProps<T>) {
		const appElement = useNextAppElement()

		return (
			<ReactModal
				appElement={appElement}
				isOpen={props.isOpen}
				onRequestClose={props.onRequestClose}
				style={props.style}
			>
				<Component {...props} />
			</ReactModal>
		)
	}
}
