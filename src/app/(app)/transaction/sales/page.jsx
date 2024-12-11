'use client'
import { useState, useEffect } from 'react'
import Input from '@/components/Input'
import ProductCard from '@/components/ProductCard'
import axios from '@/lib/axios'
import {
    MinusCircleIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/24/solid'

// Utility function for debouncing
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

const { default: Header } = require('../../Header')

const Sales = () => {
    const [productList, setProductList] = useState([])
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500) // Apply debounce with 500ms delay
    const [cart, setCart] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    function formatNumber(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number)
    }

    // Handle search input change
    const handleSearch = e => {
        setSearch(e.target.value)
    }

    // Fetch product list based on debounced search term
    const fetchProduct = async () => {
        if (debouncedSearch.length > 3) {
            try {
                const response = await axios.get('/api/auth/products', {
                    params: { search: debouncedSearch },
                })
                setProductList(response.data.data)
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('Error fetching products:', error)
            }
        } else {
            setProductList([]) // Clear product list if search is too short
        }
    }

    // Add product to cart
    const handleAddToCart = product => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(
                item => item.id === product.id,
            )
            if (existingProduct) {
                // If product is already in the cart, increase its quantity
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                )
            }
            // Otherwise, add the product to the cart with quantity 1
            return [...prevCart, { ...product, quantity: 1 }]
        })
    }

    // Update product quantity in cart
    // eslint-disable-next-line no-unused-vars
    const handleUpdateQuantity = (product, newQuantity) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: newQuantity }
                    : item,
            )
        })
    }

    // update product price in cart
    const handleUpdatePrice = (product, newPrice) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === product.id ? { ...item, price: newPrice } : item,
            )
        })
    }

    // Check if a product is in the cart
    // eslint-disable-next-line no-unused-vars
    const isProductInCart = product => {
        return cart.some(item => item.id === product.id)
    }

    // Add quantity by 1
    const handleIncrementQuantity = product => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
            )
        })
    }

    // Subtract quantity by 1
    const handleDecrementQuantity = product => {
        //if quantity is 1, remove product from cart
        if (product.quantity === 1) {
            handleRemoveFromCart(product)
            return
        }
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item,
            )
        })
    }

    // Calculate total price
    const calculateTotalPrice = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        )
        // return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    // Remove product from cart
    const handleRemoveFromCart = product => {
        setCart(prevCart => prevCart.filter(item => item.id !== product.id))
    }

    // Handle clear cart
    const handleClearCart = () => {
        setCart([])
    }

    // Load cart from localStorage on component mount
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || []
        setCart(storedCart)
    }, [])

    // Fetch product list when debounced search term changes
    useEffect(() => {
        fetchProduct()
    }, [debouncedSearch])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
        setTotalPrice(calculateTotalPrice())
    }, [cart])

    return (
        <>
            <Header title="Sales" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-auto">
                        <div className="grid grid-cols-5 gap-4 sm:h-[70vh]">
                            <div className="col-span-3">
                                <Input
                                    id="search"
                                    type="search"
                                    onChange={handleSearch}
                                    value={search}
                                    placeholder="Search product ..."
                                    className="mt-1 block w-full rounded-xl border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <div className="mt-3 grid grid-cols-2 gap-3 overflow-y-auto">
                                    {productList?.data?.length === 0 ? (
                                        <div>No data</div>
                                    ) : (
                                        productList?.data?.map(product => (
                                            <ProductCard
                                                product={product}
                                                key={product.id}
                                                onAddToCart={handleAddToCart}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold">Items</h1>
                                    <button
                                        onClick={handleClearCart}
                                        className="text-red-600 hover:underline">
                                        Clear all
                                    </button>
                                </div>
                                {cart.length === 0 ? (
                                    <div>Cart is empty</div>
                                ) : (
                                    cart.map(item => (
                                        <div
                                            className="border-b border-gray-200 py-2 nth-last-child(1):border-0"
                                            key={item.id}>
                                            <div className="flex justify-between align-top">
                                                <h1 className="font-bold text-sm">
                                                    {item.name}
                                                </h1>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveFromCart(
                                                            item,
                                                        )
                                                    }>
                                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center my-2">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleDecrementQuantity(
                                                                item,
                                                            )
                                                        }>
                                                        <MinusCircleIcon className="w-6 h-6" />
                                                    </button>
                                                    <span className="mx-2">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleIncrementQuantity(
                                                                item,
                                                            )
                                                        }>
                                                        <PlusCircleIcon className="w-6 h-6" />
                                                    </button>
                                                </div>
                                                {/* <h1 className="text-lg text-gray-700 font-bold">
                                                    {formatNumber(
                                                        item.price *
                                                            item.quantity,
                                                    )}
                                                </h1> */}
                                                <div>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={e =>
                                                            handleUpdatePrice(
                                                                item,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full text-xs text-end border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    />

                                                    <span className="text-xs block text-end text-gray-500">
                                                        Subtotal:{' '}
                                                        {formatNumber(
                                                            item.price *
                                                                item.quantity,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <button className="w-full mt-4 bg-indigo-600 text-white py-4 px-6  rounded-full flex justify-between items-center">
                                    <span>Checkout</span>
                                    <div>
                                        <span className="font-bold text-yellow-200">
                                            {formatNumber(totalPrice)} <br />
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sales
