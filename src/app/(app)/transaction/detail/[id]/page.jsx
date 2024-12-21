'use client'
import Notification from '@/components/notification'
import Header from '../../../Header'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { ArrowLeftCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import formatDateTime from '@/lib/formatDateTime'
import Timeline from '@/components/Timeline'

const OrderDetail = ({ params }) => {
    const [notification, setNotification] = useState('')
    const [order, setOrder] = useState(null) // Default null untuk data tunggal
    const [errors, setErrors] = useState([])

    const handleChangeStatusOrder = async e => {
        e.preventDefault()

        try {
            const response = await axios.put(
                `/api/auth/orders/${id}`,
                { status: e.target.value },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            setNotification(response.data.message)
            fetchOrderById()
        } catch (error) {
            const errorMsg = error.response?.data?.errors || [
                'Something went wrong.',
            ]
            setErrors(errorMsg)
        }
    }

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
                            <div className="flex justify-between gap-2 mb-5">
                                <h1 className="text-xl font-bold">
                                    Order details
                                </h1>
                                <select
                                    value={order?.status}
                                    onChange={handleChangeStatusOrder}
                                    className="px-3 py-1 border rounded">
                                    <option value="Pending">Pending</option>
                                    <option value="Diagnosing">
                                        Diagnosing
                                    </option>
                                    <option value="Repairing">Repairing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <Timeline status={order?.status} />
                            </div>
                            {errors.length > 0 ? (
                                <div className="text-red-500">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            ) : order ? (
                                <div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <h1 className="text-xl font-bold">
                                                Customer details
                                            </h1>
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
                                                    <tr>
                                                        <td className="font-bold">
                                                            Alamat
                                                        </td>
                                                        <td>
                                                            : {order?.address}
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td
                                                            colSpan={2}
                                                            className="font-bold text-xl">
                                                            Device details
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Type/Model
                                                        </td>
                                                        <td>
                                                            :{' '}
                                                            <span className="font-bold text-red-600">
                                                                {
                                                                    order?.phone_type
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">
                                                            Deskripsi Kerusakan
                                                        </td>
                                                        <td>:</td>
                                                    </tr>
                                                    <tr className="border border-dashed">
                                                        <td
                                                            className="p-2 italic bg-yellow-200"
                                                            colSpan={2}>
                                                            "
                                                            {order?.description}
                                                            "
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div>
                                            <div className="flex justify-between">
                                                <h1 className="text-xl font-bold">
                                                    Biaya Perbaikan & Sparepart
                                                </h1>
                                                <Link
                                                    href={`/transaction/order/${order?.id}`}
                                                    className="text-indigo-600 hover:text-indigo-500 underline">
                                                    <PlusCircleIcon className="w-6 h-6 inline" />{' '}
                                                    Tambah parts
                                                </Link>
                                            </div>
                                            <table className="table-auto w-full text-sm border">
                                                <thead>
                                                    <tr className="border">
                                                        <th className="border p-1">
                                                            Nama Sparepart
                                                        </th>
                                                        <th className="border">
                                                            Harga
                                                        </th>
                                                        <th className="border">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="p-1 border">
                                                            Parts 1
                                                        </td>
                                                        <td className="border text-end p-1">
                                                            200.000
                                                        </td>
                                                        <td className="border text-end p-1">
                                                            200.000
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-1 border">
                                                            Parts 2
                                                        </td>
                                                        <td className="border text-end p-1">
                                                            200.000
                                                        </td>
                                                        <td className="border text-end p-1">
                                                            200.000
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-1 border">
                                                            Parts 3
                                                        </td>
                                                        <td className="border text-end p-1">
                                                            200.000
                                                        </td>
                                                        <td className="border text-end p-1">
                                                            200.000
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border">
                                                        <td
                                                            colSpan={2}
                                                            className="p-1 border text-end">
                                                            Total Biaya
                                                            Spareparts
                                                        </td>
                                                        <td className="border p-1 text-end">
                                                            600.000
                                                        </td>
                                                    </tr>
                                                    <tr className="border">
                                                        <td
                                                            className="p-1 border text-end"
                                                            colSpan={2}>
                                                            Biaya Jasa Service
                                                        </td>
                                                        <td className="border p-1 text-end">
                                                            500.000
                                                        </td>
                                                    </tr>
                                                    <tr className="border">
                                                        <td
                                                            className="p-1 border text-end"
                                                            colSpan={2}>
                                                            Diskon (Rp)
                                                        </td>
                                                        <td className="border p-1 text-end text-red-500">
                                                            - 25.000
                                                        </td>
                                                    </tr>
                                                    <tr className="border">
                                                        <th
                                                            className="p-1 border text-end"
                                                            colSpan={2}>
                                                            Total
                                                        </th>
                                                        <th className="border p-1 text-end">
                                                            475.000
                                                        </th>
                                                    </tr>
                                                </tfoot>
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
