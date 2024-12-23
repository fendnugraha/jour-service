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
import { useAuth } from '@/hooks/auth'
import Modal from '@/components/Modal'
import Label from '@/components/Label'

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
    const { id } = params
    const { user } = useAuth({ middleware: 'auth' })
    const [notification, setNotification] = useState('')
    const [order, setOrder] = useState(null) // Default null untuk data tunggal
    const [errors, setErrors] = useState([])
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [cart, setCart] = useState([])
    const [checkoutOrder, setCheckoutOrder] = useState({
        cart: cart,
        serviceFee: 0,
        discount: 0,
        total: 0,
        payment_method: '' ?? 'Cash',
        order_id: order?.id,
        warehouse_id: user.role.warehouse_id,
        user_id: user.id,
        contact_id: null,
    })
    const debouncedSearch = useDebounce(search, 500) // Apply debounce with 500ms delay
    const [isProductListOpen, setIsProductListOpen] = useState(false)
    const [isCredit, setIsCredit] = useState(false)
    const dropdownRef = useRef(null)
    const [isModalCheckOutOpen, setIsModalCheckOutOpen] = useState(false)
    const closeModal = () => {
        setIsModalCheckOutOpen(false)
    }

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

        return cartTotal
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
                total: calculateTotalPrice(),
                order_id: order?.id,
            })
            setNotification(response.data.message)
            handleClearCart()
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
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl">
                                    <span className="font-bold">
                                        {' '}
                                        Customer:
                                    </span>{' '}
                                    {order?.customer_name}
                                </h1>
                                <h1 className="text-xl">
                                    {order?.order_number}
                                </h1>
                            </div>
                            <div className="relative mt-4" ref={dropdownRef}>
                                <Input
                                    type="search"
                                    onChange={handleSearch}
                                    value={search}
                                    placeholder="Cari products.."
                                    className={`w-1/2`}
                                />

                                <Modal
                                    isOpen={isModalCheckOutOpen}
                                    onClose={closeModal}
                                    modalTitle={'Checkout'}>
                                    <div className="mb-4">
                                        <table className="w-full border border-dashed table-auto mb-2">
                                            <tbody>
                                                <tr className="border border-dashed">
                                                    <td className="p-2 border border-dashed w-3/4">
                                                        Total Biaya Sparepart
                                                    </td>
                                                    <td className="p-2 text-end">
                                                        Rp.{' '}
                                                        {formatNumber(
                                                            calculateTotalPrice(),
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr className="border border-dashed">
                                                    <td className="p-2 border border-dashed w-3/4">
                                                        Biaya Jasa Service
                                                    </td>
                                                    <td className="p-2 text-end">
                                                        Rp.{' '}
                                                        {formatNumber(
                                                            checkoutOrder.serviceFee,
                                                        )}
                                                    </td>
                                                </tr>
                                                {checkoutOrder.discount > 0 && (
                                                    <tr className="border border-dashed text-red-500">
                                                        <td className="p-2 border border-dashed w-3/4">
                                                            Discount
                                                        </td>
                                                        <td className="p-2 text-end">
                                                            Rp.{' -'}
                                                            {formatNumber(
                                                                checkoutOrder.discount,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <h1 className="font-bold text-2xl mb-2 text-end">
                                            Total Bayar: Rp.{' '}
                                            {formatNumber(
                                                calculateTotalPrice() +
                                                    Number(
                                                        checkoutOrder.serviceFee,
                                                    ) -
                                                    Number(
                                                        checkoutOrder.discount,
                                                    ),
                                            )}
                                        </h1>
                                        <div className="flex justify-between gap-4 pe-4 items-center w-fit bg-slate-800 rounded-full mb-2">
                                            <button
                                                onClick={() =>
                                                    setIsCredit(!isCredit)
                                                }
                                                className={`w-14 text-white flex items-center p-1 rounded-full transition-colors duration-300 ${
                                                    isCredit
                                                        ? 'bg-yellow-400'
                                                        : 'bg-slate-500'
                                                }`}>
                                                <div
                                                    className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${
                                                        isCredit
                                                            ? 'translate-x-7'
                                                            : 'translate-x-0'
                                                    }`}></div>
                                            </button>
                                            <h1 className="text-md text-white">
                                                {isCredit ? 'Credit' : 'Cash'}
                                            </h1>
                                        </div>
                                        <div className="">
                                            <Label htmlFor="account">
                                                Account Pembayaran Cash/Transfer
                                            </Label>
                                            <select className="w-full rounded-xl p-2">
                                                <option value="Cash">
                                                    Cash
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={closeModal}
                                            className="border border-red-500 text-red-500 p-3 w-44 rounded-xl">
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            className="bg-indigo-500 text-white p-3 w-44 rounded-xl">
                                            Checkout
                                        </button>
                                    </div>
                                </Modal>

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

                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr className="text-sm border-b">
                                        <th className="p-3">
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
                                                className="text-sm border-b">
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
                                                <td className="w-1/2 p-3">
                                                    {item.name}
                                                    <span className="block text-slate-400 text-xs">
                                                        {item.code} Sisa Stok:{' '}
                                                        {item.end_stock} Pcs
                                                    </span>
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
                                                <td className="text-end py-3">
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
                                    <tr className="">
                                        <td></td>
                                        <td></td>
                                        <td className="text-left font-bold">
                                            Total Biaya Sparepart
                                        </td>
                                        <td className="text-end py-3 font-bold">
                                            Rp.{' '}
                                            {formatNumber(
                                                calculateTotalPrice(),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td className="text-sm">
                                            Biaya Jasa Service (Rp.)
                                        </td>
                                        <td className="text-end py-1">
                                            <Input
                                                type="text"
                                                className="text-end text-xs"
                                                value={checkoutOrder.serviceFee}
                                                onChange={e => {
                                                    setCheckoutOrder({
                                                        ...checkoutOrder,
                                                        serviceFee:
                                                            e.target.value,
                                                    })
                                                }}
                                                placeholder="Jasa Service (Rp.)"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td></td>
                                        <td></td>
                                        <td className="text-sm">
                                            Diskon (Rp.)
                                        </td>
                                        <td className="text-end py-1">
                                            <Input
                                                type="text"
                                                className="text-end text-red-500 text-xs"
                                                value={checkoutOrder.discount}
                                                onChange={e => {
                                                    setCheckoutOrder({
                                                        ...checkoutOrder,
                                                        discount:
                                                            e.target.value,
                                                    })
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
                                        <th className="text-left">Total :</th>
                                        <th className="text-end text-xl py-3">
                                            Rp.{' '}
                                            {formatNumber(
                                                calculateTotalPrice() +
                                                    Number(
                                                        checkoutOrder.serviceFee,
                                                    ) -
                                                    Number(
                                                        checkoutOrder.discount,
                                                    ),
                                            )}
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="flex justify-between gap-1 items-center">
                                <Link
                                    href={'/transaction'}
                                    className="bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-lg ml-2">
                                    Kembali
                                </Link>
                                {calculateTotalPrice() !== 0 && (
                                    <button
                                        onClick={() =>
                                            setIsModalCheckOutOpen(true)
                                        }
                                        className="bg-indigo-500 hover:bg-indigo-400 text-white w-44 py-3 rounded-lg ml-2">
                                        Checkout
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SparepartCart
