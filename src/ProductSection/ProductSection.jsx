// src/App.js
import React from 'react';
import ProductList from './ProductList';
import front from './front.png'
import back from './Back.png'

// Sample product data
const products = [
  {
    name: 'Product 1',
    description: 'This is the first product.',
    price: 19.99,
    frontImage: front, // Placeholder frontImage
    backImage: back,
    size: ['S','M','L','XL','2XL']
  },
  {
    name: 'Product 2',
    description: 'This is the second product.',
    price: 29.99,
    frontImage: 'https://via.placeholder.com/510',
    size: ['S','M']
  },
  {
    name: 'Product 3',
    description: 'This is the third product.',
    price: 39.99,
    frontImage: 'https://via.placeholder.com/510',
  },
  {
    name: 'Product 4',
    description: 'This is the fourth product.',
    price: 39.99,
    frontImage: 'https://via.placeholder.com/510',
  },
  {
    name: 'Product 5',
    description: 'This is the fifth product.',
    price: 19.99,
    frontImage: 'https://via.placeholder.com/510', // Placeholder frontImage
  },
  {
    name: 'Product 6',
    description: 'This is the sixth product.',
    price: 29.99,
    frontImage: 'https://via.placeholder.com/510',
  },
  {
    name: 'Product 7',
    description: 'This is the seventh product.',
    price: 39.99,
    frontImage: 'https://via.placeholder.com/510',
  },
  {
    name: 'Product 8',
    description: 'This is the eighth product.',
    price: 39.99,
    frontImage: 'https://via.placeholder.com/510',
  },
  // Add more products as needed
];

const ProductSection = () => {
  return (
    <div className="product-card-catelog">
      {/* <h1>Product Showcase</h1> */}
      <ProductList products={products} />
    </div>
  );
};

export default ProductSection;
