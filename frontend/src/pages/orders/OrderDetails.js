import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Order Details</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-bold text-lg">{order.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold">{order.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment</span>
              <div className="flex items-center">
                {order.isPaid ? (
                  <>
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-green-600">Paid</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-red-500 mr-2" />
                    <span className="text-red-600">Pending</span>
                  </>
                )}
              </div>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-600">Tracking</span>
                <div className="flex items-center">
                  <FaTruck className="mr-2" />
                  <span className="font-semibold">{order.trackingNumber}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-semibold">Order Items</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">📚</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Shipping Address</h3>
          <div className="text-gray-700">
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

