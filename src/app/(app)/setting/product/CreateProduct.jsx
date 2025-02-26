"use client";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "@/libs/axios";

const CreateProduct = ({ isModalOpen, notification, fetchProducts, productCategories }) => {
    const [errors, setErrors] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: 0,
        cost: 0,
    });

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/products", newProduct);
            notification(response.data.message);
            if (response.status === 201) {
                // Reset form fields and close modal on success
                setNewProduct({
                    name: "",
                    category: "",
                    price: 0,
                    cost: 0,
                });
            }
            isModalOpen(false);
            // console.log('Form reset:', newAccount, response.status)
            fetchProducts();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    return (
        <form>
            <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                    Product Name
                </label>
                <Input
                    type="text"
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                        setNewProduct({
                            ...newProduct,
                            name: e.target.value,
                        })
                    }
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
                    Category
                </label>
                <select
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        errors.category ? "border-red-500" : ""
                    }`}
                    value={newProduct.category}
                    onChange={(e) =>
                        setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                        })
                    }
                >
                    <option value="">Select category</option>
                    {productCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
            </div>
            <div className="flex gap-4 mb-4">
                <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">
                        Price
                    </label>
                    <Input
                        type="number"
                        id="price"
                        value={newProduct.price}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                price: e.target.value,
                            })
                        }
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.price ? "border-red-500" : ""
                        }`}
                        placeholder="Enter product price"
                    />
                    {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                </div>
                <div>
                    <label htmlFor="cost" className="block mb-2 text-sm font-medium text-gray-900">
                        Cost
                    </label>
                    <Input
                        type="number"
                        id="cost"
                        value={newProduct.cost}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                cost: e.target.value,
                            })
                        }
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.cost ? "border-red-500" : ""
                        }`}
                        placeholder="Enter product cost"
                    />
                    {errors.cost && <p className="text-red-500 text-xs">{errors.cost}</p>}
                </div>
            </div>
            <div>
                <button
                    onClick={handleCreateProduct}
                    className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    Create
                </button>
            </div>
        </form>
    );
};

export default CreateProduct;
