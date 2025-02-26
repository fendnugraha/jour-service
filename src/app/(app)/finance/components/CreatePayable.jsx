"use client";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { useEffect, useState } from "react";
import axios from "@/libs/axios";
import formatNumber from "@/libs/formatNumber";

const CreatePayable = ({ isModalOpen, fetchFinance, notification }) => {
    const [formData, setFormData] = useState({
        date_issued: "",
        contact_id: "",
        amount: "",
        description: "",
        debt_code: "",
        cred_code: "",
        type: "Payable",
    });
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [errors, setErrors] = useState([]);

    const fetchContacts = async (url = "/api/get-all-contacts") => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setContacts(response.data.data);
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

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
        fetchAccounts({ account_ids: [1, 2, 19, 20] });
    }, []);

    const filterCashAccounts = accounts.filter((account) => account.account_id === 1 || account.account_id === 2);

    const filterPayableAccounts = accounts.filter((account) => account.account_id === 19 || account.account_id === 20);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/finance", formData);
            notification(response.data.message);
            isModalOpen(false);
            fetchFinance();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            notification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
                    <Label htmlFor="date_issued">Tanggal</Label>
                    <div className="col-span-2">
                        <Input type="datetime-local" className="w-1/2 border rounded-lg p-2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
                    <Label htmlFor="debt_code">Rekening</Label>
                    <div className="col-span-2">
                        <select
                            value={formData.debt_code}
                            onChange={(e) => setFormData({ ...formData, debt_code: e.target.value })}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="">--Pilih Rekening--</option>
                            {filterCashAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.acc_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
                    <Label htmlFor="cred_code">Akun Hutang</Label>
                    <div className="col-span-2">
                        <select
                            value={formData.cred_code}
                            onChange={(e) => setFormData({ ...formData, cred_code: e.target.value })}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="">--Pilih Akun--</option>
                            {filterPayableAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.acc_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
                    <Label htmlFor="contact">Contact</Label>
                    <div className="col-span-2">
                        <select
                            value={formData.contact_id}
                            onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                            className={`w-full border rounded-lg p-2 ${errors.contact_id ? "border-red-500" : ""}`}
                        >
                            <option value="">--Pilih Contact--</option>
                            {contacts.map((contact) => (
                                <option key={contact.id} value={contact.id}>
                                    {contact.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 items-center">
                    <Label htmlFor="amount">Jumlah</Label>
                    <div className="col-span-1">
                        <Input
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            min="0"
                            type="number"
                            className="w-full border rounded-lg p-2"
                            placeholder="Rp"
                        />
                    </div>
                    <h1 className="font-bold text-end">{formatNumber(formData.amount)}</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
                    <Label htmlFor="description">Catatan</Label>
                    <div className="col-span-2">
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border rounded-lg p-2"
                            placeholder="Catatan (Optional)"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-8 py-3 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Simpan"}
                </button>
            </form>
        </div>
    );
};

export default CreatePayable;
