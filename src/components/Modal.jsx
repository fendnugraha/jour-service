import { Dialog } from '@headlessui/react'

export default function Modal({ children, isOpen, modalTitle, onClose }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-bold">{modalTitle}</Dialog.Title>
                        <button onClick={onClose} aria-label="Close Modal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div>{children}</div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
