import NavLink from "@/components/NavLink";
import { useAuth } from "@/libs/auth";
import { ArrowRightLeftIcon, ChartAreaIcon, CircleDollarSignIcon, CirclePowerIcon, CogIcon, LayoutDashboardIcon, MenuIcon, StoreIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navigation = ({ user }) => {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };
    const pathname = usePathname();

    const userRole = user.role?.role;
    return (
        <nav className={`bg-white text-gray-600 hidden sm:flex sm:flex-col sm:justify-between min-h-screen transition-all ${isOpen ? "w-64" : "w-16"}`}>
            <div>
                <div
                    onClick={toggleNavbar}
                    className={`h-[72px] px-4 text-gray-500 bg-blue-800 flex items-center ${
                        isOpen ? "justify-start" : "justify-center"
                    } gap-4 cursor-pointer border-b`}
                >
                    <div className="h-full flex items-center">
                        <MenuIcon className="w-5 h-5 text-white" />
                    </div>
                    <div
                        className={`transition-all duration-300 ease-in-out transform text-nowrap ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                        style={{ display: isOpen ? "inline" : "none" }}
                    >
                        <div className="flex flex-col">
                            <h1 className="font-bold text-yellow-300">JOUR APPS</h1>
                            <span className="text-xs text-white">{user.role?.warehouse?.name}</span>
                        </div>
                    </div>
                </div>
                <nav className="flex-1">
                    <div className=" text-sm mt-4">
                        <NavLink href="/dashboard" isOpen={isOpen} active={pathname === "/dashboard"}>
                            <div className="">
                                <LayoutDashboardIcon className="w-5 h-5" />
                            </div>
                            <span
                                className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                }`}
                                style={{ display: isOpen ? "inline" : "none" }}
                            >
                                Dashboard
                            </span>
                        </NavLink>
                        <NavLink href="/order" isOpen={isOpen} active={pathname === "/order"}>
                            <div>
                                <ArrowRightLeftIcon className="w-5 h-5" />
                            </div>
                            <span
                                className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                }`}
                                style={{ display: isOpen ? "inline" : "none" }}
                            >
                                Customer Order
                            </span>
                        </NavLink>
                        <NavLink href="/store" isOpen={isOpen} active={pathname === "/store"}>
                            <div>
                                <StoreIcon className="w-5 h-5" />
                            </div>
                            <span
                                className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                }`}
                                style={{ display: isOpen ? "inline" : "none" }}
                            >
                                Store
                            </span>
                        </NavLink>
                        {userRole === "Administrator" && (
                            <>
                                <NavLink href="/finance" isOpen={isOpen} active={pathname === "/finance"}>
                                    <div>
                                        <CircleDollarSignIcon className="w-5 h-5" />
                                    </div>
                                    <span
                                        className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                        }`}
                                        style={{ display: isOpen ? "inline" : "none" }}
                                    >
                                        Finance
                                    </span>
                                </NavLink>
                                <NavLink href="/summary" isOpen={isOpen} active={pathname === "/summary"}>
                                    <div>
                                        <ChartAreaIcon className="w-5 h-5" />
                                    </div>
                                    <span
                                        className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                        }`}
                                        style={{ display: isOpen ? "inline" : "none" }}
                                    >
                                        Summary
                                    </span>
                                </NavLink>
                                {/* <NavLink href="/report" isOpen={isOpen} active={pathname === "/report"}>
                        <div>
                            <DockIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                            style={{ display: isOpen ? "inline" : "none" }}
                        >
                            Reports
                        </span>
                    </NavLink> */}
                            </>
                        )}
                    </div>
                    {userRole === "Administrator" && (
                        <>
                            <hr className="my-4" />
                            <ul className="mt-4 text-sm">
                                <NavLink href="/setting" isOpen={isOpen} active={pathname.startsWith("/setting")}>
                                    <div>
                                        <CogIcon className="w-5 h-5" />
                                    </div>
                                    <span
                                        className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                        }`}
                                        style={{ display: isOpen ? "inline" : "none" }}
                                    >
                                        Settings
                                    </span>
                                </NavLink>
                            </ul>
                        </>
                    )}
                </nav>
            </div>
            <button
                onClick={logout}
                className="px-4 py-4 w-full bg-gray-600 hover:bg-gray-500 border-t text-white cursor-pointer flex items-center gap-4 justify-center"
            >
                <div>
                    <CirclePowerIcon className="w-5 h-5" />
                </div>
                <span
                    className={`text-sm transition-all duration-300 ease-in-out transform text-nowrap ${
                        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                    style={{ display: isOpen ? "inline" : "none" }}
                >
                    Logout
                </span>
            </button>
        </nav>
    );
};

export default Navigation;
