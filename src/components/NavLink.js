import Link from "next/link";

const NavLink = ({ active = false, children, isOpen, ...props }) => (
    <Link
        {...props}
        className={`px-4 py-4 hover:bg-yellow-300 hover:border-r-8 hover:border-yellow-200 transition-all duration-150 ease-in-out cursor-pointer flex items-center gap-4 ${
            isOpen ? "justify-start" : "justify-center"
        }${active ? " bg-indigo-500 text-white hover:text-slate-700 border-r-8 border-yellow-200" : " border-transparent"}`}
    >
        {children}
    </Link>
);

export default NavLink;
