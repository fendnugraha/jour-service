'use client'
import Link from 'next/link'
import Header from '../Header'
import Modal from '@/components/Modal'
import CreateOrderForm from './CreateOrderForm'
import Notification from '@/components/notification'
import { useState } from 'react'

const Transaction = ({ user }) => {
    const [notifications, setNotifications] = useState([])
    const closeModal = () => {
        setIsModalCreateOrderOpen(false)
    }
    const [isModalCreateOrderOpen, setIsModalCreateOrderOpen] = useState(false)
    const addNotification = (type, message) => {
        setNotifications([...notifications, { id: Date.now(), type, message }])
    }
    const removeNotification = id => {
        setNotifications(notifications.filter(n => n.id !== id))
    }
    return (
        <>
            <Header title="Transaction" />
            <div className="py-12">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        type={notification.type}
                        message={notification.message}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
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
                                            addNotification('success', message)
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
