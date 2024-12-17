'use client'
import { useState, useEffect } from 'react'
import Header from '../../Header'
import axios from '@/lib/axios'
import Paginator from '@/components/Paginator'
import Input from '@/components/Input'
import formatNumber from '@/lib/formatNumber'
import CreateProduct from './CreateProduct'
import Modal from '@/components/Modal'
import CreateCategoryProduct from './CreateCategoryProduct'
const Products = () => {
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [errors, setErrors] = useState([])
    const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
        useState(false)
    const [
        isModalCreateCategoryProductOpen,
        setIsModalCreateCategoryProductOpen,
    ] = useState(false)

    const closeModal = () => {
        setIsModalCreateProductOpen(false)
        setIsModalCreateCategoryProductOpen(false)
    }

    const handleSelectProduct = id => {
        setSelectedProduct(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(item => item !== id)
            } else {
                return [...prevSelected, id]
            }
        })
    }
    const fetchProducts = async (url = '/api/auth/products') => {
        try {
            const response = await axios.get(url)
            setProducts(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    useEffect(() => {
        fetchProducts('/api/auth/products')
    }, [])

    const handleChangePage = url => {
        fetchProducts(url)
    }

    return (
        <>
            <Header title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                        <div className="flex justify-between">
                            <button
                                onClick={() =>
                                    setIsModalCreateProductOpen(true)
                                }
                                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Add Product
                            </button>
                            <button
                                onClick={() =>
                                    setIsModalCreateCategoryProductOpen(true)
                                }
                                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Add Category Product
                            </button>
                            <Modal
                                isOpen={isModalCreateCategoryProductOpen}
                                onClose={closeModal}
                                modalTitle="Create Category Product">
                                <CreateCategoryProduct
                                    isModalOpen={
                                        setIsModalCreateCategoryProductOpen
                                    }
                                    notification={message =>
                                        setNotification(message)
                                    }
                                    // fetchCategoryProducts={fetchCategoryProducts}
                                />
                            </Modal>

                            <Modal
                                isOpen={isModalCreateProductOpen}
                                onClose={closeModal}
                                modalTitle="Create Product">
                                <CreateProduct
                                    isModalOpen={setIsModalCreateProductOpen}
                                    notification={message =>
                                        setNotification(message)
                                    }
                                    fetchProducts={fetchProducts}
                                />
                            </Modal>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">No products found</td>
                                    </tr>
                                ) : (
                                    products?.data?.map(product => (
                                        <tr key={product.id}>
                                            <td className="text-center">
                                                <Input
                                                    checked={selectedProduct.includes(
                                                        product.id,
                                                    )}
                                                    onChange={() => {
                                                        handleSelectProduct(
                                                            product.id,
                                                        )
                                                    }}
                                                    type="checkbox"
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>
                                                {formatNumber(product.price)}
                                            </td>
                                            <td>{product.end_stock}</td>
                                            <td>
                                                <button className="btn-primary mr-2">
                                                    Edit
                                                </button>
                                                <button className="btn-primary">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {products?.data?.length > 0 && (
                            <Paginator
                                links={products}
                                handleChangePage={handleChangePage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products
