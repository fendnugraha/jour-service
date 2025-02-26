"use client";

import Header from "@/app/(app)/Header";
import Paginator from "@/components/Paginator";
import axios from "@/libs/axios";
import { useState, useEffect } from "react";
import Input from "@/components/Input";
import FormCreateAccount from "./formCreateAccount";
import Modal from "@/components/Modal";
import { LockIcon, PencilIcon, PlusCircleIcon, Trash2Icon, TrashIcon } from "lucide-react";
import Notification from "@/components/notification";
import formatNumber from "@/libs/formatNumber";

export default function Account() {
    const [account, setAccount] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState([]);
    const [selectedUpdateAccount, setSelectedUpdateAccount] = useState(null);
    const [selectedAccountID, setselectedAccountID] = useState(null);
    const [notification, setNotification] = useState("");
    const [errors, setErrors] = useState([]); // Store validation errors
    const [isModalCreateAccountOpen, setIsModalCreateAccountOpen] = useState(false);
    const [isModalUpdateAccountOpen, setIsModalUpdateAccountOpen] = useState(false);

    // Fetch Accounts
    const fetchAccount = async (url = "/api/accounts") => {
        try {
            const response = await axios.get(url);
            setAccount(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    const handleDeleteAccount = async (id) => {
        try {
            const response = await axios.delete(`api/accounts/${id}`);
            setNotification(response.data.message);
            fetchAccount();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            setNotification(error.response.data.message);
        }
    };

    const closeModal = () => {
        setIsModalCreateAccountOpen(false);
        setIsModalUpdateAccountOpen(false);
    };

    const handleSelectAccount = (id) => {
        setSelectedAccount((prevSelected) => {
            // Check if the ID is already in the selectedAccount array
            if (prevSelected.includes(id)) {
                // If it exists, remove it
                return prevSelected.filter((accountId) => accountId !== id);
            } else {
                // If it doesn't exist, add it
                return [...prevSelected, id];
            }
        });
    };

    const handleShowAccount = async (id) => {
        try {
            const response = await axios.get(`api/accounts/${id}`);
            setSelectedUpdateAccount(response.data.data);
            setIsModalUpdateAccountOpen(true);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
            console.log(error.response);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (selectedAccountID) {
                handleShowAccount(selectedAccountID);
            }
        }, 300);

        // Cleanup the timeout if selectedAccountID changes before the delay is complete
        return () => clearTimeout(handler);
    }, [selectedAccountID]);

    const handleDeleteSelectedAccounts = async () => {
        try {
            const response = await axios.delete(`api/delete-selected-account`, { data: { ids: selectedAccount } });
            setNotification(response.data.message);
            fetchAccount();
            setSelectedAccount([]);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchAccount("/api/accounts");
    }, []);

    useEffect(() => {
        if (notification || errors.length > 0) {
            const timeoutId = setTimeout(() => {
                setNotification("");
                setErrors([]);
            }, 3000); // Notification disappears after 3 seconds

            // Cleanup timeout on component unmount
            return () => clearTimeout(timeoutId);
        }
    }, [notification, errors]);

    const handleChangePage = (url) => {
        fetchAccount(url);
    };

    const handleUpdateAccount = async () => {
        // console.log(selectedUpdateAccount.acc_name)

        try {
            const response = await axios.put(`api/accounts/${selectedUpdateAccount.id}`, selectedUpdateAccount);
            setNotification(response.data.message);
            fetchAccount();
            closeModal();
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };
    return (
        <>
            <Header title="Account" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="fixed top-0 right-0 px-6 py-4 sm:block" onClick={() => setNotification("")}>
                            {notification && <Notification notification={notification} onClose={() => setNotification("")} />}
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            {errors.length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex justify-between">
                                {selectedAccount.length > 0 && (
                                    <button className="btn-primary" onClick={handleDeleteSelectedAccounts}>
                                        Hapus terpilih {selectedAccount.length}
                                    </button>
                                )}

                                <button className="btn-primary" onClick={() => setIsModalCreateAccountOpen(true)}>
                                    Tambah Account <PlusCircleIcon className="w-5 h-5 inline" />
                                </button>
                                <Modal isOpen={isModalCreateAccountOpen} onClose={closeModal} modalTitle="Create account">
                                    <FormCreateAccount
                                        isModalOpen={setIsModalCreateAccountOpen}
                                        notification={(message) => setNotification(message)}
                                        fetchAccount={fetchAccount}
                                    />
                                </Modal>
                                {selectedUpdateAccount && (
                                    <Modal isOpen={isModalUpdateAccountOpen} onClose={closeModal} modalTitle="Update account">
                                        <div className="mb-4">
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                                Account Name
                                            </label>
                                            <Input
                                                type="text"
                                                id="name"
                                                defaultValue={selectedUpdateAccount.acc_name}
                                                onChange={(event) =>
                                                    setSelectedUpdateAccount({
                                                        ...selectedUpdateAccount,
                                                        acc_name: event.target.value,
                                                    })
                                                }
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="st_balance" className="block mb-2 text-sm font-medium text-gray-900">
                                                Starting Balance
                                            </label>
                                            <Input
                                                type="number"
                                                defaultValue={selectedUpdateAccount.st_balance}
                                                onChange={(event) =>
                                                    setSelectedUpdateAccount({
                                                        ...selectedUpdateAccount,
                                                        st_balance: event.target.value,
                                                    })
                                                }
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder="0"
                                            />
                                        </div>
                                        <button className="btn-primary" onClick={handleUpdateAccount}>
                                            Update Account
                                        </button>
                                    </Modal>
                                )}
                            </div>
                            <div className="overflow-y-auto">
                                <table className="table w-full text-xs">
                                    <thead>
                                        <tr>
                                            <th className="">
                                                <Input type="checkbox" disabled />
                                            </th>
                                            <th className="">Name</th>
                                            <th className="hidden sm:table-cell">Balance</th>
                                            <th className="">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {account?.data?.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    No data
                                                </td>
                                            </tr>
                                        ) : (
                                            account?.data?.map((account) => (
                                                <tr key={account.id}>
                                                    <td className="w-4">
                                                        <Input
                                                            checked={selectedAccount.includes(account.id)}
                                                            onChange={() => {
                                                                handleSelectAccount(account.id);
                                                            }}
                                                            type="checkbox"
                                                        />
                                                    </td>
                                                    <td className="">
                                                        <span className="font-bold text-blue-800">
                                                            {account.acc_name} {account.is_locked === 1 && <LockIcon size={16} className="inline" />}
                                                        </span>
                                                        <br />
                                                        <span className="text-slate-600">
                                                            {account.acc_code} # {account.account?.name} # {account?.warehouse?.name ?? "NotAssociated"}
                                                        </span>
                                                        <span className="font-bold block text-sm sm:hidden">{formatNumber(account.st_balance)}</span>
                                                    </td>
                                                    <td className="text-right text-lg hidden sm:table-cell">
                                                        {new Intl.NumberFormat("id-ID", {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }).format(account.st_balance)}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    handleShowAccount(account.id);
                                                                }}
                                                                className=""
                                                            >
                                                                <PencilIcon className="w-5 h-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAccount(account.id)}
                                                                className="disabled:text-red-400"
                                                                disabled={account.is_locked === 1}
                                                            >
                                                                {" "}
                                                                {account.is_locked === 1 ? (
                                                                    <LockIcon className="w-5 h-5 inline" />
                                                                ) : (
                                                                    <Trash2Icon className="w-5 h-5 inline" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {account === null ? "" : <Paginator links={account} handleChangePage={handleChangePage} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
