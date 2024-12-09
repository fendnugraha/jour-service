'use client'
import { useState, useEffect, use } from 'react'
import Input from '@/components/Input'
import ProductCard from '@/components/ProductCard'
import axios from '@/lib/axios'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid'

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
                console.log(error)
            }
        }
    }

    // Trigger the fetch when the debounced search term changes
    useEffect(() => {
        fetchProduct() // Trigger fetch only when debounced search changes
        localStorage.setItem('cart', JSON.stringify(cart))
        console.log(cart)
    }, [debouncedSearch, cart])

    // Add product to cart
    const handleAddToCart = product => {
        setCart(prevCart => [...prevCart, { ...product, quantity: 1 }])
    }

    // Remove product from cart
    const handleRemoveFromCart = product => {
        setCart(prevCart => prevCart.filter(item => item.id !== product.id))
    }

    // handle clear cart
    const handleClearCart = () => {
        setCart([])
    }
    return (
        <>
            <Header title="Sales" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
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
                                <div className="mt-3 grid grid-cols-2 gap-3">
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
                                <h1 className="font-bold mb-4">Items</h1>
                                <div className="border-b border-gray-200 py-2">
                                    <h1 className="font-bold text-sm">
                                        HP OPPO RENO 7Z 5G 8/128GB
                                    </h1>
                                    <div className="flex justify-between items-center my-2">
                                        <div className="flex items-center gap-1">
                                            <button>
                                                <MinusCircleIcon className="w-6 h-6" />
                                            </button>
                                            <span className="mx-2">1</span>
                                            <button>
                                                <PlusCircleIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <small className="text-lg text-gray-700 font-bold">
                                            Subtotal: Rp. 1.000.000
                                            <span className="text-xs block text-end text-gray-500">
                                                Price: Rp. 1.000.000
                                            </span>
                                        </small>
                                    </div>
                                </div>
                                <div className="border-b border-gray-200 py-2">
                                    <h1 className="font-bold text-sm">
                                        HP OPPO RENO 7Z 5G 8/128GB
                                    </h1>
                                    <div className="flex justify-between items-center my-2">
                                        <div className="flex items-center gap-1">
                                            <button>
                                                <MinusCircleIcon className="w-6 h-6" />
                                            </button>
                                            <span className="mx-2">1</span>
                                            <button>
                                                <PlusCircleIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <small className="text-lg text-gray-700 font-bold">
                                            Subtotal: Rp. 1.000.000
                                            <span className="text-xs block text-end text-gray-500">
                                                Price: Rp. 1.000.000
                                            </span>
                                        </small>
                                    </div>
                                </div>
                                <div className="border-b border-gray-200 py-2">
                                    <h1 className="font-bold text-sm">
                                        HP OPPO RENO 7Z 5G 8/128GB
                                    </h1>
                                    <div className="flex justify-between items-center my-2">
                                        <div className="flex items-center gap-1">
                                            <button>
                                                <MinusCircleIcon className="w-6 h-6" />
                                            </button>
                                            <span className="mx-2">1</span>
                                            <button>
                                                <PlusCircleIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <small className="text-lg text-gray-700 font-bold">
                                            Subtotal: Rp. 1.000.000
                                            <span className="text-xs block text-end text-gray-500">
                                                Price: Rp. 1.000.000
                                            </span>
                                        </small>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-indigo-600 text-white py-2 px-6  rounded-full flex justify-between items-center">
                                    <span>Checkout</span>
                                    <span className="font-bold text-yellow-200">
                                        Rp. 100.000.000
                                    </span>
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="w-full mt-2 bg-red-500 text-white py-2 px-6  rounded-full">
                                    Clear Cart
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
