'use client'
import Link from 'next/link'
import Header from '../Header'
import Modal from '@/components/Modal'
import CreateOrderForm from './CreateOrderForm'
import Notification from '@/components/notification'
import { useEffect, useState } from 'react'
import { PlusCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import axios from '@/lib/axios'
import formatDateTime from '@/lib/formatDateTime'
import TimeAgo from '@/lib/formatDateDistance'

const Transaction = ({ user }) => {
    const [orders, setOrders] = useState([])
    const [notification, setNotification] = useState('')
    const [errors, setErrors] = useState([])
    const closeModal = () => {
        setIsModalCreateOrderOpen(false)
    }
    const [isModalCreateOrderOpen, setIsModalCreateOrderOpen] = useState(false)

    const fetchOrder = async () => {
        try {
            const response = await axios.get('/api/auth/orders')
            setOrders(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [])
    return (
        <>
            <Header title="Transaction" />
            <div className="py-12">
                {notification && (
                    <Notification
                        notification={notification}
                        onClose={() => setNotification('')}
                    />
                )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">
                            <div className="flex justify-between mb-3">
                                <button
                                    className="btn btn-primary mr-4"
                                    onClick={() =>
                                        setIsModalCreateOrderOpen(true)
                                    }>
                                    <PlusCircleIcon className="w-6 h-6 inline" />{' '}
                                    New order
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
                                        fetchOrder={fetchOrder}
                                    />
                                </Modal>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href="/transaction/sales"
                                        className="bg-green-500 py-2 px-6 rounded-lg text-white">
                                        <PlusCircleIcon className="w-6 h-6 inline" />{' '}
                                        New Sales
                                    </Link>
                                    <Link
                                        href="/transaction/purchase"
                                        className="bg-green-500 py-2 px-6 rounded-lg text-white ml-2">
                                        <PlusCircleIcon className="w-6 h-6 inline" />{' '}
                                        New Purchase
                                    </Link>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Phone Type</th>
                                        <th>Customer Name</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders?.data?.length > 0 ? (
                                        orders?.data?.map(order => (
                                            <tr key={order.id}>
                                                <td>
                                                    <span className="text-xs block text-slate-500">
                                                        {formatDateTime(
                                                            order.created_at,
                                                        )}
                                                    </span>
                                                    {order.order_number}
                                                    <span className="text-xs block">
                                                        {TimeAgo({
                                                            timestamp:
                                                                order.created_at,
                                                        })}
                                                    </span>
                                                </td>
                                                <td>{order.phone_type}</td>
                                                <td>{order.customer_name}</td>
                                                <td>
                                                    {order.status}
                                                    <span className="text-xs block">
                                                        @{' '}
                                                        {formatDateTime(
                                                            order.updated_at,
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        href={`/transaction/detail/${order.id}`}>
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No data</td>
                                        </tr>
                                    )}
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
