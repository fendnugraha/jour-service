import { useEffect } from 'react'

const Notification = ({ type = 'success', notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000) // Auto-close after 3 seconds

        return () => clearTimeout(timer)
    }, [onClose])
    return (
        <div className="bg-teal-100 border-t-4 fixed top-5 right-5 z-[999] border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md">
            <div className="flex">
                <div className="py-1">
                    <svg className="fill-current h-6 w-5 text-teal-500 mr-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold">{notification}</p>
                </div>
            </div>
        </div>
    )
}

export default Notification
