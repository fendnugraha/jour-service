'use client'

import Header from '@/app/(app)/Header'
import Paginator from '@/components/Paginator'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'

// export const metadata = {
//     title: 'Laravel - Account',
// }

export default function Account() {
    const [account, setAccount] = useState(null) // Set initial state to null
    const [categoryAccount, setCategoryAccount] = useState(null) // Set initial state to null
    let [newAccount, setNewAccount] = useState({
        name: '',
        category_id: 0,
        st_balance: 0,
    })
    let [notification, setNotification] = useState('')
    const [errors, setErrors] = useState([])
    let [isModalCreateAccountOpen, setIsModalCreateAccountOpen] =
        useState(false)

    const handleCreateAccount = async e => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/auth/accounts', newAccount)
            setNotification(response.data.message)
            fetchAccount()
            console.log(response.data)
            // setIsModalCreateAccountOpen(false)
            console.log(newAccount)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    const fetchAccount = async url => {
        try {
            const response = await axios.get(url || '/api/auth/accounts')
            setAccount(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    const fetchCategoryAccount = async () => {
        try {
            const response = await axios.get('api/auth/category-accounts')
            setCategoryAccount(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    useEffect(() => {
        fetchAccount()
        fetchCategoryAccount()
    }, [])

    const handleChangePage = url => {
        fetchAccount(url)
    }
    // console.log(account)
    if (account === null || categoryAccount === null) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Header title="Account" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div>
                            {notification && (
                                <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md">
                                    <div className="flex">
                                        <div className="py-1">
                                            <svg
                                                className="fill-current h-6 w-5 text-teal-500 mr-4"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {notification}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            <button
                                onClick={() =>
                                    setIsModalCreateAccountOpen(true)
                                }>
                                Open dialog
                            </button>
                            <Dialog
                                open={isModalCreateAccountOpen}
                                onClose={() =>
                                    setIsModalCreateAccountOpen(false)
                                }
                                className="relative z-50">
                                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-500/70">
                                    <div className="flex min-h-full min-w-full items-center justify-center">
                                        <div className="bg-white min-w-full sm:min-w-[500px] p-4 rounded-2xl ">
                                            <div className="flex justify-between mb-4">
                                                <h1 className="text-xl font-bold">
                                                    Create account
                                                </h1>
                                                <button
                                                    onClick={() =>
                                                        setIsModalCreateAccountOpen(
                                                            false,
                                                        )
                                                    }>
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
                                            <div>
                                                <form>
                                                    <div className="mb-4">
                                                        <label
                                                            htmlFor="name"
                                                            className="block mb-2 text-sm font-medium text-gray-900">
                                                            Account Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            value={
                                                                newAccount.name
                                                            }
                                                            onChange={e =>
                                                                setNewAccount({
                                                                    ...newAccount,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label
                                                            htmlFor="category"
                                                            className="block mb-2 text-sm font-medium text-gray-900">
                                                            Category
                                                        </label>
                                                        <select
                                                            id="category"
                                                            value={
                                                                newAccount.category_id
                                                            }
                                                            onChange={e =>
                                                                setNewAccount({
                                                                    ...newAccount,
                                                                    category_id:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                                            {categoryAccount
                                                                ?.data
                                                                ?.length ===
                                                            0 ? (
                                                                <option value="">
                                                                    -
                                                                </option>
                                                            ) : (
                                                                <option value="">
                                                                    -
                                                                </option>
                                                            )}
                                                            {categoryAccount?.map(
                                                                item => (
                                                                    <option
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.id
                                                                        }>
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label
                                                            htmlFor="st_balance"
                                                            className="block mb-2 text-sm font-medium text-gray-900">
                                                            Starting Balance
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="st_balance"
                                                            value={
                                                                newAccount.st_balance
                                                            }
                                                            onChange={e =>
                                                                setNewAccount({
                                                                    ...newAccount,
                                                                    st_balance:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setIsModalCreateAccountOpen(
                                                                    false,
                                                                )
                                                            }
                                                            className="text-white min-w-28 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-5 py-3 ">
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleCreateAccount
                                                            }
                                                            className="text-white min-w-28 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-3 ">
                                                            Save
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                            {errors.length > 0 && (
                                <div className="text-red-500 mb-4">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            )}
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="border px-6 py-4">ID</th>
                                        <th className="border px-6 py-4">
                                            Name
                                        </th>
                                        <th className="border px-6 py-4">
                                            Email
                                        </th>
                                        <th className="border px-6 py-4">
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {account?.data?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-4">
                                                No data
                                            </td>
                                        </tr>
                                    ) : (
                                        account?.data?.map(account => (
                                            <tr key={account.id}>
                                                <td className="border px-6 py-4">
                                                    {account.id}
                                                </td>
                                                <td className="border px-6 py-4">
                                                    {account.acc_name}
                                                </td>
                                                <td className="border px-6 py-4">
                                                    {account.acc_code}
                                                </td>
                                                <td className="border px-6 py-4">
                                                    {account.warehouse_id}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            <Paginator
                                links={account}
                                handleChangePage={handleChangePage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
