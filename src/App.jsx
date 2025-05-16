import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store/cartSlice';

const App = () => {
  // Testing Add to cart
  const dispatch = useDispatch();
  const {items,totalQuantity,totalPrice} = useSelector((state) =>state.cart)

  const testItem = {
    id:'1',
    name:"Test Prod",
    price: 100,
    image:'https://images.pexels.com/photos/32087013/pexels-photo-32087013/free-photo-of-contemplative-woman-leaning-on-disco-ball.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=loadhttps://images.pexels.com/photos/32087013/pexels-photo-32087013/free-photo-of-contemplative-woman-leaning-on-disco-ball.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
  }
  return (
    <div className='min-h-screen bg-secondary text-primary p-4'>
      <h1 className='text-3xl font-bold text-center'>Cart: {totalQuantity} items, Rs{totalPrice}</h1>
      <button
        className='bg-primary text-secondary px-4 py-2 rounded'
        onClick={()=>dispatch(addToCart(testItem))}
      >Test Cart</button>

      <ul>
        {items.map((item) =>(
          <li key={item.id}>{item.name} - {item.price} * {item.quantity}</li>
        ))}
      </ul>

    </div>
  );
};

export default App;
