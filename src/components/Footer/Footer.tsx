// src/components/Footer/Footer.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add subscription logic here
    console.log('Subscribing email:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <form onSubmit={handleSubscribe} className="subscribe-form">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button type="submit" className="subscribe-button">SUBSCRIBE</button>
        </form>
        
        <div className="footer-links">
          <Link to="/best-sellers">Best Sellers</Link>
          <Link to="/gift-ideas">Gift Ideas</Link>
          <Link to="/new-releases">New Releases</Link>
          <Link to="/today-deals">Today's Deals</Link>
          <Link to="/customer-service">Customer Service</Link>
        </div>
        
        <div className="help-line">
          <p>Help Line Number : +1 1800 1200 1200</p>
        </div>
        
        <div className="copyright">
          <p>© 2020 All Rights Reserved. Design by Free html Templates</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;