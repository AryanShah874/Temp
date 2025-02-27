// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useAppSelector(state => state.cart.items);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Search for:', searchQuery);
  };

  return (
    <div className="header-container">
      <div className="header">
        <div className="logo">
          <Link to="/">
            <div className="logo-box">Kickdrum</div>
          </Link>
        </div>
        <div className="search-cart">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search this blog"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search">🔍</i>
            </button>
          </form>
          <Link to="/cart" className="cart-link">
            <span>CART</span>
            {cartItemCount > 0 && <span className="cart-count">({cartItemCount})</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;