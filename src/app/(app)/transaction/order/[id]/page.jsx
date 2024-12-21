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
import formatNumber from '@/lib/formatNumber'

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
    const [cart, setCart] = useState([])

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

    //Cart Area

    const handleAddToCart = async product => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id)
            if (existingItem) {
                return prevCart.map(item => {
                    if (item.id === product.id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                    }
                    return item
                })
            } else {
                return [
                    ...prevCart,
                    { ...product, quantity: 1, order_id: order?.id },
                ]
            }
        })
    }

    const handleRemoveFromCart = product => {
        setCart(prevCart => {
            return prevCart.filter(item => item.id !== product.id)
        })
    }

    const handleClearCart = () => {
        setCart([])
    }

    const handleIncrementQuantity = product => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                }
                return item
            })
        })
    }

    const handleDecrementQuantity = product => {
        // Prevent decrementing quantity below 1
        if (product.quantity === 1) {
            handleRemoveFromCart(product)
            return
        }
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === product.id) {
                    if (item.quantity === 1) {
                        return {
                            ...item,
                            quantity: 1,
                        }
                    }
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                    }
                }
                return item
            })
        })
    }

    // handle update price
    const handlePriceChange = (product, newPrice) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        price: newPrice,
                    }
                }
                return item
            })
        })
    }

    const calculateTotalPrice = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        )
    }

    // End Cart Area
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
                            <h1 className="text-xl">
                                <span className="font-bold">
                                    {' '}
                                    Order Number:
                                </span>{' '}
                                {order?.order_number}
                            </h1>
                            <div className="relative mt-4" ref={dropdownRef}>
                                <Input
                                    type="search"
                                    onChange={handleSearch}
                                    value={search}
                                    placeholder="Cari products.."
                                    className={`w-1/2`}
                                />
                                <button
                                    onClick={handleClearCart}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2">
                                    Clear Cart
                                </button>
                                {isProductListOpen && (
                                    <div
                                        className={`absolute top-12 left-0 w-1/2 bg-white shadow-md border rounded-xl`}>
                                        {products?.data?.length > 0 ? (
                                            products?.data?.map(p => (
                                                <div
                                                    className="flex justify-between p-2 items-center shadow-sm"
                                                    key={p.id}>
                                                    <h2>{p.name}</h2>
                                                    <button
                                                        onClick={() => {
                                                            handleAddToCart(p)
                                                        }}
                                                        className="text-blue-500">
                                                        <PlusCircleIcon className="size-8" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex justify-between p-2 items-center shadow-sm">
                                                <h2>Loading ...</h2>
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length > 0 ? (
                                        cart.map(item => (
                                            <tr
                                                key={item.id}
                                                className="text-sm">
                                                <td className="w-1/2">
                                                    {item.name}
                                                </td>
                                                <td>
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button
                                                            onClick={() =>
                                                                handleDecrementQuantity(
                                                                    item,
                                                                )
                                                            }>
                                                            <MinusCircleIcon className="size-6 inline text-blue-500" />
                                                        </button>
                                                        <span>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleIncrementQuantity(
                                                                    item,
                                                                )
                                                            }>
                                                            <PlusCircleIcon className="size-6 inline text-blue-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Input
                                                        type="text"
                                                        className={
                                                            'text-xs text-end'
                                                        }
                                                        value={item.price}
                                                        onChange={e =>
                                                            handlePriceChange(
                                                                item,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-xs font-bold text-blue-600 block text-end">
                                                        Subtotal:{' '}
                                                        {formatNumber(
                                                            item.quantity *
                                                                item.price,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                item,
                                                            )
                                                        }>
                                                        <TrashIcon className="size-6 inline text-red-600" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">
                                                No items in cart
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th className="" colSpan="3">
                                            Total:
                                        </th>
                                        <th>
                                            {formatNumber(
                                                calculateTotalPrice(),
                                            )}
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SparepartCart
