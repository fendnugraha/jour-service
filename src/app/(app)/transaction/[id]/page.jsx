'use client'
import Notification from '@/components/notification'
import Header from '../../Header'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { ArrowLeftCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import formatDateTime from '@/lib/formatDateTime'

const OrderDetail = ({ params }) => {
    const [notification, setNotification] = useState('')
    const [order, setOrder] = useState(null) // Default null untuk data tunggal
    const [errors, setErrors] = useState([])

    const { id } = params

    const fetchOrderById = async () => {
        try {
            const response = await axios.get(`/api/auth/orders/${id}`)
            setOrder(response.data.order)
        } catch (error) {
            const errorMsg = error.response?.data?.errors || [
                'Something went wrong.',
            ]
            setErrors(errorMsg)
        }
    }

    useEffect(() => {
        fetchOrderById()
    }, [id]) // Pastikan `id` ada sebagai dependensi
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
                            {errors.length > 0 ? (
                                <div className="text-red-500">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            ) : order ? (
                                <div>
                                    <div className="flex justify-between gap-2 mb-5">
                                        <h1 className="text-xl font-bold">
                                            Order details
                                        </h1>
                                        <h1 className="px-3 py-1 bg-yellow-300 rounded-xl">
                                            {order?.status}
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <table className="w-full text-sm">
                                                <tbody>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Tanggal Masuk
                                                        </td>
                                                        <td>
                                                            :{' '}
                                                            {formatDateTime(
                                                                order?.created_at,
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Order Number
                                                        </td>
                                                        <td>
                                                            :{' '}
                                                            {
                                                                order?.order_number
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Customer
                                                        </td>
                                                        <td>
                                                            :{' '}
                                                            {
                                                                order?.customer_name
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Nomor Handphone
                                                        </td>
                                                        <td>
                                                            :{' '}
                                                            {
                                                                order?.phone_number
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="mt-2 bg-slate-300 text-slate-700 px-2 py-1 rounded-lg">
                                                <p className="font-bold">
                                                    Alamat:
                                                </p>
                                                <p>{order?.address}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <table className="w-full text-sm">
                                                <tbody>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Type Handphone
                                                        </td>
                                                        <td>
                                                            :{' '}
                                                            {order?.phone_type}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Deskripsi Kerusakan
                                                        </td>
                                                        <td>:</td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className=""
                                                            colSpan={2}>
                                                            {order?.description}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Link
                            href="/transaction"
                            className="bg-red-500 py-2 px-6 rounded-lg text-white">
                            <ArrowLeftCircleIcon className="w-6 h-6 inline" />{' '}
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetail
