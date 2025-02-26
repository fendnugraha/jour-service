import { useState } from "react";
import axios from "@/libs/axios";
import Input from "@/components/Input";
import Button from "@/components/Button";

const CreateCategoryProduct = ({ isModalOpen, notification, fetchProducts }) => {
    const [errors, setErrors] = useState([]);
    const [newCategoryProduct, setNewCategoryProduct] = useState({
        name: "",
        prefix: "",
    });

    const handleCreateCategoryProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/product-categories", newCategoryProduct);
            notification(response.data.message);
            if (response.status === 201) {
                // Reset form fields and close modal on success
                setNewCategoryProduct({
                    name: "",
                    prefix: "",
                });
                isModalOpen(false);
            }

            fetchProducts();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    return (
        <form>
            <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                    Category Name
                </label>
                <Input
                    type="text"
                    id="name"
                    value={newCategoryProduct.name}
                    onChange={(e) =>
                        setNewCategoryProduct({
                            ...newCategoryProduct,
                            name: e.target.value,
                        })
                    }
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Enter category name"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="prefix" className="block mb-2 text-sm font-medium text-gray-900">
                    Prefix
                </label>
                <Input
                    type="text"
                    id="prefix"
                    value={newCategoryProduct.prefix}
                    onChange={(e) =>
                        setNewCategoryProduct({
                            ...newCategoryProduct,
                            prefix: e.target.value,
                        })
                    }
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 ${
                        errors.prefix ? "border-red-500" : ""
                    }`}
                    placeholder="Enter prefix"
                />
                {errors.prefix && <p className="text-red-500 text-xs">{errors.prefix}</p>}
            </div>
            <div>
                <Button
                    onClick={handleCreateCategoryProduct}
                    className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    Create
                </Button>
            </div>
        </form>
    );
};

export default CreateCategoryProduct;
