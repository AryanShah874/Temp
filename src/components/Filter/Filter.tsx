// src/components/Filter/Filter.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { filterByPrice } from '../../redux/slices/productSlice';
import './Filter.scss';

interface FilterProps {
  onFilterChange?: (min: number, max: number) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const dispatch = useAppDispatch();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleFilter = () => {
    const min = minPrice === '' ? 0 : parseFloat(minPrice);
    const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
    
    dispatch(filterByPrice({ min, max }));
    
    if (onFilterChange) {
      onFilterChange(min, max);
    }
  };

  return (
    <div className="filter-container">
      <h3>Filter Products</h3>
      
      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
        <button className="filter-button" onClick={handleFilter}>
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;