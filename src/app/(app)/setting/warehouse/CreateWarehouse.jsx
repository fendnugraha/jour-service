import Input from "@/components/Input";
import Label from "@/components/Label";
import { useState, useEffect } from "react";
import axios from "@/libs/axios";

const CreateWarehouse = ({ isModalOpen, notification, fetchWarehouses }) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        address: "",
        acc_code: "",
    });
    const [cashBank, setCashBank] = useState([]);

    const [errors, setErrors] = useState({
        code: "",
        name: "",
        address: "",
        acc_code: "",
    });

    useEffect(() => {
        const fetchCashBank = async () => {
            try {
                const response = await axios.get("/api/get-cash-and-bank");
                setCashBank(response.data.data);
            } catch (error) {
                setErrors(error.response?.data?.errors || ["Something went wrong."]);
            }
        };
        fetchCashBank();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/warehouse", formData);
            isModalOpen(false);
            fetchWarehouses();
            notification(response.data.message);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            notification(error.response?.data?.message, "error");
            isModalOpen(false);
            fetchWarehouses();
        }
    };

    const availableCashBank = cashBank.filter((item) => item.warehouse_id === null);

    return (
        <div>
            <form>
                <div className="mb-3">
                    <Label htmlFor="code">Warehouse code:</Label>
                    <Input
                        type="text"
                        className={""}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="Contoh: HQT"
                        required
                    />
                    {errors.code && <span>{errors.code}</span>}
                </div>
                <div className="mb-3">
                    <Label htmlFor="name">Warehouse Name:</Label>
                    <Input
                        type="text"
                        className={"w-full"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <div className="mb-3">
                    <Label htmlFor="address">Address:</Label>
                    <textarea
                        type="text"
                        className={
                            "w-full rounded-md border p-2 shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        }
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                    {errors.address && <span>{errors.address}</span>}
                </div>
                <div className="mb-3">
                    <Label htmlFor="cash_bank">Cash/Bank:</Label>
                    <select
                        name="cash_bank"
                        id="cash_bank"
                        className="w-full rounded-md border p-2 shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                acc_code: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Select Cash/Bank</option>
                        {availableCashBank.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.acc_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSubmit} className="px-6 py-3 bg-slate-500 mt-4 rounded-lg text-white">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateWarehouse;
