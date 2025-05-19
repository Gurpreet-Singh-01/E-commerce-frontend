import React from 'react'
import Button from './Button'

const AddressCard = ({ address, onEdit, onDelete, isDefault }) => {
    return (
        <div>
            <div className='bg-surface shadow-md roudned-lg p-4 relative font-text'>
                {isDefault && (
                    <span
                        className='absolute top-2 right-2 bg-success text-secondary text-xs px-2 py-1 rounded'
                    >Default</span>
                )}

                <p className="text-neutral-dark font-medium font-headings">{address.houseNumber}, {address.street}</p>
                <p className="text-neutral text-sm">{address.colony}, {address.city}</p>
                <p className="text-neutral text-sm">{address.state}, {address.country} - {address.postalCode}</p>
            </div>
            <div className="flex space-x-2 mt-4">
                <Button variant="secondary" size="small" onClick={() => onEdit(address.id)}>
                    Edit
                </Button>
                <Button variant="danger" size="small" onClick={() => onDelete(address.id)}>
                    Delete
                </Button>
            </div>
        </div>
    )
}

export default AddressCard