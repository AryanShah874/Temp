// src/components/ProductCard/ProductCard.tsx
import React from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addToCart } from '../../redux/slices/cartSlice';
import { Product } from '../../types';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <div className="product-name">{product.title.substring(0, 20)}</div>
      <div className="product-price">Price: $ {product.price}</div>
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;