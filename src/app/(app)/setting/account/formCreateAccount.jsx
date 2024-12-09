import Input from '@/components/Input'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'

const FormCreateAccount = ({ isModalOpen, notification, fetchAccount }) => {
    const [errors, setErrors] = useState([]) // Store validation errors
    const [categoryAccount, setCategoryAccount] = useState(null) // Set initial state to null
    const [newAccount, setNewAccount] = useState({
        name: '',
        category_id: '',
        st_balance: 0,
    })

    const fetchCategoryAccount = async () => {
        try {
            const response = await axios.get('api/auth/category-accounts')
            setCategoryAccount(response.data.data)
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }

    useEffect(() => {
        fetchCategoryAccount()
    }, [])

    const handleCreateAccount = async e => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/auth/accounts', newAccount)
            notification(response.data.message)
            if (response.status === 201) {
                // Reset form fields and close modal on success
                setNewAccount({
                    name: '',
                    category_id: '',
                    st_balance: 0,
                })
                isModalOpen(false)
                // console.log('Form reset:', newAccount, response.status)
                fetchAccount()
            }
        } catch (error) {
            // Check the structure of error.response.data before setting the error state
            let err = []
            if (error.response && error.response.data) {
                // Assuming error.response.data could be an array of messages or an object
                if (Array.isArray(error.response.data)) {
                    err = [...error.response.data]
                } else if (typeof error.response.data === 'string') {
                    err = [error.response.data]
                } else {
                    err = ['Something went wrong.']
                }
            } else {
                err = ['Network or server error. Please try again later.']
            }

            setErrors(err)
            console.log(err)
        }
    }
    return (
        <>
            {errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <form>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900">
                        Account Name
                    </label>
                    <Input
                        type="text"
                        id="name"
                        value={newAccount.name}
                        onChange={e =>
                            setNewAccount({
                                ...newAccount,
                                name: e.target.value,
                            })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="John Doe"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900">
                        Category
                    </label>
                    <select
                        id="category"
                        value={newAccount.category_id}
                        onChange={e =>
                            setNewAccount({
                                ...newAccount,
                                category_id: e.target.value,
                            })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Select Category</option>
                        {categoryAccount?.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="st_balance"
                        className="block mb-2 text-sm font-medium text-gray-900">
                        Starting Balance
                    </label>
                    <Input
                        type="number"
                        id="st_balance"
                        value={newAccount.st_balance}
                        onChange={e =>
                            setNewAccount({
                                ...newAccount,
                                st_balance: e.target.value,
                            })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="0"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => isModalOpen(false)}
                        className="text-white min-w-28 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-5 py-3 ">
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateAccount}
                        className="text-white min-w-28 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-3 ">
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}

export default FormCreateAccount
