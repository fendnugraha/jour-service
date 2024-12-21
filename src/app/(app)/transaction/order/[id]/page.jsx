'use client'
import Notification from '@/components/notification'
import Header from '../../../Header'
import { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import {
    ArrowLeftCircleIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/24/solid'
import Input from '@/components/Input'

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler) // Clean up on component unmount or when value changes
        }
    }, [value, delay])

    return debouncedValue
}

const SparepartCart = ({ params }) => {
    const [notification, setNotification] = useState('')
    const [order, setOrder] = useState(null) // Default null untuk data tunggal
    const [errors, setErrors] = useState([])
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500) // Apply debounce with 500ms delay
    const [isProductListOpen, setIsProductListOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleClickOutside = event => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsProductListOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSearch = e => {
        setSearch(e.target.value)
    }
    const fetchProduct = async () => {
        if (debouncedSearch.length > 3) {
            setIsProductListOpen(true)
            try {
                const response = await axios.get('/api/auth/products', {
                    params: { search: debouncedSearch },
                })
                setProducts(response.data.data)
                // console.log(response.data.data)
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('Error fetching products:', error)
            }
        } else {
            setProducts([]) // Clear product list if search is too short
        }
    }

    // Fetch product list when debounced search term changes
    useEffect(() => {
        fetchProduct()
    }, [debouncedSearch])

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
            <Header title="Order - Add Spareparts" />
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
                            <div className="relative" ref={dropdownRef}>
                                <Input
                                    type="search"
                                    onChange={handleSearch}
                                    value={search}
                                    placeholder="Cari products.."
                                    className={`w-1/2`}
                                />
                                {isProductListOpen && (
                                    <div
                                        className={`absolute top-12 left-0 w-1/2 bg-white shadow-md border rounded-xl`}>
                                        {products?.data?.length > 0 ? (
                                            products?.data?.map(p => (
                                                <div className="flex justify-between p-2 items-center shadow-sm">
                                                    <h2>{p.name}</h2>
                                                    <PlusCircleIcon className="size-8" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex justify-between p-2 items-center shadow-sm">
                                                <h2>Type to search</h2>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <table className="table mt-4">
                                <thead>
                                    <tr>
                                        <th>Name Sparepart</th>
                                        <th>Qty</th>
                                        <th>Harga</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="w-1/2">Parts 1</td>
                                        <td>
                                            <div className="flex items-center justify-center gap-4">
                                                <button>
                                                    <MinusCircleIcon className="size-6 inline text-blue-500" />
                                                </button>
                                                1
                                                <button>
                                                    <PlusCircleIcon className="size-6 inline text-blue-500" />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value="200.000"
                                            />
                                        </td>
                                        <td>100.200.000</td>
                                        <td>
                                            <button>
                                                <TrashIcon className="size-6 inline text-red-600" />
                                            </button>
                                        </td>
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

export default SparepartCart
