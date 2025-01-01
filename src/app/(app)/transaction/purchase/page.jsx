'use client'
import { useState, useEffect } from 'react'
import Input from '@/components/Input'
import ProductCard from '@/components/ProductCard'
import axios from '@/lib/axios'
import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid'
import Header from '@/app/(app)/Header'

const Purchase = () => {
    return (
        <>
            <Header title="Purchase" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">You are logged in!</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Purchase
