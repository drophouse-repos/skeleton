import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css'; // We'll style the grid later

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
