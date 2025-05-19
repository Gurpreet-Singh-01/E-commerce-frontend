import Button from './Button';

const AddressCard = ({ address, onEdit, onDelete, isDefault }) => {
  return (
    <div className="bg-surface shadow-md rounded-lg p-5 relative font-text space-y-2">
      {isDefault && (
        <span className="absolute top-3 right-3 bg-success text-secondary text-xs px-2 py-2 rounded z-10 shadow">
          Default
        </span>
      )}

      <div className="space-y-1 mt-1 pr-16">
        <p className="text-neutral-dark font-medium font-headings">
          {address.houseNumber}, {address.street}
        </p>
        <p className="text-neutral text-sm">
          {address.colony}, {address.city}
        </p>
        <p className="text-neutral text-sm">
          {address.state}, {address.country} - {address.postalCode}
        </p>
      </div>

      <div className="flex space-x-2 pt-3">
        <Button
          variant="secondary"
          size="medium"
          onClick={() => onEdit(address.id)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="medium"
          onClick={() => onDelete(address.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AddressCard;
