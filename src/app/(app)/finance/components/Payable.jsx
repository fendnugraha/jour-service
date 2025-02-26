"use client";
import { ArrowBigDown, ArrowBigUp, MessageCircleWarningIcon, PlusCircleIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/libs/axios";
import Modal from "@/components/Modal";
import CreateContact from "../../setting/contact/CreateContact";
import Notification from "@/components/notification";
import CreatePayable from "./CreatePayable";
import formatNumber from "@/libs/formatNumber";
import formatDateTime from "@/libs/formatDateTime";
import PaymentForm from "./PaymentForm";
import Paginator from "@/components/Paginator";
const Payable = ({ notification }) => {
    const [isModalCreateContactOpen, setIsModalCreateContactOpen] = useState(false);
    const [isModalCreatePayableOpen, setIsModalCreatePayableOpen] = useState(false);
    const [isModalDeleteFinanceOpen, setIsModalDeleteFinanceOpen] = useState(false);
    const [isModalPaymentOpen, setIsModalPaymentOpen] = useState(false);
    const [finance, setFinance] = useState([]);
    const [financeType, setFinanceType] = useState("Payable");
    const [selectedFinanceId, setSelectedFinanceId] = useState(null);
    const [selectedContactId, setSelectedContactId] = useState("All");
    const [selectedContactIdPayment, setSelectedContactIdPayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const fetchFinance = async (url = `/api/finance-by-type/${selectedContactId}/${financeType}`) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setFinance(response.data.data);
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinance();
    }, [selectedContactId, financeType]);
    const closeModal = () => {
        setIsModalCreateContactOpen(false);
        setIsModalCreatePayableOpen(false);
        setIsModalDeleteFinanceOpen(false);
        setIsModalPaymentOpen(false);
    };

    const filterFinanceByContactIdAndType = finance.financeGroupByContactId?.filter((fnc) => fnc.finance_type === financeType) || [];

    const handleDeleteFinance = async (id) => {
        try {
            const response = await axios.delete(`/api/finance/${id}`);
            notification(response.data.message);
            fetchFinance();
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
        }
    };
    const handleChangePage = (url) => {
        fetchFinance(url);
    };
    return (
        <>
            <div className="bg-slate-400 rounded-2xl mb-4 p-1">
                <div className="flex">
                    <button
                        onClick={() => setFinanceType("Payable")}
                        className={`px-4 ${financeType === "Payable" ? "bg-white text-slate-600 rounded-2xl" : "text-white text-sm"}`}
                    >
                        Hutang
                    </button>
                    <button
                        onClick={() => setFinanceType("Receivable")}
                        className={`px-4 ${financeType === "Receivable" ? "bg-white text-slate-600 rounded-2xl" : "text-white text-sm"}`}
                    >
                        Piutang
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <div className="bg-white shadow-sm sm:rounded-2xl mb-4">
                    <div className="p-4 flex justify-between flex-col sm:flex-row">
                        <h1 className="text-2xl font-bold mb-4">{financeType === "Payable" ? "Hutang" : "Piutang"}</h1>
                        <div>
                            <button onClick={() => setIsModalCreatePayableOpen(true)} className="btn-primary text-xs mr-2">
                                <PlusCircleIcon className="w-4 h-4 mr-2 inline" /> Hutang
                            </button>
                            <button className="btn-primary text-xs mr-2 disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={true}>
                                <PlusCircleIcon className="w-4 h-4 mr-2 inline" /> Piutang
                            </button>
                            <Modal isOpen={isModalCreatePayableOpen} onClose={closeModal} modalTitle="Create Payable">
                                <CreatePayable
                                    isModalOpen={setIsModalCreatePayableOpen}
                                    notification={(message) => notification(message)}
                                    fetchFinance={fetchFinance}
                                />
                            </Modal>
                            <button onClick={() => setIsModalCreateContactOpen(true)} className="btn-primary text-xs">
                                <PlusCircleIcon className="w-4 h-4 mr-2 inline" /> Contact
                            </button>
                            <Modal isOpen={isModalCreateContactOpen} onClose={closeModal} modalTitle="Create Contact">
                                <CreateContact isModalOpen={setIsModalCreateContactOpen} notification={(message) => notification(message)} />
                            </Modal>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full text-xs">
                            <thead>
                                <tr>
                                    <th>Contact</th>
                                    <th>Tagihan</th>
                                    <th>Dibayar</th>
                                    <th>Sisa</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterFinanceByContactIdAndType.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-700 hover:text-white">
                                        <td>
                                            <button onClick={() => setSelectedContactId(item.contact_id)} className="hover:underline">
                                                {item.contact.name}
                                            </button>
                                        </td>
                                        <td className="text-end">{formatNumber(item.tagihan)}</td>
                                        <td className="text-end">{formatNumber(item.terbayar)}</td>
                                        <td className="text-end">{formatNumber(item.sisa)}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => {
                                                    setIsModalPaymentOpen(true);
                                                    setSelectedContactIdPayment(item.contact_id);
                                                }}
                                                type="button"
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl disabled:bg-slate-400 disabled:cursor-not-allowed"
                                                disabled={Number(item.sisa) === 0}
                                            >
                                                {Number(item.sisa) === 0 ? "Lunas" : "Bayar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="text-lg">
                                    <td colSpan={3} className="font-bold">
                                        Total {financeType === "Payable" ? "Hutang" : "Piutang"}
                                    </td>
                                    <td className="font-bold text-end">
                                        {formatNumber(filterFinanceByContactIdAndType.reduce((total, item) => total + Number(item.sisa), 0))}
                                    </td>
                                    <td className="font-bold text-end"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="bg-white shadow-sm sm:rounded-2xl">
                    <div className="p-4 flex justify-between">
                        <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full text-xs">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Payment Method</th>
                                    <th>Description</th>
                                    <th>Contact</th>
                                    <th>Date Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finance.finance?.data.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-700 hover:text-white">
                                        <td>
                                            {item.bill_amount > 0 ? (
                                                <ArrowBigDown className="inline text-green-600" />
                                            ) : (
                                                <ArrowBigUp className="inline text-red-600" />
                                            )}
                                        </td>
                                        <td className={`text-end font-bold ${item.bill_amount > 0 ? "text-green-600" : "text-red-600"}`}>
                                            {formatNumber(item.bill_amount > 0 ? item.bill_amount : item.payment_amount)}
                                        </td>
                                        <td className="">{item.account.acc_name}</td>
                                        <td className="">
                                            <span className="font-bold text-xs text-slate-400 block">{item.invoice}</span>
                                            Note: {item.description}
                                        </td>
                                        <td className="">{item.contact.name}</td>
                                        <td className="text-end">{formatDateTime(item.created_at)}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedFinanceId(item.id);
                                                    setIsModalDeleteFinanceOpen(true);
                                                }}
                                                type="button"
                                                className=""
                                            >
                                                <XCircleIcon className="w-4 h-4 mr-2 inline text-red-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-4 sm:py-0">
                        {finance.finance?.last_page > 1 && <Paginator links={finance.finance} handleChangePage={handleChangePage} />}
                    </div>
                </div>
                <Modal isOpen={isModalDeleteFinanceOpen} onClose={closeModal} modalTitle="Confirm Delete" maxWidth="max-w-md">
                    <div className="flex flex-col items-center justify-center gap-3 mb-4">
                        <MessageCircleWarningIcon size={72} className="text-red-600" />
                        <p className="text-sm">Apakah anda yakin ingin menghapus transaksi ini (ID: {selectedFinanceId})?</p>
                    </div>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => {
                                handleDeleteFinance(selectedFinanceId);
                                setIsModalDeleteFinanceOpen(false);
                            }}
                            className="btn-primary w-full"
                        >
                            Ya
                        </button>
                        <button
                            onClick={() => setIsModalDeleteFinanceOpen(false)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Tidak
                        </button>
                    </div>
                </Modal>
                <Modal isOpen={isModalPaymentOpen} onClose={closeModal} modalTitle="Form Pembayaran" maxWidth="max-w-xl">
                    <PaymentForm
                        contactId={selectedContactIdPayment}
                        notification={(message) => notification(message)}
                        isModalOpen={setIsModalPaymentOpen}
                        fetchFinance={fetchFinance}
                        onClose={closeModal}
                    />
                </Modal>
            </div>
        </>
    );
};

export default Payable;
