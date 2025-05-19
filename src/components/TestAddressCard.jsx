import React from 'react'
import { toast } from 'react-toastify'
import AddressCard from './AddressCard'
const TestAddressCard = () => {
    const testAddresss = {
        id: 1,
        houseNumber: '595/D',
        street: 'Radnom mohaale di random gali',
        colony: 'Sada Mohalla',
        city: 'Peshawar',
        state: 'Kuch Ta hai',
        country: 'Akhand Bharat',
        postal: '786'
    }

    const handleEdit = (id) => {
        toast.success(`Edit clicked for address ID: ${id}`)
    }
    const handleDelete = (id) => {
        toast.info(`Delete clicked for address ID: ${id}`);
    };
    return (
        <div className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
            <AddressCard
                address={testAddresss}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDefault={true}
            />
        </div>

    )
}

export default TestAddressCard