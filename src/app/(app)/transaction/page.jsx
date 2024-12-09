import Link from 'next/link'
import Header from '../Header'

const Transaction = () => {
    return (
        <>
            <Header title="Transaction" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div>
                                <Link
                                    href="/transaction/sales"
                                    className="btn btn-primary">
                                    Add New Sales
                                </Link>
                                <Link
                                    href="/transaction/purchase"
                                    className="btn btn-primary ml-4">
                                    Add New Purchase
                                </Link>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr className="">
                                        <th className="text-start p-4">
                                            Customer / Supplier
                                        </th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td className="text-start p-4">
                                            Customer / Supplier
                                        </td>
                                        <td>Amount</td>
                                        <td>Action</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transaction
