// src/components/CategoryList/CategoryList.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProductsByCategory, filterByCategory } from '../../redux/slices/productSlice';
import './CategoryList.scss';

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(state => state.products);

  const handleCategoryClick = (category: string | null) => {
    if (category === null) {
      dispatch(filterByCategory(null));
    } else {
      dispatch(fetchProductsByCategory(category));
    }
  };

  return (
    <div className="category-list">
      <h3>Categories</h3>
      <ul>
        <li 
          className={currentCategory === null ? 'active' : ''} 
          onClick={() => handleCategoryClick(null)}
        >
          All Products
        </li>
        {categories.map(category => (
          <li 
            key={category} 
            className={currentCategory === category ? 'active' : ''}
            onClick={() => handleCategoryClick(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;