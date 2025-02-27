import formatDateTime from "@/libs/formatDateTime";
import Link from "next/link";

const OrderCard = ({ order }) => {
    return (
        <div className="bg-white rounded-2xl px-4 py-4 shadow-md">
            <div className="flex justify-between items-top">
                <div className="flex gap-2 items-top">
                    <div className="bg-green-500 rounded-lg p-4 font-bold text-white">{order.warehouse.code}</div>
                    <div className="flex flex-col">
                        <h1 className="text-xs font-bold max-w-36 text-nowrap overflow-hidden">{order.contact.name}</h1>
                        <h1 className="text-xs text-slate-500">{order.contact.phone_number}</h1>
                        <h1 className="text-xs text-slate-500">{formatDateTime(order.created_at)}</h1>
                    </div>
                </div>
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs h-fit rounded-md">{order.status}</span>
            </div>
            <div className="mt-2">
                <h1 className="text-xs font-bold text-slate-700 block mb-1">{order.phone_type.toUpperCase()}</h1>
                <div className="p-2 rounded-lg bg-slate-300">
                    <h1 className="text-xs text-slate-700">Note: "{order.description}"</h1>
                </div>
            </div>

            {/* table of part replacement */}
            {order.journal?.length > 0 && (
                <>
                    <div className="mt-4">
                        <h1 className="text-left text-xs font-semibold text-slate-500 mb-2">Part Replacement</h1>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dashed border-slate-300">
                                    <th className="text-left text-xs font-semibold p-1 text-slate-700">Part</th>
                                    <th className="text-right text-xs font-semibold p-1 text-slate-700">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={2} className="text-left text-xs text-slate-700">
                                        LCD Premium Iphone 13
                                    </td>
                                </tr>
                                <tr className="border-b border-dashed border-slate-300">
                                    <td className="text-xs text-slate-700 p-1">x 1</td>
                                    <td className="text-right text-xs text-slate-700 p-1">Rp. 1.000.000</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="text-left text-xs text-slate-700">
                                        Battery
                                    </td>
                                </tr>
                                <tr className="border-b border-dashed border-slate-300">
                                    <td className="text-xs text-slate-700 p-1">x 1</td>
                                    <td className="text-right text-xs text-slate-700 p-1">Rp. 1.000.000</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="text-left text-xs text-slate-700">
                                        Camera
                                    </td>
                                </tr>
                                <tr className="border-b border-dashed border-slate-300">
                                    <td className="text-xs text-slate-700 p-1">x 1</td>
                                    <td className="text-right text-xs text-slate-700 p-1">Rp. 1.000.000</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className=" text-xs font-semibold text-slate-700 px-1 py-2">Total</td>
                                    <td className="text-right text-xs font-semibold text-slate-700 px-1 py-2">Rp. 3.000.000</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-left text-xs font-semibold text-slate-500 mb-2">Biaya lainnya</h1>
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b border-dashed border-slate-300">
                                    <td className="text-xs text-slate-700 p-1">Service fees</td>
                                    <td className="text-right text-xs text-slate-700 p-1">Rp. 1.000.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            <div className="mt-4">
                <div className="flex justify-between">
                    <h1 className="text-sm font-bold text-slate-700">Total</h1>
                    <h1 className="text-sm font-bold text-slate-700">Rp. 4.000.000</h1>
                </div>
                <h1 className="text-xs font-semibold text-slate-600">Teknisi: fend</h1>
                <div className="flex gap-2 mt-4">
                    <Link href={`/order/${order.id}`} className="rounded-2xl w-full px-6 py-3 bg-yellow-300 hover:bg-yellow-200 border text-center">
                        Detail
                    </Link>
                    {order.journal?.length > 0 && <button className="rounded-2xl w-full px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white border">Pay</button>}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
