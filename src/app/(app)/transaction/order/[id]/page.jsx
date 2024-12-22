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
    XCircleIcon,
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
    const [serviceFee, setServiceFee] = useState(0)
    const [discount, setDiscount] = useState(0)
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
            let updatedCart

            if (existingItem) {
                updatedCart = prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                )
            } else {
                updatedCart = [
                    ...prevCart,
                    { ...product, quantity: 1, order_id: order?.id },
                ]
            }

            // Update localStorage with the new cart
            localStorage.setItem('cart', JSON.stringify(updatedCart))
            return updatedCart
        })
    }

    const handleRemoveFromCart = product => {
        setCart(prevCart => {
            const updatedCart = prevCart.filter(item => item.id !== product.id)

            // Update localStorage with the new cart
            localStorage.setItem('cart', JSON.stringify(updatedCart))

            return updatedCart
        })
    }

    const handleClearCart = () => {
        setCart([])
        localStorage.setItem('cart', JSON.stringify([])) // Clear cart in localStorage
    }

    const handleIncrementQuantity = product => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
            )
            localStorage.setItem('cart', JSON.stringify(updatedCart)) // Sync with localStorage
            return updatedCart
        })
    }

    const handleDecrementQuantity = product => {
        if (product.quantity === 1) {
            handleRemoveFromCart(product) // Use the remove function if quantity is 1
            return
        }
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item,
            )
            localStorage.setItem('cart', JSON.stringify(updatedCart)) // Sync with localStorage
            return updatedCart
        })
    }

    const handlePriceChange = (product, newPrice) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === product.id ? { ...item, price: newPrice } : item,
            )
            localStorage.setItem('cart', JSON.stringify(updatedCart)) // Sync with localStorage
            return updatedCart
        })
    }

    const calculateTotalPrice = () => {
        const cartTotal = cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        )

        // Ensure serviceFee and discount are numbers
        const total = Number(cartTotal) + Number(serviceFee) - Number(discount)

        return total
    }

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || []
        setCart(storedCart)
    }, [])

    const handleCheckout = async () => {
        try {
            const response = await axios.post('/api/auth/transactions', {
                cart,
                serviceFee: serviceFee,
                discount: discount,
                transaction_type: 'Sales',
                total: calculateTotalPrice(),
                order_id: order?.id,
            })
            setNotification(response.data.message)
            handleClearCart()
            setServiceFee(0)
            setDiscount(0)
        } catch (error) {
            const errorMsg = error.response?.data?.errors || [
                'Something went wrong.',
            ]
            setErrors(errorMsg)
        }
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
                                {calculateTotalPrice() !== 0 && (
                                    <button
                                        onClick={handleCheckout}
                                        className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg ml-2">
                                        Checkout
                                    </button>
                                )}
                                {cart.length > 0 && (
                                    <button
                                        onClick={handleClearCart}
                                        className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg ml-2">
                                        Clear Cart
                                    </button>
                                )}

                                {isProductListOpen && (
                                    <div
                                        className={`absolute top-12 left-0 w-1/2 bg-white shadow-md border rounded-xl z-10`}>
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
                                        <th className="">
                                            <button
                                                onClick={() =>
                                                    handleClearCart()
                                                }
                                                disabled={cart.length === 0} // Proper dynamic disabled attribute
                                                className={`inline-flex items-center ${
                                                    cart.length === 0
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : ''
                                                }`}>
                                                <TrashIcon className="w-6 h-6 text-red-600" />
                                            </button>
                                        </th>
                                        <th>Name Sparepart</th>
                                        <th>Qty</th>
                                        <th>Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length > 0 ? (
                                        cart.map(item => (
                                            <tr
                                                key={item.id}
                                                className="text-sm">
                                                <td className="text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                item,
                                                            )
                                                        }>
                                                        <XCircleIcon className="size-5 inline text-red-600" />
                                                    </button>
                                                </td>
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
                                                            <MinusCircleIcon className="size-6 inline text-blue-500 active:text-yellow-300" />
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
                                                            <PlusCircleIcon className="size-6 inline text-blue-500 active:text-yellow-300" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-end">
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
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">
                                                Tidak ada pergantian parts
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Biaya Jasa Service (Rp.)</td>
                                        <td className="text-end">
                                            <Input
                                                type="text"
                                                className="text-end text-xs"
                                                value={serviceFee}
                                                onChange={e => {
                                                    setServiceFee(
                                                        e.target.value,
                                                    )
                                                }}
                                                placeholder="Jasa Service (Rp.)"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Diskon (Rp.)</td>
                                        <td className="text-end">
                                            <Input
                                                type="text"
                                                className="text-end text-red-500 text-xs"
                                                value={discount}
                                                onChange={e => {
                                                    setDiscount(e.target.value)
                                                }}
                                                placeholder="Diskon (Rp.)"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="text-xl">
                                        <th></th>
                                        <th></th>
                                        <th className="text-left">Total:</th>
                                        <th className="text-end text-xl">
                                            Rp.{' '}
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
