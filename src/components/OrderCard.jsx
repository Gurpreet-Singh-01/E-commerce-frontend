const OrderCard = ({ order }) => {
  return (
    <div className="bg-surface shadow-md rounded-xl p-6 font-text space-y-4 max-w-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold font-headings text-neutral-dark">
          Order #{order.orderNumber}
        </h3>
        <span
          className={`text-xs sm:text-sm px-3 py-1 rounded-full capitalize font-medium ${
            order.status === 'delivered'
              ? 'bg-success text-secondary'
              : order.status === 'pending'
              ? 'bg-warning text-neutral-dark'
              : order.status === 'shipped'
              ? 'bg-accent text-secondary' 
              : 'bg-error text-secondary'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Order Info */}
      <div className="space-y-1 text-sm text-neutral">
        <p>
          <span className="font-medium">Total:</span> ₹{order.total.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Ordered on:</span>{' '}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Items */}
      <div>
        <p className="font-medium text-sm mb-1 text-neutral-dark">Items:</p>
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="text-sm text-neutral">
              {item.name} – {item.quantity} × ₹{item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder for Link */}
      <button
        disabled
        className="text-primary text-sm mt-2 block cursor-default opacity-60"
      >
        View Details (disabled for test)
      </button>
    </div>
  );
};

export default OrderCard;
