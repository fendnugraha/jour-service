'use client'
import Header from '@/app/(app)/Header'
import { ClipboardDocumentListIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid'
import axios from '@/lib/axios'
import { useEffect, useState, useMemo } from 'react'
import formatNumber from '@/lib/formatNumber'

const Profitloss = () => {
    const [profitloss, setProfitloss] = useState(null) // Initialize as null
    const [loading, setLoading] = useState(true) // Add a loading state
    const [error, setError] = useState(null) // Add an error state

    useEffect(() => {
        const fetchProfitloss = async () => {
            try {
                const res = await axios.get('/api/auth/get-profit-loss-report')
                setProfitloss(res.data)
                setLoading(false) // Data is now loaded
            } catch (error) {
                console.log(error)
                setError('There was an error fetching the profit and loss data.')
                setLoading(false) // Set loading to false even if there's an error
            }
        }
        fetchProfitloss()
    }, [])

    // Show loading indicator
    if (loading) {
        return (
            <div className="text-center py-12">
                <h2>Loading...</h2>
                {/* You can replace the text with a spinner if you like */}
            </div>
        )
    }

    // Show error message if there's an error
    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-red-500">{error}</h2>
            </div>
        )
    }

    // Safely access the nested properties
    const totalRevenue = profitloss?.data?.revenue?.total || 0
    const accounts = profitloss?.data?.revenue?.accounts || []
    console.log(accounts)
    // // Safely access data
    const revenueData = profitloss.data.revenue.accounts
        ? Object.values(profitloss.data.revenue.accounts).map(account => ({
              account_name: account.acc_name,
              balance: account.balance,
          }))
        : []

    const costData = profitloss.data.cost.accounts
        ? Object.values(profitloss.data.cost.accounts).map(account => ({
              account_name: account.acc_name,
              balance: account.balance,
          }))
        : []

    const expenseData = profitloss.data.expense.accounts
        ? Object.values(profitloss.data.expense.accounts).map(account => ({
              account_name: account.acc_name,
              balance: account.balance,
          }))
        : []

    // Combine the data
    const allData = {
        revenue: revenueData,
        cost: costData,
        expense: expenseData,
    }

    return (
        <>
            <Header title="Setting" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <div className="text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="px-4 py-2 sm:p-4 bg-gray-600 text-white shadow-sm rounded-xl">
                                    <h5 className="">Total Revenue</h5>
                                    <h2 className="text-end font-bold text-3xl">
                                        <CurrencyDollarIcon className="w-8 h-8 inline" /> {formatNumber(totalRevenue)}
                                    </h2>
                                </div>
                                <div className="px-4 py-2 sm:p-4 bg-gray-600 text-white shadow-sm rounded-xl">
                                    <h5 className="">Net Profit</h5>
                                    <h2 className="text-end font-bold text-3xl">
                                        <ClipboardDocumentListIcon className="w-8 h-8 inline" /> 200000
                                    </h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                <div className="">
                                    <table className="table-auto w-full text-sm mb-2 bg-white">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="p-2 sm:p-3 text-start">Account Name</th>
                                                <th className="text-end p-2 sm:p-3">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {revenueData.map((item, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2 sm:p-3 text-start">{item.account_name}</td>
                                                    <td className="text-end p-2 sm:p-3">{formatNumber(item.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profitloss
