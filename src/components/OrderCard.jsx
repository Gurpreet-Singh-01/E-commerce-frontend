const OrderCard = ({ order }) => {
  return (
    <div className="bg-surface shadow-md rounded-lg p-4 font-text max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold font-headings">Order #{order.orderNumber}</h3>
        <span
          className={`text-sm px-2 py-1 rounded ${
            order.status === 'delivered'
              ? 'bg-success text-secondary'
              : order.status === 'pending'
              ? 'bg-warning text-neutral-dark'
              : 'bg-error text-secondary'
          }`}
        >
          {order.status}
        </span>
      </div>

      <p className="text-neutral text-sm mt-2">Total: ₹{order.total.toFixed(2)}</p>
      <p className="text-neutral text-sm">
        Ordered on: {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <ul className="mt-2 space-y-1">
        {order.items.map((item) => (
          <li key={item.id} className="text-sm text-neutral">
            {item.name} – {item.quantity} x ₹{item.price.toFixed(2)}
          </li>
        ))}
      </ul>

      {/* Replaced Link with Button for test */}
      <button
        disabled
        className="text-primary text-sm mt-2 block cursor-default opacity-60"
      >
        View Details (link disabled for preview)
      </button>
    </div>
  );
};

export default OrderCard;
