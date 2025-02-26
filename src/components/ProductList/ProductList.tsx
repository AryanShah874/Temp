// src/components/ProductList/ProductList.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProducts, fetchCategories, sortProducts } from '../../redux/slices/productSlice';
import ProductCard from '../ProductCard/ProductCard';
import { SortOption, SortDirection } from '../../types';
import './ProductList.scss';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, status, error, categories, sortBy, sortDirection } = useAppSelector(state => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOption;
    dispatch(sortProducts({ sortBy: value, direction: sortDirection }));
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortDirection;
    dispatch(sortProducts({ sortBy, direction: value }));
  };

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Products</h2>
        <div className="sort-controls">
          <div className="sort-control">
            <label>Sort by:</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <div className="sort-control">
            <label>Order:</label>
            <select value={sortDirection} onChange={handleDirectionChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="product-list">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;