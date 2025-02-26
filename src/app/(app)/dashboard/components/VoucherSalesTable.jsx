"use client";
import { useEffect, useState } from "react";
import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";
import { FilterIcon } from "lucide-react";
import Modal from "@/components/Modal";
import Label from "@/components/Label";
import Input from "@/components/Input";

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const VoucherSalesTable = ({ warehouse, warehouses, userRole }) => {
    const [transactions, setTransactions] = useState([]);
    const [notification, setNotification] = useState("");
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse);
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);

    const closeModal = () => {
        setIsModalFilterDataOpen(false);
    };
    const fetchTransaction = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/get-trx-vcr/${selectedWarehouse}/${startDate}/${endDate}`);
            setTransactions(response.data.data);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [selectedWarehouse]);

    const filterTrxVoucher = transactions.filter((transaction) => transaction.product.category === "Voucher & SP");
    const filterTrxNonVoucher = transactions.filter((transaction) => transaction.product.category !== "Voucher & SP");

    const totalCostVoucher = filterTrxVoucher?.reduce((total, transaction) => {
        return total + Number(transaction.total_cost);
    }, 0);

    const totalCostNonVoucher = filterTrxNonVoucher?.reduce((total, transaction) => {
        return total + Number(transaction.total_cost);
    }, 0);
    return (
        <>
            <div className="my-4 flex gap-4 sm:flex-row flex-col">
                <div className="bg-white overflow-hidden w-full shadow-sm sm:rounded-2xl sm:w-3/4">
                    <h1 className="px-2 sm:px-6 pt-4 font-bold text-xl text-blue-600">
                        Total Penjualan Voucher & SP
                        <span className="text-xs block font-normal">
                            Periode: {startDate} - {endDate}
                        </span>
                    </h1>

                    <div className="px-2 sm:px-6 pt-4 flex justify-end gap-2">
                        {userRole === "Administrator" && (
                            <select
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="all">Semua Cabang</option>
                                {warehouses?.data?.map((warehouse) => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={() => setIsModalFilterDataOpen(true)}
                            className="bg-white font-bold p-3 rounded-lg border border-gray-300 hover:border-gray-400"
                        >
                            <FilterIcon className="size-4" />
                        </button>
                        <Modal isOpen={isModalFilterDataOpen} onClose={closeModal} modalTitle="Filter Tanggal" maxWidth="max-w-md">
                            <div className="mb-4">
                                <Label className="font-bold">Tanggal</Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="font-bold">s/d</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    fetchTransaction();
                                    setIsModalFilterDataOpen(false);
                                }}
                                className="btn-primary"
                            >
                                Submit
                            </button>
                        </Modal>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full text-xs">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Jual</th>
                                    <th>Modal</th>
                                    <th>Laba</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    filterTrxVoucher?.map((transaction) => (
                                        <tr key={transaction.product_id}>
                                            <td>{transaction.product.name}</td>
                                            <td className="text-center">{formatNumber(-transaction.quantity)}</td>
                                            <td className="text-end">{formatNumber(-transaction.total_price)}</td>
                                            <td className="text-end">{formatNumber(-transaction.total_cost)}</td>
                                            <td className="text-end">{formatNumber(-Number(transaction.total_price - transaction.total_cost))}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-sky-700 py-2 text-white overflow-hidden shadow-sm sm:rounded-2xl flex-1 flex flex-col justify-center items-center">
                    <h1>Total</h1>
                    <h1 className="text-4xl font-bold">{formatNumber(totalCostVoucher < 0 ? totalCostVoucher * -1 : 0)}</h1>
                </div>
            </div>
            {filterTrxNonVoucher.length > 0 && (
                <div className="my-4 flex gap-4 sm:flex-row flex-col">
                    <div className="bg-white overflow-hidden w-full shadow-sm sm:rounded-2xl sm:w-3/4">
                        <h1 className="px-2 sm:px-6 pt-4 font-bold text-xl text-green-600">
                            Total Penjualan Accesories
                            <span className="text-xs block font-normal">
                                Periode: {startDate} - {endDate}
                            </span>
                        </h1>
                        <div className="overflow-x-auto">
                            <table className="table w-full text-xs">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Jual</th>
                                        <th>Modal</th>
                                        <th>Laba</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Tidak ada data
                                            </td>
                                        </tr>
                                    ) : (
                                        filterTrxNonVoucher?.map((transaction) => (
                                            <tr key={transaction.product_id}>
                                                <td>{transaction.product.name}</td>
                                                <td className="text-center">{formatNumber(-transaction.quantity)}</td>
                                                <td className="text-end">{formatNumber(-transaction.total_price)}</td>
                                                <td className="text-end">{formatNumber(-transaction.total_cost)}</td>
                                                <td className="text-end">{formatNumber(-Number(transaction.total_price - transaction.total_cost))}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-green-700 py-2 text-white overflow-hidden shadow-sm sm:rounded-2xl flex-1 flex flex-col justify-center items-center">
                        <h1>Total</h1>
                        <h1 className="text-4xl font-bold">{formatNumber(totalCostNonVoucher < 0 ? totalCostNonVoucher * -1 : 0)}</h1>
                    </div>
                </div>
            )}
        </>
    );
};

export default VoucherSalesTable;
