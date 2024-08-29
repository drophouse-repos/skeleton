// src/App.js
import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import './ProductSection.css'
import cap from './cap.webp'
import front1 from './Sleevefront.webp'
import front2 from './Sleeve.webp'

const producttypes = [
  {
    name: 'T-shirt',
    price: 29.99,
    type: 'tshirt'
  },
  {
    name: 'Hoodie',
    price: 39.99,
    type: 'hoodie'
  },
  {
    name: 'Cap',
    price: 29.99,
    type: 'cap'
  },
  {
    name: 'Mug',
    price: 29.99,
    type: 'mug'
  }
];
// Sample product data
const products = [
  {
    name: 'Product 1',
    description: 'This is the first product.',
    price: 19.99,
    frontImage: cap, // Placeholder frontImage
    size: ['S','M'],
    type: 'cap',
    color: 'white'
  },
  {
    name: 'Product 2',
    description: 'This is the second product.',
    price: 29.99,
    frontImage: front1,
    backImage: front2,
    size: ['S','M','L','XL','2XL'],
    type: 'tshirt',
    color: 'white'
  },
  {
    name: 'Product 3',
    description: 'This is the third product.',
    price: 39.99,
    frontImage: 'https://via.placeholder.com/800x1000',
    type: 'mug',
    color: 'white'
  },
  {
    name: 'Product 4',
    description: 'This is the fourth product.',
    price: 39.99,
    frontImage: 'https://via.placeholder.com/800x1000',
    type: 'tshirt',
    color: 'white'
  },
  {
    name: 'Product 5',
    description: 'This is the fifth product.',
    price: 19.99,
    frontImage: 'https://via.placeholder.com/800x1000',
    type: 'tshirt',
    color: 'white'
  },
  {
    name: 'Product 6',
    description: 'This is the sixth product.',
    price: 29.99,
    frontImage: 'https://via.placeholder.com/800x1000',
    type: 'cap',
    color: 'white'
  }
];



const ProductSection = () => {
  const [ProductsList, setProductsList] = useState(products);
  const [selectedType, setSelectedType] = useState('All');
  const handleFilter = (apparel) => {
    setSelectedType(apparel);
    if (apparel === 'All') {
      setProductsList(products);
    } else {
      const filteredProducts = products.filter(product => product.type === apparel);
      setProductsList(filteredProducts);
    }
  };
  return (
    <div className='grid grid-cols-7 gap-4'>
    <div className='col-span-1 mt-24 text-left pl-10' style={{position: 'fixed'}}>
      <h2 className='text-left mb-10'><strong>Filters +</strong></h2>
      <ul className='text-left'>
      <li onClick={() => handleFilter('All')} className={`font-bold text-left text-gray-500 cursor-pointer ${selectedType === 'All' ? 'selected' : ''}`}>All</li>
        {producttypes.map((type) => (
          <>
            <li key={type.name} onClick={() => handleFilter(type.type)} className={`font-bold text-left text-gray-500 cursor-pointer ${selectedType === type.type ? 'selected' : ''}`}>{type.name}</li>
          </>
        ))}
      </ul>
    </div>
    <div className="col-start-2 col-span-6 product-card-catelog">
      {/* <h1>Product Showcase</h1> */}
      {ProductsList.length > 0 ? <ProductList products={ProductsList} /> : 
      <>
        <div className='product' style={{width: '84.5vw'}}>
        <h2>No Products Available</h2> 
        </div>
      </>}
      
    </div>
    </div>
  );
};

export default ProductSection;
