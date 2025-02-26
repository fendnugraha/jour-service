import { CheckCircleIcon } from "lucide-react";
import { useEffect } from "react";

const Notification = ({ type = "success", notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-close after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    // Conditional styles based on notification type
    let notificationStyles = "";
    let notificationIcon = null;

    // Set styles and icon based on notification type
    switch (type) {
        case "success":
            notificationStyles = "bg-green-500 border-green-700 text-white";
            notificationIcon = <CheckCircleIcon className="w-6 h-6 text-white" />;
            break;
        case "error":
            notificationStyles = "bg-red-100 border-red-500 text-red-900";
            notificationIcon = <CheckCircleIcon className="w-6 h-6 text-red-500" />;
            break;
        default:
            notificationStyles = "bg-teal-100 border-teal-500 text-teal-900";
            notificationIcon = <CheckCircleIcon className="w-6 h-6 text-teal-500" />;
    }

    return (
        <div className={`${notificationStyles} fixed w-full sm:w-fit top-5 sm:right-8 z-[1000] rounded-xl px-4 py-2 shadow-lg`}>
            <div className="flex items-center gap-4">
                <div className="py-1">
                    {/* <svg className={`fill-current h-6 w-5 text-white mr-4`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg> */}
                    {notificationIcon}
                </div>
                <div>
                    <p className="text-sm">
                        <span className="font-bold block">{type === "success" ? "Success" : "Error"}</span> {notification}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Notification;
