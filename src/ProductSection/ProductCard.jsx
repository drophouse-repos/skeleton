import React from 'react';
import { AppContext } from '../context/AppContext';
import { Orgcontext } from '../context/ApiContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './ProductCard.css'; // We'll style the card later

const ProductCard = ({ product }) => {
  const { greenmask, setGreenmask } = useContext(Orgcontext)
  const { apparel, setApparel, setColor } = useContext(AppContext);
  const navigate = useNavigate();

  const handleclick = (_greenmask, type, link) => {
    setGreenmask(_greenmask);
    setColor("white");
    setApparel(type);
    navigate(link);
  }

  const hasBackImage = product.backImage && product.backImage.trim() !== '';

  return (
    <div className="flex flex-col justify-between bg-white shadow-lg rounded-lg p-4 border border-gray-400">
      <div 
        className="image-container aspect-w-4 aspect-h-3 bg-gray-25 border border-gray-100 rounded-lg"  // Added border
        onClick={() => handleclick(product.greenmask, product.type, '/product')}
      >
        {/* Front Image */}
        <img
          src={product.frontImage}
          alt={`${product.name} front`}
          className={`product-images ${hasBackImage ? 'front' : 'no-back'} w-full h-full object-cover rounded-lg`}
        />
        {/* Back Image if available */}
        {hasBackImage && (
          <img
            src={product.backImage}
            alt={`${product.name} back`}
            className="product-images back w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      {/* Conditional rendering of product sizes */}
      {product.size && product.size.length > 0 && product.type && product.type !== 'mug' && product.type !== 'cap' && (
        <div className="product-sizes mt-2">
          <div className="size-box-parent flex flex-wrap gap-2">
            {product.size.map((size, index) => (
              <div key={index} className="size-box bg-gray-200 rounded-full px-4 py-1 text-sm">
                {size}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Info */}
      <div className="mt-4 text-center">
        <h2 className="product-name text-lg font-semibold">{product.name}</h2>
        <p className="product-price text-gray-700 font-bold">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;