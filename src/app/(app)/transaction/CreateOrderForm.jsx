import Button from '@/components/Button'
import Input from '@/components/Input'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const CreateOrderForm = ({ isModalOpen, notification, fetchOrder }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const [errors, setErrors] = useState([]) // Store validation errors
    const [newOrder, setNewOrder] = useState({
        customer_name: '',
        phone_type: '',
        phone_number: '',
        address: '',
        description: '',
        warehouse_id: user.role.warehouse_id,
        user_id: user.id,
    })

    const handleCreateOrder = async e => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/auth/orders', newOrder)
            notification(response.data.message)
            // Reset form fields and close modal on success
            setNewOrder({
                customer_name: '',
                phone_type: '',
                phone_number: '',
                address: '',
                description: '',
                user_id: user?.id,
                warehouse_id: user?.role?.warehouse_id,
            })
            fetchOrder()
        } catch (error) {
            setErrors(error.response?.data?.errors || ['Something went wrong.'])
        }
    }
    // console.log(newOrder)
    return (
        <div>
            <form>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                Customer Name
                            </label>
                            <Input
                                type="text"
                                value={newOrder.customer_name}
                                onChange={e =>
                                    setNewOrder({
                                        ...newOrder,
                                        customer_name: e.target.value,
                                    })
                                }
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    errors.customer_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Customer Name"
                            />
                            {errors.customer_name && <span className="text-red-500 text-xs">{errors.customer_name}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                Phone Number
                            </label>
                            <Input
                                type="text"
                                value={newOrder.phone_number}
                                onChange={e =>
                                    setNewOrder({
                                        ...newOrder,
                                        phone_number: e.target.value,
                                    })
                                }
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Phone Number"
                            />
                            {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                Address
                            </label>
                            <textarea
                                value={newOrder.address}
                                onChange={e =>
                                    setNewOrder({
                                        ...newOrder,
                                        address: e.target.value,
                                    })
                                }
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Address"
                            />
                            {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                Phone Type
                            </label>
                            <Input
                                type="text"
                                value={newOrder.phone_type}
                                onChange={e =>
                                    setNewOrder({
                                        ...newOrder,
                                        phone_type: e.target.value,
                                    })
                                }
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    errors.phone_type ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Phone Type"
                            />
                            {errors.phone_type && <span className="text-red-500 text-xs">{errors.phone_type}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                Description
                            </label>
                            <textarea
                                rows={5}
                                value={newOrder.description}
                                onChange={e =>
                                    setNewOrder({
                                        ...newOrder,
                                        description: e.target.value,
                                    })
                                }
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Description"
                            />
                            {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2                                      ">
                    {/* <button
                        type="button"
                        onClick={onclose}
                        className="outline outline-indigo-800 hover:bg-indigo-400 text-white font-bold py-2 px-6 rounded-xl">
                        Cancel
                    </button> */}
                    <Button onClick={handleCreateOrder} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateOrderForm
