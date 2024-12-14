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

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true, // Use 12-hour format; set to false for 24-hour format
            timeZone: 'Asia/Jakarta',
        })
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
                {/* <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-4 px-4 sm:h-[400px] overflow-auto">
                    <div className="flex flex-col p-6 items-start justify-between gap-4 shadow-sm bg-white rounded-2xl order-1">
                        <div>
                            <h1 className="text-sm">
                                <PresentationChartBarIcon className="w-4 h-4 inline text-indigo-600" />{' '}
                                Total Sales
                            </h1>
                        </div>
                        <div>
                            <span>Rp.</span>
                            <h1 className="text-3xl font-bold">200,000,000</h1>
                        </div>
                        <div className="border-t w-full pt-2 flex justify-end">
                            <a href="#" className="text-gray-600">
                                View report{' '}
                                <ArrowRightCircleIcon className="w-4 h-4 ml-2 align-middle inline" />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col p-6 items-start justify-between gap-4 shadow-sm bg-white rounded-2xl order-2">
                        <div>
                            <h1 className="text-sm">
                                <ShoppingBagIcon className="w-4 h-4 inline text-indigo-600" />{' '}
                                Total Orders
                            </h1>
                        </div>
                        <div>
                            <span>Orders</span>
                            <h1 className="text-3xl font-bold">
                                {orders.length}
                            </h1>
                        </div>
                        <div className="border-t w-full pt-2 flex justify-end">
                            <a href="#" className="text-gray-600">
                                View report{' '}
                                <ArrowRightCircleIcon className="w-4 h-4 ml-2 align-middle inline" />
                            </a>
                        </div>
                    </div>
                    <div className="p-6 shadow-sm sm:col-span-2 cols-span-1 sm:row-span-2 bg-white rounded-2xl order-last sm:order-3">
                        <h1 className="text-xl font-bold">New order</h1>
                        <table className="w-full mt-4 table-auto text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-start">
                                        Order number
                                    </th>
                                    <th className="text-start">Phone type</th>
                                    <th className="text-start">Status</th>
                                    <th className="text-start">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr className="border-b" key={order.id}>
                                        <td className="p-2">
                                            <span className="text-xs block text-gray-500">
                                                {formatDate(order.created_at)}
                                            </span>
                                            {order.order_number}
                                        </td>
                                        <td>{order.phone_type}</td>
                                        <td>
                                            <span className="py-1 px-3 font-bold bg-yellow-400 rounded-full text-xs text-gray-800">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button>
                                                <EyeIcon className="w-6 h-6 text-gray-700" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col p-6 items-start justify-between gap-4 shadow-sm bg-white rounded-2xl order-4">
                        <div>
                            <h1 className="text-sm">
                                <WrenchIcon className="w-4 h-4 inline text-indigo-600" />{' '}
                                On Process
                            </h1>
                        </div>
                        <div>
                            <span>Unit</span>
                            <h1 className="text-3xl font-bold">50</h1>
                        </div>
                        <div className="border-t w-full pt-2 flex justify-end">
                            <a href="#" className="text-gray-600">
                                View report{' '}
                                <ArrowRightCircleIcon className="w-4 h-4 ml-2 align-middle inline" />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col p-6 items-start justify-between gap-4 shadow-sm bg-white rounded-2xl order-5">
                        <div>
                            <h1 className="text-sm">
                                <CheckBadgeIcon className="w-4 h-4 inline text-indigo-600" />{' '}
                                Finished
                            </h1>
                        </div>
                        <div>
                            <span>Unit</span>
                            <h1 className="text-3xl font-bold">30</h1>
                        </div>
                        <div className="border-t w-full pt-2 flex justify-end">
                            <a href="#" className="text-gray-600">
                                View report{' '}
                                <ArrowRightCircleIcon className="w-4 h-4 ml-2 align-middle inline" />
                            </a>
                        </div>
                    </div>
                </div> */}
                <OrderTable orders={orders} errors={errors} />
            </div>
        </>
    )
}

export default Dashboard
