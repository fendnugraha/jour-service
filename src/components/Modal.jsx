export default function Modal({ children }) {
    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50">
            {children}
        </div>
    )
}
