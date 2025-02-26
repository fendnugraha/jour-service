import Input from "@/components/Input";
import Label from "@/components/Label";
import { useState } from "react";
import axios from "@/libs/axios";

const EditProduct = ({ isModalOpen, notification, fetchProducts, selectedProductId, products, productCategories }) => {
    const product = products.data.find((product) => product.id === selectedProductId);
    const [formData, setFormData] = useState(product);
    const [loading, setLoading] = useState(false);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`/api/products/${product.id}`, formData);
            notification(response.data.message);
            isModalOpen(false);
            fetchProducts();
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1 className="text-xl font-bold mb-4">#{product.id}</h1>
            <form onSubmit={handleUpdateProduct}>
                <div className="mb-4">
                    <Label htmlFor="name">Name:</Label>
                    <Input className={"w-full"} type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="mb-4">
                    <Label htmlFor="category">Category:</Label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        {productCategories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                        <Label htmlFor="price">Price (Harga Jual):</Label>
                        <Input
                            type="number"
                            className={"w-full"}
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className="">
                        <Label htmlFor="stock">Cost (Harga Beli):</Label>
                        <Input type="number" className={"w-full"} value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-8 py-3 text-white disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
