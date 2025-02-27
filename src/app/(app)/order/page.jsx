"use client";
import { useAuth } from "@/libs/auth";
import Loading from "../loading";
import Header from "../Header";
import { FilterIcon, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Label from "@/components/Label";
import Input from "@/components/Input";
import OrderCard from "./components/OrderCard";
import CreateOrderForm from "./components/CreateOrderForm";
import axios from "@/libs/axios";
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const OrderPage = () => {
    const { user } = useAuth({ middleware: "auth" });
    if (!user) {
        return <Loading />;
    }

    const userRole = user.role?.role;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [selectedWarehouse, setSelectedWarehouse] = useState(1);
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);
    const [isModalCreateOrderOpen, setIsModalCreateOrderOpen] = useState(false);
    const closeModal = () => {
        setIsModalFilterDataOpen(false);
        setIsModalCreateOrderOpen(false);
    };

    const fetchOrder = async (url = `/api/orders`) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setOrders(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);
    // console.log(orders);
    return (
        <>
            <Header title="Service Order" />
            <div className="py-8 relative">
                <div className="max-w-7xl mx-auto sm:px-6">
                    <div className="flex justify-between mb-4">
                        <div className="">
                            <button onClick={() => setIsModalCreateOrderOpen(true)} className="btn-primary text-sm">
                                New Order <PlusCircleIcon size={20} className="inline" />
                            </button>
                            <Modal isOpen={isModalCreateOrderOpen} onClose={closeModal} modalTitle="New Order" maxWidth="max-w-2xl">
                                <CreateOrderForm isModalOpen={isModalCreateOrderOpen} notification={closeModal} fetchOrder={fetchOrder} />
                            </Modal>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Input type="search" placeholder="Cari no invoice" />
                            {userRole === "Administrator" && (
                                <select
                                    value={selectedWarehouse}
                                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                >
                                    <option value="all">Semua Cabang</option>
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
                                <button className="btn-primary">Submit</button>
                            </Modal>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {orders.data?.map((order) => (
                            <OrderCard order={order} loading={loading} key={order.id} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
