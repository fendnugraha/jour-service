import Header from '../Header'
import { ArrowRightIcon, ListBulletIcon, BuildingLibraryIcon, UsersIcon, CubeIcon, CircleStackIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const Report = () => {
    return (
        <>
            <Header title="Setting" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <div className="text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
                                <div className="sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <CircleStackIcon className="w-24 h-24" />
                                    <Link
                                        href="/report/profitloss"
                                        className="sm:sm:absolute hover:underline hover:font-bold bottom-4 right-5 text-sm rounded-full">
                                        Profit Loss <span className="hidden sm:inline">Statement</span>
                                        <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                                    </Link>
                                </div>
                                <div className="sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <ListBulletIcon className="w-24 h-24" />
                                    </h1>
                                    <Link
                                        href="/setting/account"
                                        className="sm:sm:absolute hover:underline hover:font-bold bottom-4 right-5 text-sm rounded-full">
                                        Account <span className="hidden sm:inline">Management</span>
                                        <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                                    </Link>
                                </div>
                                <div className="sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <BuildingLibraryIcon className="w-24 h-24" />
                                    </h1>
                                    <Link href="/" className="sm:absolute hover:underline hover:font-bold bottom-4 right-5 text-sm rounded-full">
                                        Warehouse <span className="hidden sm:inline">Management</span>
                                        <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                                    </Link>
                                </div>
                                <div className="sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <UsersIcon className="w-24 h-24" />
                                    </h1>
                                    <Link href="/" className="sm:absolute hover:underline hover:font-bold bottom-4 right-5 text-sm rounded-full">
                                        Contact <span className="hidden sm:inline">Management</span>
                                        <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                                    </Link>
                                </div>
                                <div className="sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <CubeIcon className="w-24 h-24" />
                                    </h1>
                                    <Link href="/setting/product" className="sm:absolute hover:underline hover:font-bold bottom-4 right-5 text-sm rounded-full">
                                        Product <span className="hidden sm:inline">Management</span>
                                        <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Report
