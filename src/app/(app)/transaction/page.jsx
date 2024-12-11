'use client'
import Link from 'next/link'
import Header from '../Header'
import Modal from '@/components/Modal'
import CreateOrderForm from './CreateOrderForm'
import Notification from '@/components/notification'
import { useEffect, useState } from 'react'

const Transaction = ({ user }) => {
    const [notification, setNotification] = useState('')
    const [errors, setErrors] = useState([])
    const closeModal = () => {
        setIsModalCreateOrderOpen(false)
    }
    const [isModalCreateOrderOpen, setIsModalCreateOrderOpen] = useState(false)

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

    return (
        <>
            <Header title="Transaction" />
            <div className="py-12">
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
                                <p className="font-bold">{notification}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div>
                                <button
                                    className="btn btn-primary mr-4"
                                    onClick={() =>
                                        setIsModalCreateOrderOpen(true)
                                    }>
                                    Create new order
                                </button>
                                <Modal
                                    isOpen={isModalCreateOrderOpen}
                                    onClose={closeModal}
                                    modalTitle="Create new order">
                                    <CreateOrderForm
                                        isModalOpen={setIsModalCreateOrderOpen}
                                        notification={message => {
                                            setNotification(message)
                                        }}
                                    />
                                </Modal>
                                <Link
                                    href="/transaction/sales"
                                    className="btn btn-primary">
                                    Add New Sales
                                </Link>
                                <Link
                                    href="/transaction/purchase"
                                    className="btn btn-primary ml-4">
                                    Add New Purchase
                                </Link>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr className="">
                                        <th className="text-start p-4">
                                            Customer / Supplier
                                        </th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td className="text-start p-4">
                                            Customer / Supplier
                                        </td>
                                        <td>Amount</td>
                                        <td>Action</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transaction
