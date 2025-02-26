"use client";
import Notification from "@/components/notification";
import Header from "../../Header";
import { useState, useEffect } from "react";
import axios from "@/libs/axios";
import Modal from "@/components/Modal";
import CreateContact from "./CreateContact";
import { MapPin, MapPinIcon, PencilIcon, PhoneIcon, PlusCircleIcon, TrashIcon } from "lucide-react";

const Contact = () => {
    const [notification, setNotification] = useState("");
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchContacts = async (url = "/api/contacts") => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setContacts(response.data.data);
        } catch (error) {
            setNotification(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const [isModalCreateContactOpen, setIsModalCreateContactOpen] = useState(false);
    const closeModal = () => {
        setIsModalCreateContactOpen(false);
    };

    return (
        <>
            <Header title="Contact" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {notification && <Notification notification={notification} onClose={() => setNotification("")} />}
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-2">
                                <button onClick={() => setIsModalCreateContactOpen(true)} className="bg-indigo-500 text-white py-2 px-6 rounded-lg">
                                    Tambah Contact <PlusCircleIcon className="size-4 inline" />
                                </button>
                                <Modal isOpen={isModalCreateContactOpen} onClose={closeModal} modalTitle="Create Contact">
                                    <CreateContact
                                        isModalOpen={setIsModalCreateContactOpen}
                                        notification={(message) => setNotification(message)}
                                        fetchContacts={fetchContacts}
                                    />
                                </Modal>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table w-full sm:w-3/4 text-xs">
                                    <thead>
                                        <tr>
                                            <th className="border-b-2 p-2">Name</th>
                                            <th className="border-b-2 p-2">Desctiption</th>
                                            <th className="border-b-2 p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts?.data?.map((contact) => (
                                            <tr key={contact.id}>
                                                <td className="border-b p-2">
                                                    <span className="font-bold">{contact.name}</span>
                                                    <span className="text-xs block mt-1">
                                                        <PhoneIcon className="size-4 inline" /> {contact.phone_number} <MapPinIcon className="size-4 inline" />{" "}
                                                        {contact.address}
                                                    </span>
                                                </td>
                                                <td className="border-b p-2">
                                                    {contact.type}: {contact.description}
                                                </td>
                                                <td className="border-b p-2">
                                                    <span className="flex gap-2 justify-center items-center">
                                                        <button className="bg-green-500 text-white py-2 px-6 rounded-lg">
                                                            <PencilIcon className="size-4" />
                                                        </button>
                                                        <button className="bg-red-500 text-white py-2 px-6 rounded-lg">
                                                            <TrashIcon className="size-4" />
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
