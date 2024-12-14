'use client'
import { useState, useEffect } from 'react'
import Header from '../../Header'
import axios from '@/lib/axios'
import Paginator from '@/components/Paginator'
import Input from '@/components/Input'

const Products = () => {
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [errors, setErrors] = useState([])

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
        fetchProducts()
    }, [])

    useEffect(() => {
        // console.log(selectedProduct)
    }, [selectedProduct])

    const handleChangePage = url => {
        fetchProducts(url)
    }

    return (
        <>
            <Header title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
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
                                        <td colSpan="5">No products found</td>
                                    </tr>
                                ) : (
                                    products?.data?.map(product => (
                                        <tr key={product.id}>
                                            <td>
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
                                            <td>{product.price}</td>
                                            <td>{product.stock}</td>
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
