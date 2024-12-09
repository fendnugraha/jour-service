'use client'

import Header from '@/app/(app)/Header'
import Paginator from '@/components/Paginator'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import {
    PencilSquareIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/24/solid'
import Input from '@/components/Input'
import FormCreateAccount from './formCreateAccount'
import Modal from '@/components/Modal'

export default function Account() {
    const [account, setAccount] = useState(null)
    const [selectedAccount, setSelectedAccount] = useState([])
    const [selectedUpdateAccount, setSelectedUpdateAccount] = useState(null)
    const [notification, setNotification] = useState('')
    const [errors, setErrors] = useState([]) // Store validation errors
    const [isModalCreateAccountOpen, setIsModalCreateAccountOpen] =
        useState(false)
    const [isModalUpdateAccountOpen, setIsModalUpdateAccountOpen] =
        useState(false)

    // Fetch Accounts
    const fetchAccount = async (url = '/api/auth/accounts') => {
        try {
            const response = await axios.get(url)
            setAccount(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    const handleDeleteAccount = async id => {
        try {
            const response = await axios.delete(`api/auth/accounts/${id}`)
            setNotification(response.data.message)
            fetchAccount()
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
            setNotification(error.response.data.message)
        }
    }

    const closeModal = () => {
        setIsModalCreateAccountOpen(false)
        setIsModalUpdateAccountOpen(false)
    }

    const handleSelectAccount = id => {
        setSelectedAccount(prevSelected => {
            // Check if the ID is already in the selectedAccount array
            if (prevSelected.includes(id)) {
                // If it exists, remove it
                return prevSelected.filter(accountId => accountId !== id)
            } else {
                // If it doesn't exist, add it
                return [...prevSelected, id]
            }
        })
    }

    const handleShowAccount = async id => {
        try {
            const response = await axios.get(`api/auth/accounts/${id}`)
            setSelectedUpdateAccount(response.data.data)
            setIsModalUpdateAccountOpen(true)
            console.log(selectedUpdateAccount)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
            console.log(error.response)
        }
    }
    useEffect(() => {
        // if (selectedUpdateAccount) {
        //     console.log(selectedUpdateAccount)
        // }
    }, [selectedUpdateAccount])

    const handleDeleteSelectedAccounts = async () => {
        try {
            const response = await axios.delete(
                `api/auth/delete-selected-account`,
                { data: { ids: selectedAccount } },
            )
            setNotification(response.data.message)
            fetchAccount()
            setSelectedAccount([])
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    useEffect(() => {
        fetchAccount('/api/auth/accounts')
        handleShowAccount()
    }, [])

    useEffect(() => {
        if (notification || errors.length > 0) {
            const timeoutId = setTimeout(() => {
                setNotification('')
                setErrors([])
            }, 3000) // Notification disappears after 3 seconds

            // Cleanup timeout on component unmount
            return () => clearTimeout(timeoutId)
        }
    }, [notification, errors])

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
                            {errors.length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <button
                                    className="btn-primary"
                                    onClick={handleDeleteSelectedAccounts}>
                                    Hapus terpilih {selectedAccount.length}
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mb-2"
                                    onClick={() =>
                                        setIsModalCreateAccountOpen(true)
                                    }>
                                    Tambah Account{' '}
                                    <PlusCircleIcon className="w-5 h-5 inline" />
                                </button>
                                <Modal
                                    isOpen={isModalCreateAccountOpen}
                                    onClose={closeModal}
                                    modalTitle="Create account">
                                    <FormCreateAccount
                                        isModalOpen={
                                            setIsModalCreateAccountOpen
                                        }
                                        notification={message =>
                                            setNotification(message)
                                        }
                                        fetchAccount={fetchAccount}
                                    />
                                </Modal>
                                <Modal
                                    isOpen={isModalUpdateAccountOpen}
                                    onClose={closeModal}
                                    modalTitle="Update account">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900">
                                            Account Name
                                        </label>
                                        <Input
                                            type="text"
                                            id="name"
                                            defaultValue={
                                                selectedUpdateAccount.acc_name
                                            }
                                            onChange={event =>
                                                setSelectedUpdateAccount({
                                                    ...selectedUpdateAccount,
                                                    acc_name:
                                                        event.target.value,
                                                })
                                            }
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="st_balance"
                                            className="block mb-2 text-sm font-medium text-gray-900">
                                            Starting Balance
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue={
                                                selectedUpdateAccount.st_balance
                                            }
                                            onChange={event =>
                                                setSelectedUpdateAccount({
                                                    ...selectedUpdateAccount,
                                                    st_balance:
                                                        event.target.value,
                                                })
                                            }
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="0"
                                        />
                                    </div>
                                </Modal>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="">
                                            <Input type="checkbox" disabled />
                                        </th>
                                        <th className="">Name</th>
                                        <th className="">Balance</th>
                                        <th className="">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {account?.data?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-4">
                                                No data
                                            </td>
                                        </tr>
                                    ) : (
                                        account?.data?.map(account => (
                                            <tr key={account.id}>
                                                <td className="w-4">
                                                    <Input
                                                        checked={selectedAccount.includes(
                                                            account.id,
                                                        )}
                                                        onChange={() => {
                                                            handleSelectAccount(
                                                                account.id,
                                                            )
                                                        }}
                                                        type="checkbox"
                                                    />
                                                </td>
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
                                                        onClick={() => {
                                                            setIsModalUpdateAccountOpen(
                                                                true,
                                                            )
                                                            handleShowAccount(
                                                                account.id,
                                                            )
                                                        }}
                                                        className="text-white min-w-28 bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-sm text-sm py-1">
                                                        <PencilSquareIcon className="w-5 h-5 inline" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteAccount(
                                                                account.id,
                                                            )
                                                        }
                                                        className="text-white min-w-28 bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-sm text-sm py-1">
                                                        {' '}
                                                        <TrashIcon className="w-5 h-5 inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {account === null ? (
                                ''
                            ) : (
                                <Paginator
                                    links={account}
                                    handleChangePage={handleChangePage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
