"use client";
import { use, useEffect, useState } from "react";
import Header from "../../Header";
import axios from "@/libs/axios";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const OrderDetail = ({ params }) => {
    const { id } = use(params);

    const [order, setOrder] = useState({});
    const fetchOrderById = async (id) => {
        try {
            const response = await axios.get(`/api/orders/${id}`);
            setOrder(response.data.order);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchOrderById(id);
    }, [id]);
    return (
        <>
            <Header title="Order Detail" />
            <div className="py-8 relative">
                <div className="max-w-7xl mx-auto sm:px-6">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold mb-4">{order?.order_number}</h1>
                        <Link href="/order" className="text-sm font-semibold hover:underline">
                            <ArrowLeftIcon className="w-4 h-4 inline mr-2" /> Kembali
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="">
                            <div className="bg-white rounded-2xl px-4 py-2 mb-2 shadow-sm border border-slate-300">
                                <h1 className="text-sm text-slate-500">Total Price</h1>
                                <h1 className="text-2xl font-bold">Rp. 5.000.000</h1>
                            </div>
                            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-slate-300">
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Nama Konsumen</h1>
                                    <h1 className="text-sm font-bold">{order?.contact?.name}</h1>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">No. Telepon</h1>
                                    <h1 className="text-sm">{order?.contact?.phone_number}</h1>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Alamat</h1>
                                    <h1 className="text-sm">{order?.contact?.address}</h1>
                                </div>
                                <div className="mb-1 mt-2">
                                    <h1 className="text-sm text-slate-500">Device Type</h1>
                                    <h1 className="text-sm font-bold">{order?.phone_type}</h1>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Deskripsi Kerusakan</h1>
                                    <h1 className="text-sm p-2 bg-slate-300 rounded-xl">{order?.description}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
