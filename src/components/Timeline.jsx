'use client'
import { EyeIcon, WrenchIcon, DocumentCheckIcon, CheckBadgeIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid'

const Timeline = ({ status }) => {
    const steps = [
        {
            id: 1,
            name: 'Pending',
            icon: DocumentCheckIcon,
            color: 'yellow-400',
        },
        { id: 2, name: 'Diagnosing', icon: EyeIcon, color: 'yellow-400' },
        { id: 3, name: 'Repairing', icon: WrenchIcon, color: 'yellow-400' },
        {
            id: 4,
            name: 'Finished',
            icon: ClipboardDocumentCheckIcon,
            color: 'green-400',
        },
        {
            id: 5,
            name: 'Completed',
            icon: CheckBadgeIcon,
            color: 'green-500',
        },
    ]

    // Tentukan langkah aktif berdasarkan status
    const currentStep = steps.findIndex(step => step.name.toLowerCase() === status?.toLowerCase()) + 1 || 0

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="flex space-x-8 relative">
                {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep >= step.id
                    const isLastStep = index === steps.length - 1

                    return (
                        <div key={step.id} className="flex flex-col items-center text-center">
                            <div className="relative">
                                {/* Icon Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all 
                  ${isActive ? `bg-${step.color} border-${step.color}` : 'bg-gray-200 border-gray-300'}`}>
                                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                </div>

                                {/* Connecting Line */}
                                {!isLastStep && (
                                    <div
                                        className={`absolute top-5 left-10 w-16 h-1 ${
                                            currentStep > step.id ? `bg-${steps[index + 1].color}` : 'bg-gray-300'
                                        }`}></div>
                                )}
                            </div>
                            <span className={`text-sm mt-2 ${isActive ? 'text-black font-semibold' : 'text-gray-500'}`}>{step.name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Timeline
