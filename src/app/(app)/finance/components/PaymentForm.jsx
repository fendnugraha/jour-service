"use client";

import { useEffect, useState } from "react";
import axios from "@/libs/axios";
import Label from "@/components/Label";
import formatNumber from "@/libs/formatNumber";

const PaymentForm = ({ contactId, notification, fetchFinance, isModalOpen }) => {
    const [formData, setFormData] = useState({
        contact_id: contactId,
        invoice: "",
        account_id: "",
        amount: "",
        notes: "",
    });
    const [financeData, setFinanceData] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState("");
    const [errors, setErrors] = useState([]);

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/get-finance-by-contact-id/${contactId}`);
            setFinanceData(response.data.data);
        } catch (error) {
            console.error("Error fetching finance data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, [contactId]);

    const fetchAccounts = async ({ account_ids }) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/get-account-by-account-id`, { params: { account_ids } });
            setAccounts(response.data.data);
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts({ account_ids: [1, 2] });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/store-payment", formData);
            notification(response.data.message);
            fetchFinance();
            fetchFinanceData();
            isModalOpen(false);
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
            setErrors(error.response?.data?.errors);
        } finally {
            setLoading(false);
        }
    };

    const contactName = financeData[0]?.contact.name;
    const filterDataByInvoice = financeData.filter((finance) => finance.invoice === selectedInvoice);
    return (
        <div>
            <h1 className="text-lg mb-4">Contact: {contactName}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label>Invoice No.</Label>
                    <select
                        onChange={(e) => {
                            setSelectedInvoice(e.target.value);
                            setFormData({ ...formData, invoice: e.target.value });
                        }}
                        value={selectedInvoice}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">Select Invoice</option>
                        {financeData.map((finance, index) => (
                            <option key={index} value={finance.invoice} hidden={finance.sisa <= 0}>
                                {finance.invoice}, Total Tagihan : {formatNumber(finance.sisa)}
                            </option>
                        ))}
                    </select>
                    <h1 className="text-sm">Tagihan: RP. {selectedInvoice && formatNumber(filterDataByInvoice[0]?.sisa)}</h1>
                </div>
                <div className="mb-4">
                    <Label>Rekening</Label>
                    <select
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        value={formData.account_id}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">Select account</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.acc_name}
                            </option>
                        ))}
                    </select>
                    {errors.account_id && <span className="text-red-500 text-sm">{errors.account_id}</span>}
                </div>
                <div className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Jumlah Bayar (Rp)</Label>
                            <input
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                value={formData.amount}
                                type="number"
                                className="w-full border rounded-lg p-2"
                            />
                            <h1 className="text-xs">Sisa Tagihan: {selectedInvoice && formatNumber(filterDataByInvoice[0]?.sisa - formData.amount)}</h1>
                        </div>
                        {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
                    </div>
                </div>
                <div className="mb-4">
                    <div>
                        <Label>Keterangan</Label>
                        <textarea
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            value={formData.notes}
                            rows="2"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    {errors.notes && <span className="text-red-500 text-sm">{errors.notes}</span>}
                </div>
                <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-8 py-3 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
                    disabled={loading || !formData.invoice || !formData.account_id || !formData.amount}
                >
                    {loading ? "Loading..." : "Simpan"}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
