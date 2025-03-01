"use client";
import { use, useEffect, useState } from "react";
import Header from "../../Header";
import axios from "@/libs/axios";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon, MinusCircleIcon, PlusCircleIcon, SmartphoneIcon, XCircleIcon } from "lucide-react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";

const OrderDetail = ({ params }) => {
    const { id } = use(params);
    const [errors, setErrors] = useState([]);
    const [isModalAddPartOpen, setIsModalAddPartOpen] = useState(false);
    const closeModal = () => setIsModalAddPartOpen(false);

    const formatPhoneNumber = (phone) => {
        if (!phone) return ""; // Handle jika input null/undefined
        return phone
            .toString() // Pastikan input berupa string
            .replace(/\D/g, "") // Hapus semua karakter non-digit
            .replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3"); // Format 4-4-sisa digit
    };

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
                            <div className="bg-slate-600 p-2 flex gap-2 rounded-2xl items-center mb-2">
                                <div className="bg-white p-2 rounded-xl">
                                    <SmartphoneIcon size={24} className="" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold text-white">{order?.phone_type}</h1>
                                    <h1 className="text-xs text-white">{formatPhoneNumber(order?.contact?.phone_number)}</h1>
                                </div>
                            </div>
                            <div className="mb-2 grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setIsModalAddPartOpen(true)}
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm p-2"
                                >
                                    <PlusCircleIcon size={16} className="inline" /> Add Parts
                                </button>
                                <Modal isOpen={isModalAddPartOpen} onClose={closeModal} modalTitle="Add Parts Replacement" maxWidth="max-w-md">
                                    <Input type="search" className={"w-full rounded-2xl"} placeholder="Cari barang / parts" />
                                    <div className="px-4 py-2 border-b border-slate-200 border-dashed">
                                        <div className="flex justify-between itemts-center mb-2">
                                            <h1 className="text-sm text-slate-700 text-nowrap overflow-hidden">LCD Iphone 13 Premium</h1>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex gap-4 items-center">
                                                <button>
                                                    <MinusCircleIcon size={16} />
                                                </button>
                                                <h1 className="text-sm ">1</h1>
                                                <button>
                                                    <PlusCircleIcon size={16} />
                                                </button>
                                            </div>
                                            <input type="number" className="w-1/2 border border-slate-300 rounded-md p-1 text-xs text-end" />
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <button className="bg-blue-500 hover:bg-blue-400 text-white rounded-md text-xs p-2 mt-2">
                                                Tambah ke Cart <PlusCircleIcon size={16} className="inline" />
                                            </button>
                                            <h1 className="text-xs text-slate-500 mt-2">Subtotal: Rp. 1.000.000</h1>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 border-b border-slate-200 border-dashed">
                                        <div className="flex justify-between itemts-center mb-2">
                                            <h1 className="text-sm text-slate-700 text-nowrap overflow-hidden">LCD Iphone 13 Premium</h1>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex gap-4 items-center">
                                                <button>
                                                    <MinusCircleIcon size={16} />
                                                </button>
                                                <h1 className="text-sm ">1</h1>
                                                <button>
                                                    <PlusCircleIcon size={16} />
                                                </button>
                                            </div>
                                            <input type="number" className="w-1/2 border border-slate-300 rounded-md p-1 text-xs text-end" />
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <button className="bg-blue-500 hover:bg-blue-400 text-white rounded-md text-xs p-2 mt-2">
                                                Tambah ke Cart <PlusCircleIcon size={16} className="inline" />
                                            </button>
                                            <h1 className="text-xs text-slate-500 mt-2">Subtotal: Rp. 1.000.000</h1>
                                        </div>
                                    </div>
                                </Modal>
                                <button className="bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm p-2">
                                    <PlusCircleIcon size={16} className="inline" /> Biaya Lainnya
                                </button>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-2xl">
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Nama Konsumen</h1>
                                    <h1 className="text-sm font-bold">{order?.contact?.name}</h1>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Alamat</h1>
                                    <h1 className="text-sm">{order?.contact?.address}</h1>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Deskripsi Kerusakan</h1>
                                    <h1 className="text-xs p-2 bg-slate-300 rounded-xl">{order?.description}</h1>
                                </div>
                            </div>
                        </div>
                        {/* Part Replacement Table */}
                        <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-sm col-span-2">
                            <h1 className="text-left text-sm font-semibold text-slate-500 px-4 pt-2 mb-2">Part Replacement</h1>
                            <div className="px-4 py-2 border-b border-slate-200 border-dashed">
                                <div className="flex justify-between itemts-center mb-2">
                                    <h1 className="text-sm text-slate-700 text-nowrap overflow-hidden">LCD Iphone 13 Premium</h1>
                                    <div className="">
                                        <button className="mr-1">
                                            <EditIcon size={16} className="text-green-500" />
                                        </button>
                                        <button>
                                            <XCircleIcon size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex gap-4 items-center">
                                        <button>
                                            <MinusCircleIcon size={16} />
                                        </button>
                                        <h1 className="text-sm ">1</h1>
                                        <button>
                                            <PlusCircleIcon size={16} />
                                        </button>
                                    </div>
                                    <h1 className="text-sm font-bold">Rp. 1.000.000</h1>
                                </div>
                                <h1 className="text-xs text-right text-slate-500 mt-2">Subtotal: Rp. 1.000.000</h1>
                            </div>
                            <div className="px-4 py-2 border-b border-slate-200 border-dashed">
                                <div className="flex justify-between itemts-center mb-2">
                                    <h1 className="text-sm text-slate-700 text-nowrap overflow-hidden">LCD Iphone 13 Premium</h1>
                                    <div className="">
                                        <button className="mr-1">
                                            <EditIcon size={16} className="text-green-500" />
                                        </button>
                                        <button>
                                            <XCircleIcon size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex gap-4 items-center">
                                        <button>
                                            <MinusCircleIcon size={16} />
                                        </button>
                                        <h1 className="text-sm ">1</h1>
                                        <button>
                                            <PlusCircleIcon size={16} />
                                        </button>
                                    </div>
                                    <h1 className="text-sm font-bold">Rp. 1.000.000</h1>
                                </div>
                                <h1 className="text-xs text-right text-slate-500 mt-2">Subtotal: Rp. 1.000.000</h1>
                            </div>
                            <div className="px-4 py-2 border-b border-slate-200 border-dashed">
                                <div className="flex justify-between itemts-center mb-2">
                                    <h1 className="text-sm text-slate-700 text-nowrap overflow-hidden">LCD Iphone 13 Premium</h1>
                                    <div className="">
                                        <button className="mr-1">
                                            <EditIcon size={16} className="text-green-500" />
                                        </button>
                                        <button>
                                            <XCircleIcon size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex gap-4 items-center">
                                        <button>
                                            <MinusCircleIcon size={16} />
                                        </button>
                                        <h1 className="text-sm ">1</h1>
                                        <button>
                                            <PlusCircleIcon size={16} />
                                        </button>
                                    </div>
                                    <h1 className="text-sm font-bold">Rp. 1.000.000</h1>
                                </div>
                                <h1 className="text-xs text-right text-slate-500 mt-2">Subtotal: Rp. 1.000.000</h1>
                            </div>
                            <h1 className="text-xs text-right text-slate-500 px-4">3 items</h1>
                            <div className="text-right px-4 pb-2">
                                <h1 className="text-xs text-slate-500">
                                    Biaya Jasa Teknisi (Service fees): <span className="block text-sm font-bold">Rp. 1.000.000</span>
                                </h1>
                                <h1 className="text-xs text-slate-500">
                                    Biaya Pengiriman (Shipping): <span className="block text-sm font-bold">Rp. 1.000.000</span>
                                </h1>
                                <h1 className="text-xs text-blue-500">
                                    Total: <span className="block text-2xl font-bold">Rp. 5.000.000</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
