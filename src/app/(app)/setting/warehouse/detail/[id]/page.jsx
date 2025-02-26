"use client";
import Header from "@/app/(app)/Header";
import { useState, useEffect, use } from "react";
import axios from "@/libs/axios";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Notification from "@/components/notification";
import Pagination from "@/components/PaginateList";
import Link from "next/link";
import { KeyIcon, KeyRound, LockIcon } from "lucide-react";

const WarehouseDetail = ({ params }) => {
    const [notification, setNotification] = useState(null);
    const [errors, setErrors] = useState([]); // Store validation errors
    const [warehouse, setWarehouse] = useState({});
    const [loading, setLoading] = useState(true);
    const [cashBank, setCashBank] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        chart_of_account_id: "",
    });

    const { id } = use(params);

    const fetchWarehouse = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/warehouse/${id}`);
            setWarehouse(response.data.data);
            setFormData({
                name: response.data.data.name,
                address: response.data.data.address,
                chart_of_account_id: response.data.data.chart_of_account_id,
            });
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    const fetchCashBank = async () => {
        try {
            const response = await axios.get("/api/get-cash-and-bank");
            setCashBank(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchCashBank();
    }, []);

    useEffect(() => {
        const loadWarehouseData = async () => {
            await fetchWarehouse();
            setLoading(false);
        };
        loadWarehouseData();
    }, [id]);

    const availableCashBank = cashBank.filter((item) => item.warehouse_id === null);

    const handleAddCashBank = async (id) => {
        try {
            const response = await axios.put(`/api/warehouse/${warehouse.id}/add-cash-bank/${id}`);
            setNotification(response.data.message);
            fetchCashBank();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    // Calculate the total number of pages
    const totalItems = cashBank.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get the items for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = cashBank.slice(startIndex, startIndex + itemsPerPage);

    // Handle page change from the Pagination component
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleUpdateWarehouse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/warehouse/${warehouse.id}`, formData);
            setNotification(response.data.message);
            fetchWarehouse();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title={`Warehouse - ${warehouse?.name}`} />
            <div className="py-12">
                {notification && <Notification notification={notification} onClose={() => setNotification("")} />}
                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        <ul>
                            {errors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {loading ? (
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <div className="shadow-sm sm:rounded-lg p-6 bg-white mb-2">
                                <h1 className="text-xl font-bold mb-4">Update Warehouse</h1>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="mb-4">
                                            <Label>Warehouse Name:</Label>
                                            <Input
                                                className={"w-full"}
                                                type="text"
                                                value={formData.name || warehouse.name || ""}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <Label>Warehouse Address:</Label>
                                            <textarea
                                                className="w-full rounded-md border p-2 shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                value={formData.address || warehouse.address || ""}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <Label>Cash Account:</Label>
                                            <select
                                                className="w-full rounded-md border p-2 shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                value={formData.chart_of_account_id || warehouse.chart_of_account_id || ""}
                                                onChange={(e) => setFormData({ ...formData, chart_of_account_id: e.target.value })}
                                            >
                                                <option value={warehouse.chart_of_account_id}>{warehouse.chart_of_account.acc_name}</option>
                                                {availableCashBank.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.acc_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <button onClick={handleUpdateWarehouse} className="bg-green-600 px-4 py-2 rounded-lg mr-2 text-white">
                                                Update
                                            </button>
                                            <Link href="/setting/warehouse" className="bg-slate-400 px-4 py-2 rounded-lg text-white">
                                                Kembali
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="shadow-sm sm:rounded-lg p-6 bg-white mb-2">
                                <h1 className="text-xl font-bold mb-4">Cash & Bank List</h1>
                                <div>
                                    <table className="table w-full sm:w-3/4 text-xs">
                                        <tbody>
                                            {currentItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        {item.acc_name}
                                                        <span className="text-xs text-blue-300 block">{item.warehouse?.name}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="text-xs flex justify-center items-center">
                                                            {warehouse.chart_of_account_id == item.id ? (
                                                                <button>
                                                                    <KeyRound className="size-6 text-red-600" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleAddCashBank(item.id)}
                                                                    disabled={item.warehouse_id !== warehouse.id && item.warehouse_id !== null ? true : false}
                                                                    className="disabled:cursor-not-allowed"
                                                                >
                                                                    {item.warehouse_id !== warehouse.id && item.warehouse_id !== null ? (
                                                                        <LockIcon className="size-5 text-slate-600" />
                                                                    ) : (
                                                                        <div
                                                                            className={`p-1 w-12 rounded-full flex ${
                                                                                item.warehouse_id ? "justify-end bg-blue-500" : "justify-start bg-slate-400"
                                                                            }`}
                                                                        >
                                                                            <div className="bg-white w-4 h-4 rounded-full"></div>
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {totalPages > 1 && (
                                        <Pagination
                                            className={"w-full sm:w-3/4"}
                                            totalItems={totalItems}
                                            itemsPerPage={itemsPerPage}
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WarehouseDetail;
