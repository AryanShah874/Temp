// src/pages/ProductCategory/ProductCategory.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProductsByCategory, filterByPrice, sortProducts } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryList from '../../components/CategoryList/CategoryList';
import Filter from '../../components/Filter/Filter';
import { SortOption, SortDirection } from '../../types';
import './ProductCategory.scss';

const ProductCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();
  const { filteredProducts, status, error, sortBy, sortDirection } = useAppSelector(state => state.products);
  const [currentFilters, setCurrentFilters] = useState({ min: 0, max: Infinity });

  useEffect(() => {
    if (category) {
      dispatch(fetchProductsByCategory(category));
      
      // Re-apply filters after category change
      setTimeout(() => {
        dispatch(filterByPrice(currentFilters));
      }, 100); // Small delay to ensure category products are loaded first
    }
  }, [category, dispatch]);

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
    <div className="category-page">
      <div className="category-header">
        <h1>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Products'}</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link> / {category}
        </div>
      </div>
      
      <div className="category-content">
        <div className="sidebar">
          <CategoryList />
          <Filter onFilterChange={(min, max) => setCurrentFilters({ min, max })} />
        </div>
        
        <div className="product-area">
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
            
            <label>Order:</label>
            <select value={sortDirection} onChange={handleDirectionChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;