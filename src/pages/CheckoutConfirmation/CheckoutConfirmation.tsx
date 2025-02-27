// src/pages/CheckoutConfirmation/CheckoutConfirmation.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import './CheckoutConfirmation.scss';

const CheckoutConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { checkoutComplete } = useAppSelector(state => state.cart);
  
  useEffect(() => {
    // If checkout is not complete, redirect to home
    if (!checkoutComplete) {
      navigate('/');
    }
  }, [checkoutComplete, navigate]);

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="checkout-confirmation">
      <h1>Thank You for Your Order!</h1>
      <p>
        Your order has been received and is being processed. 
        You will receive a confirmation email shortly.
      </p>
      <p className="order-number">
        Order Number: #{orderNumber}
      </p>
      <button 
        className="continue-shopping" 
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CheckoutConfirmation;