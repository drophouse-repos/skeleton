// src/components/ProductCard.js
import React from 'react';
import './ProductCard.css'; // We'll style the card later

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
        <div className="image-container">
        <img src={product.image} alt={product.name} className="product-images" />
        {product.size && product.size.length > 0 && (
          <div className="product-sizes">
            {product.size.map((size, index) => (
              <div key={index} className="size-box">
                {size}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="product-name">{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
