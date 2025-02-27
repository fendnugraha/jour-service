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
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-300">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-sm font-bold py-1">Nama Konsumen</td>
                                        <td className="text-sm text-right">{order?.contact?.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm font-bold py-1">No. Handphone</td>
                                        <td className="text-sm text-right">{order?.contact?.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm font-bold py-1">Alamat</td>
                                        <td className="text-sm text-right"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="text-sm">
                                            {order?.contact?.address}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-300">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-sm font-bold py-1">Type HP</td>
                                        <td className="text-sm text-right">{order?.phone_type}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm font-bold py-1">Deskripsi Kerusakan</td>
                                        <td className="text-sm text-right"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="text-sm bg-slate-300 px-4 py-2">
                                            {order?.description}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
