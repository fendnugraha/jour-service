"use client";
import formatNumber from "@/libs/formatNumber";
import axios from "@/libs/axios";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { FilterIcon, LoaderIcon, RefreshCcwIcon } from "lucide-react";
import Modal from "@/components/Modal";
import Label from "@/components/Label";
import Input from "@/components/Input";

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const fetcher = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data?.errors || ["Something went wrong."];
    }
};
export async function getServerSideProps(context) {
    const { warehouse } = context.query;
    const today = new Date().toISOString().split("T")[0];

    const res = await axios.get(`/api/daily-dashboard/${warehouse || "all"}/${today}/${today}`);

    return { props: { initialData: res.data, initialWarehouse: warehouse || "all" } };
}
const useGetdailyDashboard = (warehouse, startDate, endDate, initialData) => {
    const {
        data: dailyDashboard,
        error,
        isValidating,
    } = useSWR(`/api/daily-dashboard/${warehouse}/${startDate}/${endDate}`, fetcher, {
        fallbackData: initialData,
        revalidateOnFocus: true,
        dedupingInterval: 60000,
    });

    return { dailyDashboard, loading: isValidating, error };
};

const DailyDashboard = ({ notification, warehouse, warehouses, userRole }) => {
    const [filterData, setFilterData] = useState({
        startDate: getCurrentDate(),
        endDate: getCurrentDate(),
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse);
    const [isModalFilterDataOpen, setIsModalFilterDataOpen] = useState(false);
    const { dailyDashboard, loading: isLoading, error } = useGetdailyDashboard(selectedWarehouse, startDate, endDate);

    const handleFilterData = () => {
        setStartDate(filterData.startDate);
        setEndDate(filterData.endDate);
        setIsModalFilterDataOpen(false);
    };

    const closeModal = () => {
        setIsModalFilterDataOpen(false);
    };

    useEffect(() => {
        mutate(`/api/daily-dashboard/${selectedWarehouse}/${startDate}/${endDate}`);
    }, [selectedWarehouse, startDate, endDate]);

    return (
        <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="mb-2 flex gap-2 px-2">
                    {userRole === "Administrator" && (
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="all">Semua Cabang</option>
                            {warehouses?.data?.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={() => setIsModalFilterDataOpen(true)}
                        className="bg-white font-bold p-3 rounded-lg border border-gray-300 hover:border-gray-400"
                    >
                        <FilterIcon className="size-4" />
                    </button>
                </div>
                <Modal isOpen={isModalFilterDataOpen} onClose={closeModal} modalTitle="Filter Tanggal" maxWidth="max-w-md">
                    <div className="mb-4">
                        <Label className="font-bold">Tanggal</Label>
                        <Input
                            type="date"
                            value={filterData.startDate}
                            onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
                            className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="font-bold">s/d</Label>
                        <Input
                            type="date"
                            value={filterData.endDate}
                            onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
                            className="w-full rounded-md border p-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        onClick={() => {
                            // mutate(`/api/daily-dashboard/${selectedWarehouse}/${startDate}/${endDate}`);
                            // setIsModalFilterDataOpen(false);
                            handleFilterData();
                        }}
                        className="btn-primary"
                    >
                        Submit
                    </button>
                </Modal>
                <div className="flex flex-end items-center px-2">
                    <h1 className="text-sm font-bold text-center sm:text-end text-slate-500 w-full">
                        {selectedWarehouse === "all" ? "Semua Cabang" : warehouses?.data?.find((warehouse) => warehouse.id === selectedWarehouse)?.name},
                        Periode: {startDate} s/d {endDate}
                    </h1>
                </div>
            </div>
            <button
                className="absolute bottom-3 left-3 text-white hover:scale-110 transition-transform duration-75"
                onClick={() => mutate(`/api/daily-dashboard/${selectedWarehouse}/${startDate}/${endDate}`)}
            >
                <RefreshCcwIcon className="w-5 h-5" />
            </button>
            <div className="min-h-[28rem] grid grid-cols-1 sm:grid-cols-5 sm:grid-rows-4 gap-1 sm:gap-3 px-1 sm:px-0">
                <div
                    className={`bg-gray-700 w-full h-full p-3 rounded-2xl sm:rounded-3xl flex flex-col gap-2 sm:gap-4 items-center justify-center col-span-2 row-span-2 ${
                        isLoading ? "animate-pulse" : ""
                    }`}
                >
                    <div className={`flex gap-2 flex-col justify-center items-center`}>
                        <h4 className="text-md sm:text-xl font-bold text-white">Saldo Kas Tunai</h4>
                        <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
                            {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(Number(dailyDashboard?.data?.totalCash))}
                        </h1>
                    </div>
                    <div className="flex gap-2 w-full justify-evenly">
                        <div>
                            <h4 className="text-xs text-white">Saldo Bank</h4>
                            <h1 className="text-sm font-bold text-white">
                                {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalBank)}
                            </h1>
                        </div>
                        <div>
                            <h4 className="text-xs text-yellow-400">Total Kas & Bank</h4>
                            <h1 className="text-sm font-bold text-white">
                                {isLoading ? (
                                    <LoaderIcon className="animate-pulse" />
                                ) : (
                                    formatNumber(dailyDashboard?.data?.totalCash + dailyDashboard?.data?.totalBank)
                                )}
                            </h1>
                        </div>
                    </div>
                </div>
                <div
                    className={`bg-gray-700 w-full h-full p-3 rounded-2xl sm:rounded-3xl flex flex-col gap-2 items-center justify-center col-span-2 row-span-2 ${
                        isLoading ? "animate-pulse" : ""
                    } `}
                >
                    <div className="flex gap-5 justify-between flex-col items-center">
                        <div className="flex gap-2 flex-col justify-center items-center">
                            <h4 className="text-md sm:text-lg font-bold text-white">Voucher & SP</h4>
                            <h1 className="text-2xl sm:text-3xl font-black text-yellow-300">
                                {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalVoucher)}
                            </h1>
                        </div>
                        {dailyDashboard?.data?.totalAccessories > 0 && (
                            <div className="flex gap-2 flex-col justify-center items-center">
                                <h4 className="text-md sm:text-lg font-bold text-white">Accessories</h4>
                                <h1 className="text-2xl sm:text-3xl font-black text-yellow-300">
                                    {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalAccessories)}
                                </h1>
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`bg-violet-500 rounded-2xl sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center ${
                        isLoading ? "animate-pulse" : ""
                    }`}
                >
                    <h4 className="text-md sm:text-xl text-white">Total Setoran</h4>
                    <h1 className="text-2xl font-extrabold text-white">
                        {isLoading ? (
                            <LoaderIcon className="animate-pulse" />
                        ) : (
                            formatNumber(
                                dailyDashboard?.data?.totalCashDeposit +
                                    dailyDashboard?.data?.profit +
                                    dailyDashboard?.data?.totalCash +
                                    dailyDashboard?.data?.totalVoucher +
                                    dailyDashboard?.data?.totalAccessories
                            )
                        )}
                    </h1>
                </div>
                <div
                    className={`bg-orange-500 rounded-2xl sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center ${
                        isLoading ? "animate-pulse" : ""
                    }`}
                >
                    <h4 className="text-md sm:text-xl text-white">Fee (Admin)</h4>
                    <h1 className="text-2xl font-extrabold text-white">
                        {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalFee)}
                    </h1>
                </div>
                <div
                    className={`bg-gray-700 w-full h-full p-3 rounded-2xl sm:rounded-3xl flex flex-col gap-2 sm:gap-6 items-center justify-center col-span-2 row-span-2 ${
                        isLoading ? "animate-pulse" : ""
                    }`}
                >
                    <div className="flex gap-2 flex-col justify-center items-center">
                        <h4 className="text-md sm:text-xl font-bold text-white">Laba (Profit)</h4>
                        <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
                            {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.profit)}
                        </h1>
                    </div>
                    <div className="flex gap-2 w-full justify-evenly">
                        <div>
                            <h4 className="text-xs text-white">Transfer Uang</h4>
                            <h1 className="text-sm font-bold text-white">
                                {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalTransfer)}
                            </h1>
                        </div>
                        <div>
                            <h4 className="text-xs text-white">Tarik Tunai</h4>
                            <h1 className="text-sm font-bold text-white">
                                {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalCashWithdrawal)}
                            </h1>
                        </div>
                    </div>
                </div>
                <div
                    className={`bg-gray-700 w-full h-full p-3 rounded-2xl sm:rounded-3xl flex flex-col gap-2 items-center justify-center col-span-2 row-span-2 ${
                        isLoading ? "animate-pulse" : ""
                    } `}
                >
                    <h4 className="text-md sm:text-xl font-bold text-white">Deposit</h4>
                    <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
                        {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.totalCashDeposit)}
                    </h1>
                </div>
                <div
                    className={`bg-red-500 rounded-2xl sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center ${
                        isLoading ? "animate-pulse" : ""
                    }`}
                >
                    <h4 className="text-md sm:text-xl text-white">Biaya</h4>
                    <h1 className="text-2xl font-extrabold text-white">
                        {loading ? (
                            <LoaderIcon className="animate-pulse" />
                        ) : (
                            formatNumber(dailyDashboard?.data?.totalExpense < 0 ? dailyDashboard?.data?.totalExpense * -1 : 0)
                        )}
                    </h1>
                </div>
                <div
                    className={`bg-blue-500 rounded-2xl sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center ${
                        isLoading ? "animate-pulse" : ""
                    }`}
                >
                    <h4 className="text-md sm:text-xl text-white">Transaksi</h4>
                    <h1 className="text-2xl font-extrabold text-white">
                        {isLoading ? <LoaderIcon className="animate-pulse" /> : formatNumber(dailyDashboard?.data?.salesCount)}
                    </h1>
                </div>
            </div>
            {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm h-full w-full flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner animate-spin text-white text-3xl"></i>
                    <p className="text-white text-sm font-bold">Loading data, please wait...</p>
                </div>
            </div> */}
        </div>
    );
};

export default DailyDashboard;
