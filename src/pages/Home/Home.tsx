// src/pages/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProducts, fetchCategories } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryList from '../../components/CategoryList/CategoryList';
import Filter from '../../components/Filter/Filter';
import './Home.scss';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, status, error, categories } = useAppSelector(state => state.products);
  const [currentFilters, setCurrentFilters] = useState({ min: 0, max: Infinity });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Handle filter changes
  const handleFilterChange = (min: number, max: number) => {
    setCurrentFilters({ min, max });
  };

  // Group products by category
  const productsByCategory: Record<string, any[]> = {};
  
  if (filteredProducts.length > 0) {
    filteredProducts.forEach(product => {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = [];
      }
      productsByCategory[product.category].push(product);
    });
  }

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <div className="main-content-wrapper">
        <div className="sidebar">
          <CategoryList />
          <Filter onFilterChange={handleFilterChange} />
        </div>
        <div className="content-area">
          {Object.keys(productsByCategory).map(category => (
            <div key={category} className="category-section">
              <h2 className="section-title">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="product-grid">
                {productsByCategory[category].slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;