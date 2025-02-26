"use client";

import Header from "@/app/(app)/Header";
import Paginator from "@/components/Paginator";
import axios from "@/libs/axios";
import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import CreateCategoryProduct from "./CreateCategoryProduct";
import CreateProduct from "./CreateProduct";
import formatNumber from "@/libs/formatNumber";
import Notification from "@/components/notification";
import { EyeIcon, MessageCircleWarningIcon, PencilIcon, PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { set } from "date-fns";
import EditProduct from "./EditProduct";

export default function Product() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [notification, setNotification] = useState("");
    const [errors, setErrors] = useState([]); // Store validation errors
    const [isModalCreateProductOpen, setIsModalCreateProductOpen] = useState(false);
    const [isModalCreateCategoryProductOpen, setIsModalCreateCategoryProductOpen] = useState(false);
    const [isModalUpdateProductOpen, setIsModalUpdateProductOpen] = useState(false);
    const [isModalDeleteProductOpen, setIsModalDeleteProductOpen] = useState(false);
    const [productCategories, setProductCategories] = useState([]);

    // Fetch Accounts
    const fetchProducts = async (url = "/api/products") => {
        try {
            const response = await axios.get(url, {
                params: {
                    search: search,
                },
            });
            setProduct(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    const fetchProductCategories = async () => {
        try {
            const response = await axios.get("api/product-categories");
            setProductCategories(response.data.data);
        } catch (error) {
            setErrors(error.response?.message || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchProductCategories();
    }, [product]);

    // const handleSelectProduct = id => {
    //     setSelectedProduct(prevSelected => {
    //         if (prevSelected.includes(id)) {
    //             return prevSelected.filter(item => item !== id)
    //         } else {
    //             return [...prevSelected, id]
    //         }
    //     })
    // }

    const handleDeleteProduct = async (id) => {
        try {
            const response = await axios.delete(`api/products/${id}`);
            setNotification(response.data.message);
            fetchProducts();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            setNotification(error.response.data.message);
        }
    };

    const closeModal = () => {
        setIsModalCreateProductOpen(false);
        setIsModalCreateCategoryProductOpen(false);
        setIsModalUpdateProductOpen(false);
        setIsModalDeleteProductOpen(false);
        // setIsModalUpdateAccountOpen(false)
    };

    const handleSelectProduct = (id) => {
        setSelectedProduct((prevSelected) => {
            // Check if the ID is already in the selectedProduct array
            if (prevSelected.includes(id)) {
                // If it exists, remove it
                return prevSelected.filter((productId) => productId !== id);
            } else {
                // If it doesn't exist, add it
                return [...prevSelected, id];
            }
        });
    };

    // const handleDeleteSelectedAccounts = async () => {
    //     try {
    //         const response = await axios.delete(
    //             `api/delete-selected-account`,
    //             { data: { ids: selectedAccount } },
    //         )
    //         setNotification(response.data.message)
    //         fetchAccount()
    //         setSelectedAccount([])
    //     } catch (error) {
    //         setErrors(error.response?.data?.errors || ['Something went wrong.'])
    //     }
    // }

    useEffect(() => {
        fetchProducts("/api/products");
    }, []);

    // useEffect(() => {
    //     // console.log(selectedUpdateAccount)

    //     handleShowAccount()
    // }, [])
    const handleChangePage = (url) => {
        fetchProducts(url);
    };

    return (
        <>
            <Header title="Product" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl">
                        {notification && <Notification notification={notification} onClose={() => setNotification("")} />}
                        <div className="bg-white border-b border-gray-200">
                            {errors.length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex justify-between">
                                {/* {selectedAccount.length > 0 && (
                                    <button
                                        className="btn-primary"
                                        onClick={handleDeleteSelectedAccounts}>
                                        Hapus terpilih {selectedAccount.length}
                                    </button>
                                )} */}
                                <div className="flex justify-end gap-2 p-4">
                                    <button className="btn-primary text-sm" onClick={() => setIsModalCreateProductOpen(true)}>
                                        Tambah Produk <PlusCircleIcon className="w-5 h-5 inline" />
                                    </button>
                                    <button className="btn-primary text-sm" onClick={() => setIsModalCreateCategoryProductOpen(true)}>
                                        Tambah Kategori <PlusCircleIcon className="w-5 h-5 inline" />
                                    </button>
                                </div>
                                <Modal isOpen={isModalCreateProductOpen} onClose={closeModal} modalTitle="Create account">
                                    <CreateProduct
                                        isModalOpen={setIsModalCreateProductOpen}
                                        notification={(message) => setNotification(message)}
                                        fetchProducts={fetchProducts}
                                        productCategories={productCategories}
                                    />
                                </Modal>
                                <Modal isOpen={isModalCreateCategoryProductOpen} onClose={closeModal} modalTitle="Create account">
                                    <CreateCategoryProduct
                                        isModalOpen={setIsModalCreateCategoryProductOpen}
                                        notification={(message) => setNotification(message)}
                                        fetchProducts={fetchProducts}
                                    />
                                </Modal>
                            </div>
                            <div className="px-4 mb-2 flex">
                                <Input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari barang..."
                                    className="w-full text-sm rounded-l-lg rounded-r-none border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <button
                                    onClick={() => {
                                        fetchProducts();
                                    }}
                                    className="bg-slate-500 text-sm text-white min-w-20 sm:min-w-32 p-2 rounded-r-lg border border-gray-500 hover:border-gray-400 w-fit"
                                >
                                    <SearchIcon size={24} className="inline" /> <span className="hidden sm:inline">Search</span>
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table w-full text-xs">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th>Product</th>
                                            <th>Price (Jual)</th>
                                            <th>Cost (Beli)</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product?.data?.length === 0 ? (
                                            <tr>
                                                <td colSpan="6">No products found</td>
                                            </tr>
                                        ) : (
                                            product?.data?.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="text-center">
                                                        <Input
                                                            checked={selectedProduct.includes(product.id)}
                                                            onChange={() => {
                                                                handleSelectProduct(product.id);
                                                            }}
                                                            type="checkbox"
                                                        />
                                                    </td>
                                                    <td>
                                                        {product.name}
                                                        <span className="block text-xs text-slate-400">
                                                            {product.category} {formatNumber(product.sold)} terjual
                                                        </span>
                                                    </td>
                                                    <td>{formatNumber(product.price)}</td>
                                                    <td>{formatNumber(product.cost)}</td>
                                                    <td className="">
                                                        <span className="flex justify-center">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProductId(product.id);
                                                                    setIsModalUpdateProductOpen(true);
                                                                }}
                                                                className="bg-indigo-500 py-2 px-4 rounded-lg text-white mr-2"
                                                            >
                                                                <PencilIcon className="size-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProductId(product.id);
                                                                    setIsModalDeleteProductOpen(true);
                                                                }}
                                                                className="bg-red-600 py-2 px-4 rounded-lg text-white"
                                                            >
                                                                <TrashIcon className="size-4" />
                                                            </button>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4">{product?.last_page > 1 && <Paginator links={product} handleChangePage={handleChangePage} />}</div>
                        </div>
                        <Modal isOpen={isModalUpdateProductOpen} onClose={closeModal} modalTitle="Edit Product" maxWidth="max-w-md">
                            <EditProduct
                                isModalOpen={setIsModalUpdateProductOpen}
                                notification={(message) => setNotification(message)}
                                fetchProducts={fetchProducts}
                                selectedProductId={selectedProductId}
                                products={product}
                                productCategories={productCategories}
                            />
                        </Modal>
                        <Modal isOpen={isModalDeleteProductOpen} onClose={closeModal} modalTitle="Confirm Delete" maxWidth="max-w-md">
                            <div className="flex flex-col items-center justify-center gap-3 mb-4">
                                <MessageCircleWarningIcon size={72} className="text-red-600" />
                                <p className="text-sm">Apakah anda yakin ingin menghapus transaksi ini (ID: {selectedProductId})?</p>
                            </div>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => {
                                        handleDeleteProduct(selectedProductId);
                                        setIsModalDeleteProductOpen(false);
                                    }}
                                    className="btn-primary w-full"
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() => setIsModalDeleteProductOpen(false)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Tidak
                                </button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}
