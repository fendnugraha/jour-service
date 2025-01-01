'use client'
import Notification from '@/components/notification'
import Header from '../../../Header'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { ArrowLeftCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import formatDateTime from '@/lib/formatDateTime'
import formatNumber from '@/lib/formatNumber'
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
            const errorMsg = error.response?.data?.errors || ['Something went wrong.']
            setErrors(errorMsg)
        }
    }

    const { id } = params

    const fetchOrderById = async () => {
        try {
            const response = await axios.get(`/api/auth/orders/${id}`)
            setOrder(response.data.order)
        } catch (error) {
            const errorMsg = error.response?.data?.errors || ['Something went wrong.']
            setErrors(errorMsg)
        }
    }

    useEffect(() => {
        fetchOrderById()
    }, [id]) // Pastikan `id` ada sebagai dependensi
    // console.log(order)

    // Mengambil service fee yang sesuai
    const serviceFee = order?.journal?.find(journal => journal.cred_code === '40100-002')

    // Menghitung total spareparts
    const totalSpareparts = order?.transaction?.reduce((total, transaction) => {
        return total + Number(transaction.price) * Number(transaction.quantity * -1)
    }, 0)

    // Mengambil discount yang sesuai
    const discount = order?.journal?.find(journal => journal.debt_code === '60111-001')

    // Menghitung total transaksi
    const totalTransaction =
        totalSpareparts +
        (serviceFee?.amount ?? 0) - // Fallback ke 0 jika serviceFee tidak ada
        (discount?.amount ?? 0) // Fallback ke 0 jika discount tidak ada

    return (
        <>
            <Header title="Transaction" />
            <div className="py-12">
                {notification && <Notification notification={notification} onClose={() => setNotification('')} />}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">
                            <div className="flex justify-between gap-2 mb-5">
                                <h1 className="text-xl font-bold">Order details</h1>
                                <select
                                    value={order?.status}
                                    onChange={handleChangeStatusOrder}
                                    disabled={order?.status === 'Completed'}
                                    className="px-3 py-1 w-32 border rounded">
                                    <option value="Pending">Pending</option>
                                    <option value="Diagnosing">Diagnosing</option>
                                    <option value="Repairing">Repairing</option>
                                    {order?.status === 'Finished' && <option value="Finished">Finished</option>}
                                    {order?.status === 'Completed' && <option value="Completed">Completed</option>}
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
                                            <h1 className="text-xl font-bold">Customer details</h1>
                                            <table className="w-full text-sm">
                                                <tbody>
                                                    <tr>
                                                        <td className="font-bold">Tanggal Masuk</td>
                                                        <td>: {formatDateTime(order?.created_at)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">Order Number</td>
                                                        <td>: {order?.order_number}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">Customer</td>
                                                        <td>: {order?.contact?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">Nomor Handphone</td>
                                                        <td>: {order?.contact?.phone_number}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">Alamat</td>
                                                        <td>: {order?.contact?.address}</td>
                                                    </tr>
                                                    <tr className="border border-dashed-b">
                                                        <td colSpan={2} className="font-bold text-xl">
                                                            Device details
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">Type/Model</td>
                                                        <td>
                                                            : <span className="font-bold text-red-600">{order?.phone_type}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-bold">Deskripsi Kerusakan</td>
                                                        <td>:</td>
                                                    </tr>
                                                    <tr className="border border-dashed">
                                                        <td className="p-2 italic bg-yellow-200" colSpan={2}>
                                                            "{order?.description}"
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div>
                                            <div className="flex justify-between">
                                                <h1 className="text-xl font-bold">Biaya Perbaikan & Sparepart</h1>
                                                {order?.status !== 'Completed' && (
                                                    <Link href={`/transaction/order/${order?.id}`} className="text-indigo-600 hover:text-indigo-500 underline">
                                                        <PlusCircleIcon className="w-6 h-6 inline" /> Tambah parts
                                                    </Link>
                                                )}
                                            </div>
                                            <table className="table-auto w-full text-sm border border-dashed">
                                                <thead>
                                                    <tr className="border border-dashed">
                                                        <th className="border border-dashed p-1">Nama Sparepart</th>
                                                        <th className="border border-dashed">Harga</th>
                                                        <th className="border border-dashed">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.transaction.map(item => (
                                                        <tr key={item.id} className="text-xs">
                                                            <td className="p-1 border border-dashed">{item.product.name}</td>
                                                            <td className="border border-dashed text-end p-1">{formatNumber(item.price)}</td>
                                                            <td className="border border-dashed text-end p-1">{formatNumber(item.price * -item.quantity)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border border-dashed">
                                                        <td colSpan={2} className="p-1 border border-dashed text-end">
                                                            Total Biaya Spareparts
                                                        </td>
                                                        <td className="border border-dashed p-1 text-end">{formatNumber(totalSpareparts)}</td>
                                                    </tr>
                                                    {serviceFee?.amount > 0 && (
                                                        <tr className="border border-dashed">
                                                            <td className="p-1 border border-dashed text-end" colSpan={2}>
                                                                Biaya Jasa Service
                                                            </td>
                                                            <td className="border border-dashed p-1 text-end">
                                                                {serviceFee.amount > 0 ? formatNumber(serviceFee.amount) : 0}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {discount?.amount > 0 && (
                                                        <tr className="border border-dashed">
                                                            <td className="p-1 border border-dashed text-end" colSpan={2}>
                                                                Diskon (Rp)
                                                            </td>
                                                            <td className="border border-dashed p-1 text-end text-red-500">-{formatNumber(discount.amount)}</td>
                                                        </tr>
                                                    )}
                                                    {totalTransaction > 0 && (
                                                        <tr className="border border-dashed">
                                                            <th className="p-1 border border-dashed text-end" colSpan={2}>
                                                                Total
                                                            </th>
                                                            <th className="border border-dashed p-1 text-end">{formatNumber(totalTransaction)}</th>
                                                        </tr>
                                                    )}
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
                        <Link href="/transaction" className="bg-red-500 py-2 px-6 rounded-lg text-white">
                            <ArrowLeftCircleIcon className="w-6 h-6 inline" /> Back
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetail
