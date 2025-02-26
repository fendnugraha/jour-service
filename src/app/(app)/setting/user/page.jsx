"use client";
import { useState, useEffect } from "react";
import Header from "../../Header";
import Notification from "@/components/notification";
import axios from "@/libs/axios";
import formatDateTime from "@/libs/formatDateTime";
import Modal from "@/components/Modal";
import CreateUser from "./CreateUser";
import Paginator from "@/components/Paginator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BuildingIcon, MailIcon, PencilIcon, PlusCircleIcon, SmileIcon, StoreIcon, Trash2Icon } from "lucide-react";
import TimeAgo from "@/libs/formatDateDistance";

const User = () => {
    const router = useRouter();
    const [notification, setNotification] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchUsers = async (url = "/api/users") => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setUsers(response.data.data);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        setLoading(false);
    }, []);

    const handleChangePage = (url) => {
        fetchUsers(url);
    };

    const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
    const closeModal = () => {
        setIsModalCreateUserOpen(false);
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.delete(`/api/users/${id}`);
            setNotification(response.data.message);
            fetchUsers();
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        }
    };
    return (
        <>
            <Header title="User Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden rounded-2xl">
                        {notification && <Notification notification={notification} onClose={() => setNotification("")} />}
                        <div className="p-4">
                            <button onClick={() => setIsModalCreateUserOpen(true)} className="bg-indigo-500 text-white text-sm py-2 px-6 rounded-lg">
                                Tambah User <PlusCircleIcon className="size-4 inline" />
                            </button>
                            <Modal isOpen={isModalCreateUserOpen} onClose={closeModal} modalTitle="Create User">
                                <CreateUser
                                    isModalOpen={setIsModalCreateUserOpen}
                                    notification={(message) => setNotification(message)}
                                    fetchUsers={fetchUsers}
                                />
                            </Modal>
                        </div>
                        <div className="overflow-y-auto">
                            <table className="table w-full text-xs">
                                <thead>
                                    <tr>
                                        <th className="">Name</th>
                                        <th className="">Role</th>
                                        <th className="">Warehouse</th>
                                        <th className="">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td className="border-b p-2" colSpan={3}>
                                                Loading ...
                                            </td>
                                        </tr>
                                    ) : (
                                        users?.data?.map((user) => (
                                            <tr key={user.id}>
                                                <td className="border-b p-2">
                                                    <span className="font-bold">{user.name}</span>
                                                    <span className="text-xs block">
                                                        <MailIcon className="h-4 w-4 inline" /> {user.email}
                                                    </span>
                                                    <span className="text-xs block text-slate-500">
                                                        Last update at <TimeAgo timestamp={user.updated_at} />
                                                    </span>
                                                </td>
                                                <td className="border-b p-2">{user.role?.role}</td>
                                                <td className="border-b p-2">{user.role?.warehouse?.name}</td>
                                                <td className="border-b p-2">
                                                    <span className="flex gap-2 justify-center items-center">
                                                        <Link href={`/setting/user/edit/${user.id}`} className="bg-green-500 text-white py-2 px-6 rounded-lg">
                                                            <PencilIcon className="size-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="bg-red-500 text-white py-2 px-6 rounded-lg"
                                                        >
                                                            <Trash2Icon className="size-4" />
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4">{users?.links && <Paginator links={users} handleChangePage={handleChangePage} />}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
