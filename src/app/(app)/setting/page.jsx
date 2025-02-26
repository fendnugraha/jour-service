import Header from "@/app/(app)/Header";
import { ArrowRight, BoxesIcon, ContactIcon, ListCheck, SquareGanttChartIcon, UserIcon, UsersIcon, WarehouseIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "JOur - Setting",
};

export default function Setting() {
    return (
        <>
            <Header title="Setting" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <div className="text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4">
                                <div className="group sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <UserIcon className="w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-125 transition-transform duration-300" />
                                    <Link
                                        href="/setting/user"
                                        className="sm:sm:absolute hover:underline group-hover:font-bold bottom-4 right-5 text-sm rounded-full transition-all duration-300"
                                    >
                                        User Management
                                        <ArrowRight className="w-4 h-4 inline ml-2 group-hover:scale-125 transition-transform duration-300 " />
                                    </Link>
                                </div>
                                <div className="group sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <SquareGanttChartIcon className="w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-125 transition-transform duration-300" />
                                    </h1>
                                    <Link
                                        href="/setting/account"
                                        className="sm:sm:absolute hover:underline group-hover:font-bold bottom-4 right-5 text-sm rounded-full transition-all duration-300"
                                    >
                                        Account Management
                                        <ArrowRight className="w-4 h-4 inline ml-2 group-hover:scale-125 transition-transform duration-300" />
                                    </Link>
                                </div>
                                <div className="group sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <WarehouseIcon className="w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-125 transition-transform duration-300" />
                                    </h1>
                                    <Link
                                        href="/setting/warehouse"
                                        className="sm:sm:absolute hover:underline group-hover:font-bold bottom-4 right-5 text-sm rounded-full transition-all duration-300"
                                    >
                                        Warehouse Management
                                        <ArrowRight className="w-4 h-4 inline ml-2 group-hover:scale-125 transition-transform duration-300" />
                                    </Link>
                                </div>
                                <div className="group sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <ContactIcon className="w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-125 transition-transform duration-300" />
                                    </h1>
                                    <Link
                                        href="/setting/contact"
                                        className="sm:sm:absolute hover:underline group-hover:font-bold bottom-4 right-5 text-sm rounded-full transition-all duration-300"
                                    >
                                        Contact Management
                                        <ArrowRight className="w-4 h-4 inline ml-2 group-hover:scale-125 transition-transform duration-300" />
                                    </Link>
                                </div>
                                <div className="group sm:relative bg-white p-3 sm:p-6 dark:bg-gray-800 overflow-hidden shadow-md rounded-xl h-32 sm:h-60 flex sm:justify-center justify-evenly items-center flex-col gap-1">
                                    <h1 className="text-5xl sm:text-8xl font-bold text-center">
                                        <BoxesIcon className="w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-125 transition-transform duration-300" />
                                    </h1>
                                    <Link
                                        href="/setting/product"
                                        className="sm:sm:absolute hover:underline group-hover:font-bold bottom-4 right-5 text-sm rounded-full transition-all duration-300"
                                    >
                                        Product Management
                                        <ArrowRight className="w-4 h-4 inline ml-2 group-hover:scale-125 transition-transform duration-300" />
                                    </Link>
                                </div>
                                {/* <a
                            className="text-2xl bg-sky-300 text-sky-950 p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-400 hover:text-5xl transition-all delay-300 duration-300 ease-out"
                            href="{{ route('user.index') }}" wire:navigate>User
                        </a>
                        <a className="text-2xl bg-sky-300 text-sky-950 p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-400 hover:text-5xl transition-all delay-300 duration-300 ease-out"
                            href="{{ route('account') }}" wire:navigate>Account
                        </a>
                        <a className="text-2xl bg-sky-300 text-sky-950 p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-400 hover:text-5xl transition-all delay-300 duration-300 ease-out"
                            href="{{ route('warehouse') }}" wire:navigate>Warehouse
                        </a>
                        <a className="text-2xl bg-sky-300 text-sky-950 p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-400 hover:text-5xl transition-all delay-300 duration-300 ease-out"
                            href="{{ route('contact') }}" wire:navigate>Contact
                        </a>
                        <a className="text-2xl bg-sky-300 text-sky-950 p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-400 hover:text-5xl transition-all delay-300 duration-300 ease-out"
                            href="{{ route('product') }}" wire:navigate>Product
                        </a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
