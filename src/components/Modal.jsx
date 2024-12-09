import { Dialog } from '@headlessui/react'

export default function Modal({ children, isOpen, modalTitle, onClose }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-500/70">
                <div className="flex min-h-full min-w-full items-center justify-center">
                    <div className="bg-white min-w-full sm:min-w-[500px] p-4 rounded-2xl">
                        <div className="flex justify-between mb-4">
                            <h1 className="text-xl font-bold">{modalTitle}</h1>
                            <button onClick={onClose}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
