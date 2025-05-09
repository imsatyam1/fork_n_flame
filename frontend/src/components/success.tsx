import { CartItem } from '@/types/cartTypes';
import { cartItems } from '@/types/orderType';
import { IndianRupee, CheckCircle, Clock, Truck, CookingPot, BadgeCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Order = {
  cartItem: cartItems[];
  status: string;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className='mx-auto text-yellow-500 w-12 h-12 mb-2' />;
    case 'preparing':
      return <CookingPot className='mx-auto text-orange-500 w-12 h-12 mb-2' />;
    case 'out for delivery':
      return <Truck className='mx-auto text-blue-500 w-12 h-12 mb-2' />;
    case 'delivered':
      return <BadgeCheck className='mx-auto text-green-600 w-12 h-12 mb-2' />;
    default:
      return <CheckCircle className='mx-auto text-green-500 w-12 h-12 mb-2' />;
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Your order is pending confirmation.';
    case 'preparing':
      return 'We are preparing your delicious food.';
    case 'out for delivery':
      return 'Your order is on the way!';
    case 'delivered':
      return 'Order delivered successfully!';
    default:
      return 'Your order has been successfully placed.';
  }
};

const Success = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders([
      {
        status: '',
        cartItem: [
          {
            menuId: '1',
            name: 'Rasgulla',
            image: 'https://via.placeholder.com/100',
            price: '50',
            quantity: '2'
          }
        ]
      }
    ]);
  }, []);

  if (orders.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h1 className='font-bold text-2xl text-gray-700 dark:text-gray-300'>
          Order not found!
        </h1>
      </div>
    );
  }

  const currentOrder = orders[0];

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4'>
      <div className='bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-2xl w-full'>
        <div className='text-center mb-8'>
          {getStatusIcon(currentOrder.status)}
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-200'>
            {currentOrder.status === 'delivered' ? 'Order Delivered' : 'Order Status'}
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            {getStatusMessage(currentOrder.status)}
          </p>
          <p className='mt-2 text-base text-gray-700 dark:text-gray-300'>
            Status: <span className='font-medium capitalize text-blue-600'>{currentOrder.status}</span>
          </p>
        </div>

        <div className='space-y-6'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>
            Order Summary
          </h2>

          {orders.map((order, index) => (
            <div key={index} className='space-y-4'>
              {order.cartItem.map((item, i) => (
                <div
                  key={i}
                  className='flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm'
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-16 h-16 rounded-md object-cover'
                  />
                  <div className='ml-4 flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                      {item.name}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className='flex items-center text-gray-800 dark:text-gray-200'>
                    <IndianRupee className='w-4 h-4 mr-1' />
                    <span className='text-base font-medium'>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Success;
