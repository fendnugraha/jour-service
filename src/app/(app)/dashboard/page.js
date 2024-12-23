'use client'
import Header from '@/app/(app)/Header'
import Modal from '@/components/Modal'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import CreateOrderForm from '../transaction/CreateOrderForm'
import { useEffect, useState } from 'react'
import Notification from '@/components/notification'
import OrderTable from './OrderTable'
import axios from '@/lib/axios'

const Dashboard = () => {
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
            {notification && (
                <Notification
                    notification={notification}
                    onClose={() => setNotification('')}
                />
            )}
            <div className="">
                {/* <h1 className="text-2xl font-bold mb-4">Point of Sales - Add to Cart</h1> */}
                <Header title={'Dashboard'} />
                <div className="p-4 justify-between flex">
                    <select className="border border-gray-300 bg-white rounded-lg py-2 px-4">
                        <option value="">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="this-month">This Month</option>
                        <option value="last-month">Last Month</option>
                    </select>
                    <button
                        onClick={() => setIsModalCreateOrderOpen(true)}
                        className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600">
                        <PlusCircleIcon className="w-6 h-6 inline" /> New order
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
                </div>
                <OrderTable orders={orders} errors={errors} />
            </div>
        </>
    )
}

export default Dashboard
