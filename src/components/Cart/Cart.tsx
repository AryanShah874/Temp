// src/components/Cart/Cart.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  checkout 
} from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import './Cart.scss';

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, checkoutComplete } = useAppSelector(state => state.cart);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleIncreaseQuantity = (id: number) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id: number) => {
    dispatch(decreaseQuantity(id));
  };

  const handleCheckout = () => {
    dispatch(checkout());
    // Navigate to checkout confirmation page
    navigate('/checkout-confirmation');
  };

  if (checkoutComplete) {
    return (
      <div className="cart-container">
        <div className="checkout-success">
          <h2>Thank you for your order!</h2>
          <p>Your order has been placed successfully.</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to see them here.</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-price">${item.price.toFixed(2)} each</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleDecreaseQuantity(item.id)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
              </div>
              <p className="item-subtotal">
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button 
                className="remove-item" 
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="total-amount">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;