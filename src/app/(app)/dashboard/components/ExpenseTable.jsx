"use client";
import { useEffect, useState } from "react";
import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";
import formatDateTime from "@/libs/formatDateTime";
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

const ExpenseTable = ({ warehouse, warehouses, userRole }) => {
    const [expenses, setExpenses] = useState([]);
    const [notification, setNotification] = useState("");
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse);
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);

    const closeModal = () => {
        setIsModalFilterDataOpen(false);
    };
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/get-expenses/${selectedWarehouse}/${startDate}/${endDate}`);
            setExpenses(response.data.data);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [selectedWarehouse]);

    const totalExpense = expenses.reduce((total, expense) => {
        return total + Number(expense.fee_amount);
    }, 0);
    return (
        <div className="my-4 flex gap-4 sm:flex-row flex-col">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl wfull sm:w-3/4">
                <h1 className="px-2 sm:px-6 pt-4 font-bold text-xl text-red-600">
                    Pengeluaran (Biaya Operasional)
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
                                fetchExpenses();
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
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Tidak ada pengeluaran
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>
                                            <span className="text-xs text-slate-500">{formatDateTime(expense.created_at)}</span>
                                            <br />
                                            {expense.description}
                                        </td>
                                        <td>{expense.debt.acc_name}</td>
                                        <td className="text-right">{formatNumber(-expense.fee_amount)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-red-500 text-white py-2 overflow-hidden shadow-sm sm:rounded-2xl flex-1 flex flex-col justify-center items-center">
                <h1>Expense Total</h1>
                <h1 className="text-4xl font-bold">{formatNumber(totalExpense < 0 ? totalExpense * -1 : 0)}</h1>
            </div>
        </div>
    );
};

export default ExpenseTable;
