import Input from "@/components/Input";
import axios from "@/libs/axios";
import { useState, useEffect } from "react";

const FormCreateAccount = ({ isModalOpen, notification, fetchAccount }) => {
    const [errors, setErrors] = useState([]); // Store validation errors
    const [categoryAccount, setCategoryAccount] = useState(null); // Set initial state to null
    const [newAccount, setNewAccount] = useState({
        name: "",
        category_id: "",
        st_balance: 0,
    });

    const fetchCategoryAccount = async () => {
        try {
            const response = await axios.get("api/category-accounts");
            setCategoryAccount(response.data.data);
        } catch (error) {
            setErrors(error.response?.message || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchCategoryAccount();
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/accounts", newAccount);
            notification(response.data.message);
            if (response.status === 201) {
                // Reset form fields and close modal on success
                setNewAccount({
                    name: "",
                    category_id: "",
                    st_balance: 0,
                });
                isModalOpen(false);
                // console.log('Form reset:', newAccount, response.status)
                fetchAccount();
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };
    return (
        <>
            <form>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        Account Name
                    </label>
                    <Input
                        type="text"
                        id="name"
                        value={newAccount.name}
                        onChange={(e) =>
                            setNewAccount({
                                ...newAccount,
                                name: e.target.value,
                            })
                        }
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="Nama Akun"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
                        Category
                    </label>
                    <select
                        id="category"
                        value={newAccount.category_id}
                        onChange={(e) =>
                            setNewAccount({
                                ...newAccount,
                                category_id: e.target.value,
                            })
                        }
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors.category_id ? "border-red-500" : ""
                        }`}
                    >
                        <option value="">Select Category</option>
                        {categoryAccount?.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="st_balance" className="block mb-2 text-sm font-medium text-gray-900">
                        Starting Balance
                    </label>
                    <Input
                        type="number"
                        id="st_balance"
                        value={newAccount.st_balance}
                        onChange={(e) =>
                            setNewAccount({
                                ...newAccount,
                                st_balance: e.target.value,
                            })
                        }
                        className={`bg-gray-100 border`}
                        placeholder="0"
                    />
                    {errors.st_balance && <p className="text-red-500 text-xs">{errors.st_balance}</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => isModalOpen(false)}
                        className="text-white min-w-28 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-5 py-3 "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateAccount}
                        className="text-white min-w-28 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-3 "
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

export default FormCreateAccount;
