"use client";
import { use, useEffect, useState } from "react";
import Header from "../../Header";
import axios from "@/libs/axios";

const OrderDetail = ({ params }) => {
    const { id } = use(params);
    console.log(id);

    const [order, setOrder] = useState([{}]);
    const fetchOrderById = async (id) => {
        try {
            const response = await axios.get(`/api/orders/${id}`);
            setOrder(response.data.data);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchOrderById(id);
    }, [id]);
    console.log(order);
    return (
        <>
            <Header title="Order Detail" />
            <div className="py-8 relative">
                <div className="max-w-7xl mx-auto sm:px-6">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-2xl p-4">
                            <table className="w-full tex-xs">
                                <tbody>
                                    <tr>
                                        <td>Nama Konsumen</td>
                                        <td>Fend</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
