'use client'

import Header from '@/app/(app)/Header'
import Paginator from '@/components/Paginator'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { PlusCircleIcon } from '@heroicons/react/24/solid'

export default function Account() {
    const [account, setAccount] = useState(null) // Set initial state to null
    const [categoryAccount, setCategoryAccount] = useState(null) // Set initial state to null
    const [newAccount, setNewAccount] = useState({
        name: '',
        category_id: '',
        st_balance: 0,
    })
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [notification, setNotification] = useState('')
    const [errors, setErrors] = useState([]) // Store validation errors
    const [isModalCreateAccountOpen, setIsModalCreateAccountOpen] =
        useState(false)

    // Handle Create Account
    const handleCreateAccount = async e => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/auth/accounts', newAccount)

            setNotification(response.data.message)
            if (response.status === 201) {
                // Reset form fields and close modal on success
                setNewAccount({
                    name: '',
                    category_id: '',
                    st_balance: 0,
                })
                setIsModalCreateAccountOpen(false)
                // console.log('Form reset:', newAccount, response.status)
            }
            fetchAccount()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors || ['Validation Error'])
            }
        }
    }

    // Fetch Accounts
    const fetchAccount = async (url = '/api/auth/accounts') => {
        try {
            const response = await axios.get(url)
            setAccount(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    // Fetch Categories
    const fetchCategoryAccount = async () => {
        try {
            const response = await axios.get('api/auth/category-accounts')
            setCategoryAccount(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    const handleDeleteAccount = async id => {
        try {
            const response = await axios.delete(`api/auth/accounts/${id}`)
            setNotification(response.data.message)
            fetchAccount()
            console.log(response)
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

    return (
        <>
            <Header title="Account" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div
                            className="fixed top-0 right-0 px-6 py-4 sm:block"
                            onClick={() => setNotification('')}>
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
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mb-2"
                                onClick={() =>
                                    setIsModalCreateAccountOpen(true)
                                }>
                                Tambah Account{' '}
                                <PlusCircleIcon className="w-5 h-5 inline" />
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
                                                            <option value="">
                                                                Select Category
                                                            </option>
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
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="">Name</th>
                                        <th className="">Balance</th>
                                        <th className="">Action</th>
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
                                                <td className="">
                                                    <span className="font-bold text-blue-800">
                                                        {account.acc_name}
                                                    </span>
                                                    <br />
                                                    <span className="text-slate-600">
                                                        {account.acc_code} #{' '}
                                                        {account.account?.name}{' '}
                                                        #{' '}
                                                        {account?.warehouse
                                                            ?.name ??
                                                            'NotAssociated'}
                                                    </span>
                                                </td>
                                                <td className="text-right text-lg">
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        },
                                                    ).format(
                                                        account.st_balance,
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteAccount(
                                                                account.id,
                                                            )
                                                        }
                                                        className="text-white min-w-28 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-5 py-3 ">
                                                        {' '}
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {/* {account?.data?.length === 0 ? (
                                ''
                            ) : (
                                <Paginator
                                    links={account}
                                    handleChangePage={handleChangePage}
                                />
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
