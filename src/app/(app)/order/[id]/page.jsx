"use client";
import { use, useCallback, useEffect, useState } from "react";
import Header from "../../Header";
import axios from "@/libs/axios";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon, MinusCircleIcon, PlusCircleIcon, SmartphoneIcon, XCircleIcon } from "lucide-react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import formatNumber from "@/libs/formatNumber";

const OrderDetail = ({ params }) => {
    const { id } = use(params);
    const [errors, setErrors] = useState([]);
    const [isModalAddPartOpen, setIsModalAddPartOpen] = useState(false);
    const closeModal = () => {
        setIsModalAddPartOpen(false);
        setErrors([]);
        setSearchProduct("");
    };

    const [searchProduct, setSearchProduct] = useState("");
    const [products, setProducts] = useState([]);
    const [partCart, setPartCart] = useState(() => {
        const storedPartCart = localStorage.getItem("partCart");
        return storedPartCart ? JSON.parse(storedPartCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("partCart", JSON.stringify(partCart));
    }, [partCart]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get("/api/products", {
                    params: { search: searchProduct },
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        // Hanya fetch jika panjang input >= 3 karakter
        if (searchProduct.length >= 3) {
            fetchProduct();
        } else {
            setProducts([]); // Kosongkan hasil jika input kurang dari 3 karakter
        }
    }, [searchProduct]);
    const formatPhoneNumber = (phone) => {
        if (!phone) return ""; // Handle jika input null/undefined
        return phone
            .toString() // Pastikan input berupa string
            .replace(/\D/g, "") // Hapus semua karakter non-digit
            .replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3"); // Format 4-4-sisa digit
    };

    const [order, setOrder] = useState({});
    const fetchOrderById = async (id) => {
        try {
            const response = await axios.get(`/api/orders/${id}`);
            setOrder(response.data.order);
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Something went wrong."]);
        }
    };

    useEffect(() => {
        fetchOrderById(id);
    }, [id]);
    const filterCartByOrderNumber = partCart.filter((item) => item.order_number === order.order_number);

    const handleAddPartCart = (product) => {
        setPartCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id && item.order_number === order.order_number);
            if (existingProduct) {
                // If product is already in the cart, increase its quantity
                return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            // Otherwise, add the product to the cart with quantity 1
            return [...prevCart, { ...product, quantity: 1, order_number: order.order_number }];
        });
    };

    const handleRemovePartCart = (productId) => {
        setPartCart((prevCart) => prevCart.filter((item) => item.id !== productId && item.order_number === order.order_number));
    };

    const handleIncrementQuantity = (productId) => {
        setPartCart((prevCart) =>
            prevCart.map((item) => (item.id === productId && item.order_number === order.order_number ? { ...item, quantity: item.quantity + 1 } : item))
        );
    };

    const handleDecrementQuantity = (productId) => {
        //if quantity is 1, remove product from cart
        if (partCart.find((item) => item.id === productId && item.order_number === order.order_number)?.quantity === 1) {
            handleRemovePartCart(productId);
            return;
        }
        setPartCart(
            (prevCart) =>
                prevCart
                    .map((item) => (item.id === productId && item.order_number === order.order_number ? { ...item, quantity: item.quantity - 1 } : item))
                    .filter((item) => item.quantity > 0) // Hapus jika quantity = 0
        );
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        setPartCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    };

    const handleUpdatePrice = (productId, newPrice) => {
        setPartCart((prevCart) =>
            prevCart.map((item) => (item.id === productId && item.order_number === order.order_number ? { ...item, price: newPrice } : item))
        );
    };

    const calculateTotalPrice = () => {
        return filterCartByOrderNumber.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <>
            <Header title="Order Detail" />
            <div className="py-8 relative">
                <div className="max-w-7xl mx-auto sm:px-6">
                    <div className="flex justify-between">
                        <div className=" mb-4">
                            <h1 className="text-2xl font-bold">{order?.contact?.name}</h1>
                            <span className="block text-xs text-slate-400">{formatPhoneNumber(order?.contact?.phone_number)}</span>
                        </div>
                        <Link href="/order" className="text-sm font-semibold hover:underline">
                            <ArrowLeftIcon className="w-4 h-4 inline mr-2" /> Kembali
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="">
                            <div className="bg-slate-600 p-2 flex gap-2 rounded-2xl items-center mb-2">
                                <div className="bg-white p-2 rounded-xl">
                                    <SmartphoneIcon size={24} className="" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold text-white">{order?.phone_type}</h1>
                                    <h1 className="text-xs text-white">{order?.order_number}</h1>
                                </div>
                            </div>
                            <div className="mb-2 grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setIsModalAddPartOpen(true)}
                                    className="bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm p-2"
                                >
                                    <PlusCircleIcon size={16} className="inline" /> Add Parts
                                </button>
                                <Modal isOpen={isModalAddPartOpen} onClose={closeModal} modalTitle="Add Parts Replacement" maxWidth="max-w-xl">
                                    <Input
                                        onChange={(e) => setSearchProduct(e.target.value)}
                                        type="search"
                                        className={"w-full rounded-2xl"}
                                        placeholder="Search Product... (min. 3 characters)"
                                    />
                                    {products?.data?.length === 0 ? (
                                        <div className="flex items-center justify-center">
                                            <p className="text-sm text-slate-600">No products found</p>
                                        </div>
                                    ) : (
                                        products?.data?.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between py-2 border-b last:border-0 border-dashed border-slate-300"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <h1 className="text-sm font-bold">{product.name}</h1>
                                                        <h1 className="text-xs text-slate-600">
                                                            Jual: {formatNumber(product.price)}, Modal: {formatNumber(product.cost)}, Stock: {product.end_stock}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddPartCart(product)}
                                                    className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm px-4 py-2"
                                                >
                                                    <PlusCircleIcon size={16} className="inline" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </Modal>
                                <button className="bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm p-2">
                                    <PlusCircleIcon size={16} className="inline" /> Biaya Lainnya
                                </button>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-2xl mb-2">
                                <div className="mb-1">
                                    <h1 className="text-sm text-slate-500">Deskripsi Kerusakan</h1>
                                    <h1 className="text-xs">{order?.description}</h1>
                                </div>
                            </div>
                            <button className=" bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-sm py-4 w-full">Checkout</button>
                        </div>
                        {/* Part Replacement Table */}
                        <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-sm col-span-2">
                            <h1 className="text-left text-sm font-semibold text-slate-500 px-4 pt-2 mb-2">Part Replacement</h1>
                            {filterCartByOrderNumber?.length === 0 ? (
                                <div className="flex items-center justify-center">
                                    <p className="text-sm text-slate-600">No parts found</p>
                                </div>
                            ) : (
                                filterCartByOrderNumber?.map((part) => (
                                    <div className="px-4 border-b border-slate-200 border-dashed" key={part.id}>
                                        <div className="flex justify-between itemts-center mb-2">
                                            <h1 className="text-sm text-slate-700 text-nowrap overflow-hidden">{part.name}</h1>

                                            <button onClick={() => handleRemovePartCart(part.id)}>
                                                <XCircleIcon size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex gap-4 items-center disabled:text-slate-400">
                                                <button onClick={() => handleDecrementQuantity(part.id)}>
                                                    <MinusCircleIcon size={24} />
                                                </button>
                                                <h1 className="text-sm ">{part.quantity}</h1>
                                                <button onClick={() => handleIncrementQuantity(part.id)}>
                                                    <PlusCircleIcon size={24} />
                                                </button>
                                            </div>
                                            <div className="flex flex-col items-end justify-center gap-0">
                                                <Input
                                                    type="number"
                                                    className={"text-right"}
                                                    value={part.price}
                                                    onChange={(e) => handleUpdatePrice(part.id, e.target.value)}
                                                />
                                                <h1 className="text-xs text-right text-slate-500 mt-2">Subtotal: {formatNumber(part.quantity * part.price)}</h1>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            <h1 className="text-xs text-right text-slate-500 px-4">
                                {partCart?.length} item{partCart?.length > 1 && "s"}
                            </h1>
                            <div className="text-right px-4 pb-2">
                                <h1 className="text-xs text-slate-500">
                                    Biaya Jasa Teknisi (Service fees): <span className="block text-sm font-bold">Rp. 1.000.000</span>
                                </h1>
                                <h1 className="text-xs text-slate-500">
                                    Biaya Pengiriman (Shipping): <span className="block text-sm font-bold">Rp. 1.000.000</span>
                                </h1>
                                <h1 className="text-xs text-blue-500">
                                    Total: <span className="block text-2xl font-bold">{formatNumber(calculateTotalPrice())}</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
