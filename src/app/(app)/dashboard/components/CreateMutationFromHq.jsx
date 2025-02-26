"use client";
import { useState, useEffect } from "react";
import axios from "@/libs/axios";
import Label from "@/components/Label";
import Input from "@/components/Input";
import formatNumber from "@/libs/formatNumber";

const CreateMutationFromHq = ({ isModalOpen, cashBank, notification, fetchJournalsByWarehouse, warehouses }) => {
    const [formData, setFormData] = useState({
        debt_code: "",
        cred_code: "",
        amount: "",
        fee_amount: 0,
        trx_type: "Mutasi Kas",
        description: "",
        admin_fee: "" || 0,
    });
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(1);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const hqAccount = cashBank.filter((cashBank) => cashBank.warehouse_id === 1);
    const branchAccount = cashBank.filter((cashBank) => cashBank.warehouse_id === Number(selectedWarehouseId));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/create-mutation", formData);
            notification(response.data.message);
            fetchJournalsByWarehouse();
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
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Pilih Cabang</Label>
                <div className="col-span-1 sm:col-span-2">
                    <select
                        onChange={(e) => setSelectedWarehouseId(e.target.value)}
                        value={selectedWarehouseId}
                        className="w-full rounded-md border p-2 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {warehouses?.map((wh) => (
                            <option key={wh.id} value={wh.id}>
                                {wh.name}
                            </option>
                        ))}
                    </select>
                    {errors.debt_code && <span className="text-red-500 text-xs">{errors.debt_code}</span>}
                </div>
            </div>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Dari (Pusat)</Label>
                <div className="col-span-1 sm:col-span-2">
                    <select
                        onChange={(e) => setFormData({ ...formData, cred_code: e.target.value })}
                        value={formData.cred_code}
                        className="w-full rounded-md border p-2 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">--Pilih sumber dana--</option>
                        {hqAccount.map((br) => (
                            <option key={br.id} value={br.id}>
                                {br.acc_name}
                            </option>
                        ))}
                    </select>
                    {errors.cred_code && <span className="text-red-500 text-xs">{errors.cred_code}</span>}
                </div>
            </div>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Ke (Cabang)</Label>
                <div className="col-span-1 sm:col-span-2">
                    <select
                        onChange={(e) => setFormData({ ...formData, debt_code: e.target.value })}
                        value={formData.debt_code}
                        className="w-full rounded-md border p-2 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        disabled={!selectedWarehouseId}
                    >
                        <option value="">--Pilih tujuan mutasi--</option>
                        {branchAccount.map((hq) => (
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

                {formData.amount > 0 && <h1 className="text-sm sm:text-lg font-bold">{formatNumber(formData.amount)}</h1>}
            </div>
            <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center">
                <Label>Biaya admin bank</Label>
                <div className="col-span-1">
                    <Input
                        className="sm:w-1/2 w-3/4 text-xs sm:text-sm"
                        type="number"
                        placeholder="Rp."
                        value={formData.admin_fee}
                        onChange={(e) => setFormData({ ...formData, admin_fee: e.target.value })}
                    />
                    {errors.admin_fee && <span className="text-red-500 text-xs">{errors.admin_fee}</span>}
                </div>

                {formData.admin_fee > 0 && <h1 className="text-sm sm:text-lg font-bold">{formatNumber(formData.admin_fee)}</h1>}
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

export default CreateMutationFromHq;
