"use client";
import Header from "@/app/(app)/Header";
import Notification from "@/components/notification";
import { useState, useEffect, use } from "react";
import axios from "@/libs/axios";
import Label from "@/components/Label";
import Input from "@/components/Input";
import Link from "next/link";

const UserEditPage = ({ params }) => {
    const [notification, setNotification] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const { id } = use(params);
    const [updateUserData, setUpdateUserData] = useState({
        name: "",
        email: "",
        warehouse: "",
        role: "",
    });
    const [updatePassword, setUpdatePassword] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(true);
    const fetchUser = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/users/${id}`);
            setUpdateUserData({
                name: response.data.data.name,
                email: response.data.data.email,
                warehouse: response.data.data.role.warehouse_id,
                role: response.data.data.role.role,
            });
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get("/api/get-all-warehouses");
            setWarehouses(response.data.data);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        }
    };

    useEffect(() => {
        fetchUser(id);
        fetchWarehouses();
        setLoading(false);
    }, []);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/users/${id}`, updateUserData);
            setNotification(response.data.message);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/users/${id}/update-password`, updatePassword);
            setNotification(response.data.message);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        }
    };
    return (
        <>
            <Header title="User Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {notification && <Notification notification={notification} onClose={() => setNotification("")} />}
                        <div className="p-6 bg-white border-b border-gray-200">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <form>
                                        <div>
                                            <h1 className="text-lg font-bold">Update User Info</h1>
                                            <div className="my-4">
                                                <Label>Name</Label>
                                                <Input
                                                    className={"w-full"}
                                                    type="text"
                                                    onChange={(e) => setUpdateUserData({ ...updateUserData, name: e.target.value })}
                                                    value={updateUserData.name}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <Label>Email</Label>
                                                <Input
                                                    className={"w-full"}
                                                    type="email"
                                                    onChange={(e) => setUpdateUserData({ ...updateUserData, email: e.target.value })}
                                                    value={updateUserData.email}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <Label>Warehouse</Label>
                                                <select
                                                    className=" w-full rounded-md border p-2 shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    onChange={(e) => setUpdateUserData({ ...updateUserData, warehouse: e.target.value })}
                                                    value={updateUserData.warehouse}
                                                >
                                                    {warehouses?.map((warehouse) => (
                                                        <option key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-4">
                                                <Label>Role</Label>
                                                <div className="flex gap-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            id="Administrator"
                                                            value="Administrator"
                                                            checked={updateUserData.role === "Administrator"}
                                                            onChange={(e) => setUpdateUserData({ ...updateUserData, role: e.target.value })}
                                                        />
                                                        <label htmlFor="Administrator">Administrator</label>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            id="Staff"
                                                            value="Staff"
                                                            checked={updateUserData.role === "Staff"}
                                                            onChange={(e) => setUpdateUserData({ ...updateUserData, role: e.target.value })}
                                                        />
                                                        <label htmlFor="Staff">Staff</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="bg-indigo-500 text-white py-2 px-6 rounded-lg" onClick={handleUpdateUser} disabled={loading}>
                                            {loading ? "Loading..." : "Update"}
                                        </button>
                                    </form>
                                    <form>
                                        <div>
                                            <h1 className="text-lg font-bold">Update Password</h1>
                                            <div className="my-4">
                                                <Label>Old Password</Label>
                                                <Input
                                                    className={"w-full"}
                                                    type="password"
                                                    onChange={(e) => setUpdatePassword({ ...updatePassword, oldPassword: e.target.value })}
                                                    value={updatePassword.oldPassword}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <Label>New Password</Label>
                                                <Input
                                                    className={"w-full"}
                                                    type="password"
                                                    onChange={(e) => setUpdatePassword({ ...updatePassword, password: e.target.value })}
                                                    value={updatePassword.password}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <Label>Confirm Password</Label>
                                                <Input
                                                    className={"w-full"}
                                                    type="password"
                                                    onChange={(e) => setUpdatePassword({ ...updatePassword, confirmPassword: e.target.value })}
                                                    value={updatePassword.confirmPassword}
                                                />
                                            </div>
                                        </div>
                                        <button className="bg-indigo-500 text-white py-2 px-6 rounded-lg" onClick={handleUpdatePassword} disabled={loading}>
                                            {loading ? "Loading..." : "Update Password"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link className="bg-red-400 rounded-xl px-6 py-2 text-white" href="/setting/user">
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserEditPage;
