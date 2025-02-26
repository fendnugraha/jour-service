"use client";
import { useState, useEffect } from "react";
import axios from "@/libs/axios";
import Label from "@/components/Label";
import Input from "@/components/Input";
import formatNumber from "@/libs/formatNumber";

const CreateJournal = ({ isModalOpen, notification, getAccountBalance }) => {
    const [formData, setFormData] = useState({
        debt_code: "",
        cred_code: "",
        amount: "",
        fee_amount: 0,
        trx_type: "Jurnal Umum",
        description: "",
    });
    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const fetchAccounts = async (url = "/api/get-all-accounts") => {
        try {
            const response = await axios.get(url);
            setAccounts(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const destAccount = accounts.filter((accounts) => accounts.id !== Number(formData.cred_code));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/create-mutation", formData);
            notification(response.data.message);
            getAccountBalance();
            isModalOpen(false);
        } catch (error) {
            notification(error.response?.data?.message || "Something went wrong.");
            setErrors(error.response?.data?.errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Dari</Label>
                <div className="col-span-1 sm:col-span-2">
                    <select
                        onChange={(e) => setFormData({ ...formData, cred_code: e.target.value })}
                        value={formData.cred_code}
                        className="w-full rounded-md border p-2 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">--Pilih sumber dana--</option>
                        {accounts.map((br) => (
                            <option key={br.id} value={br.id}>
                                {br.acc_name}
                            </option>
                        ))}
                    </select>
                    {errors.cred_code && <span className="text-red-500 text-xs">{errors.cred_code}</span>}
                </div>
            </div>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Ke</Label>
                <div className="col-span-1 sm:col-span-2">
                    <select
                        onChange={(e) => setFormData({ ...formData, debt_code: e.target.value })}
                        value={formData.debt_code}
                        className="w-full rounded-md border p-2 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        disabled={!formData.cred_code}
                    >
                        <option value="">--Pilih tujuan mutasi--</option>
                        {destAccount.map((hq) => (
                            <option key={hq.id} value={hq.id}>
                                {hq.acc_name}
                            </option>
                        ))}
                    </select>
                    {errors.debt_code && <span className="text-red-500 text-xs">{errors.debt_code}</span>}
                </div>
            </div>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Jumlah transfer</Label>
                <div className="col-span-1">
                    <Input
                        className="w-full text-xs sm:text-sm"
                        type="number"
                        placeholder="Rp."
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                    {errors.amount && <span className="text-red-500 text-xs">{errors.amount}</span>}
                </div>

                <h1 className="text-lg font-bold">{formatNumber(formData.amount)}</h1>
            </div>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Keterangan</Label>
                <div className="col-span-1 sm:col-span-2">
                    <textarea
                        className="w-full rounded-md border p-2 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        type="text"
                        placeholder="(Optional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-8 py-3 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? "Loading..." : "Simpan"}
            </button>
        </form>
    );
};

export default CreateJournal;
