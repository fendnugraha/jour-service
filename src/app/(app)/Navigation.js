import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    ArrowRightEndOnRectangleIcon,
    Bars3Icon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentChartBarIcon,
    ShoppingBagIcon,
    Square2StackIcon,
    UserCircleIcon,
    UserGroupIcon,
} from '@heroicons/react/24/solid'

const Navigation = ({ user }) => {
    const { logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const toggleNavbar = () => {
        setIsOpen(!isOpen)
    }

    const [open, setOpen] = useState(false)

    return (
        <nav className={`bg-white text-gray-600 hidden sm:block min-h-screen transition-all ${isOpen ? 'w-64' : 'w-16'} flex flex-col`}>
            <div className="h-[72px] px-4 text-gray-500 flex items-center justify-start gap-4 cursor-pointer">
                <div className="h-full flex items-center" onClick={toggleNavbar}>
                    <Bars3Icon className="w-8 h-8" />
                </div>
                <div
                    className={`transition-all duration-300 ease-in-out transform text-nowrap ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ display: isOpen ? 'inline' : 'none' }}>
                    <h1 className="font-bold">
                        <UserCircleIcon className="w-6 h-6 inline" /> {user.email}{' '}
                    </h1>
                </div>
            </div>
            <nav className="flex-1">
                <div className="mt-4 text-sm">
                    <NavLink href="/dashboard" isOpen={isOpen} active={usePathname() === '/dashboard'}>
                        <div className="">
                            <ChartPieIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ display: isOpen ? 'inline' : 'none' }}>
                            Dashboard
                        </span>
                    </NavLink>
                    <NavLink href="/transaction" isOpen={isOpen} active={usePathname() === '/transaction'}>
                        <div>
                            <ShoppingBagIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ display: isOpen ? 'inline' : 'none' }}>
                            Order list
                        </span>
                    </NavLink>
                    <NavLink href="/setting/product" isOpen={isOpen} active={usePathname() === '/setting/product'}>
                        <div>
                            <Square2StackIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ display: isOpen ? 'inline' : 'none' }}>
                            Products
                        </span>
                    </NavLink>
                    <NavLink href="/setting/contact" isOpen={isOpen} active={usePathname() === '/setting/contact'}>
                        <div>
                            <UserGroupIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ display: isOpen ? 'inline' : 'none' }}>
                            Customers
                        </span>
                    </NavLink>
                    <NavLink href="/report" isOpen={isOpen} active={usePathname() === '/report'}>
                        <div>
                            <DocumentChartBarIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ display: isOpen ? 'inline' : 'none' }}>
                            Reports
                        </span>
                    </NavLink>
                </div>
                <hr className="my-4" />
                <ul className="mt-4 text-sm">
                    <NavLink href="/setting" isOpen={isOpen} active={usePathname().startsWith('/setting')}>
                        <div>
                            <Cog6ToothIcon className="w-5 h-5" />
                        </div>
                        <span
                            className={`transition-all duration-300 ease-in-out transform text-nowrap ${
                                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{ display: isOpen ? 'inline' : 'none' }}>
                            Settings
                        </span>
                    </NavLink>
                </ul>
            </nav>

            <div className="">
                <button onClick={logout} className="px-4 py-4 w-full hover:bg-indigo-500 hover:text-white cursor-pointer flex items-center gap-4 justify-start">
                    <div>
                        <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    </div>
                    <span
                        className={`transition-all duration-300 ease-in-out transform text-nowrap ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        style={{ display: isOpen ? 'inline' : 'none' }}>
                        Logout
                    </span>
                </button>
            </div>
        </nav>
    )
}

export default Navigation
