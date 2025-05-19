import OrderCard from './OrderCard';

const TestOrderCard = () => {
  const mockOrder = {
    id: '123',
    orderNumber: 'ORD-2025-001',
    status: 'shipped',
    total: 2999.99,
    createdAt: new Date().toISOString(),
    items: [
      { id: 'p1', name: 'Wireless Mouse', quantity: 1, price: 999.99 },
      { id: 'p2', name: 'Keyboard', quantity: 1, price: 2000.00 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <OrderCard order={mockOrder} />
    </div>
  );
};

export default TestOrderCard;
